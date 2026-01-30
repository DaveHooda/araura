import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { calculateAuroraScore, shouldSendAlert } from '@/lib/scoring'
import type { Location, AuroraData, WeatherData, AirQualityData } from '@/types'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || ''
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY is not set' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  // Fetch all alert-enabled saved locations with user profile and location data
  const { data: saved, error } = await supabaseAdmin
    .from('saved_locations')
    .select('id, alert_min_kp, user:profiles(email, display_name), location:locations(*)')
    .eq('alert_enabled', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!saved || saved.length === 0) {
    return NextResponse.json({ message: 'No alert-enabled saved locations' })
  }

  // Fetch aurora data once (shared for all locations)
  const auroraRes = await fetch(`${APP_URL}/api/aurora`, { cache: 'no-store' })
  const auroraData = auroraRes.ok ? ((await auroraRes.json()) as AuroraData) : null

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  await Promise.all(
    saved.map(async (item: any) => {
      if (!item.location || !item.user?.[0]?.email) {
        skipped += 1
        return
      }

      const location = item.location as Location
      const userEmail = item.user[0].email
      const userName = item.user[0].display_name

      // Fetch weather
      const weatherRes = await fetch(
        `${APP_URL}/api/weather?lat=${location.latitude}&lon=${location.longitude}`,
        { cache: 'no-store' }
      )
      const weatherData = weatherRes.ok
        ? ((await weatherRes.json()) as WeatherData)
        : null

      // Fetch air quality
      const airRes = await fetch(
        `${APP_URL}/api/air-quality?lat=${location.latitude}&lon=${location.longitude}`,
        { cache: 'no-store' }
      )
      const airQualityData = airRes.ok
        ? ((await airRes.json()) as AirQualityData)
        : null

      // Calculate score
      const { total_score, viewing_recommendation } = calculateAuroraScore(
        location,
        auroraData,
        weatherData,
        airQualityData
      )

      const kpIndex = auroraData?.kp_index ?? 0
      const cloudCoverage = weatherData?.cloud_coverage ?? 100

      // Respect user minimum Kp
      if (kpIndex < item.alert_min_kp) {
        skipped += 1
        return
      }

      const shouldAlert = shouldSendAlert(
        total_score,
        viewing_recommendation,
        kpIndex,
        cloudCoverage
      )

      if (!shouldAlert) {
        skipped += 1
        return
      }

      try {
        const subject = `Aurora alert for ${location.name}: Kp ${kpIndex}`
        const text = [
          `Hi ${userName || 'there'},`,
          '',
          `Conditions look good for aurora viewing near ${location.name}.`,
          `Score: ${total_score} (${viewing_recommendation})`,
          `Kp index: ${kpIndex}`,
          `Cloud cover: ${cloudCoverage}%`,
          location.bortle_scale
            ? `Light pollution (Bortle): ${location.bortle_scale}`
            : null,
          '',
          'Safe travels and clear skies!'
        ]
          .filter(Boolean)
          .join('\n')

        await resend.emails.send({
          from: 'Aurora Alerts <alerts@araura.app>',
          to: userEmail,
          subject,
          text,
        })
        sent += 1
      } catch (err) {
        errors.push(`Failed to send to ${userEmail}: ${(err as Error).message}`)
      }
    })
  )

  return NextResponse.json({
    sent,
    skipped,
    errors,
  })
}
