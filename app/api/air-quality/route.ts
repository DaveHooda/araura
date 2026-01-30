import { NextRequest, NextResponse } from 'next/server'

// Cache duration in seconds
const CACHE_DURATION = 6 * 60 * 60 // 6 hours

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Missing lat or lon parameters' },
        { status: 400 }
      )
    }

    // Use OpenAQ API (free, no API key needed)
    const url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=50000&limit=1`

    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATION },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        aqi: 50,
        pm25: null,
        category: 'Good',
        updated_at: new Date().toISOString(),
      })
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({
        aqi: 50,
        pm25: null,
        category: 'Good',
        updated_at: new Date().toISOString(),
      })
    }

    const location = data.results[0]
    const pm25Measurement = location.measurements?.find((m: any) => m.parameter === 'pm25')
    const pm25Value = pm25Measurement?.value || null

    // Calculate AQI from PM2.5 (simplified EPA calculation)
    let aqi = 50
    if (pm25Value !== null) {
      if (pm25Value <= 12.0) {
        aqi = (pm25Value / 12.0) * 50
      } else if (pm25Value <= 35.4) {
        aqi = ((pm25Value - 12.1) / (35.4 - 12.1)) * 49 + 51
      } else if (pm25Value <= 55.4) {
        aqi = ((pm25Value - 35.5) / (55.4 - 35.5)) * 49 + 101
      } else if (pm25Value <= 150.4) {
        aqi = ((pm25Value - 55.5) / (150.4 - 55.5)) * 49 + 151
      } else if (pm25Value <= 250.4) {
        aqi = ((pm25Value - 150.5) / (250.4 - 150.5)) * 99 + 201
      } else {
        aqi = ((pm25Value - 250.5) / (500.4 - 250.5)) * 199 + 301
      }
    }

    // Categorize AQI
    let category = 'Good'
    if (aqi > 300) category = 'Hazardous'
    else if (aqi > 200) category = 'Very Unhealthy'
    else if (aqi > 150) category = 'Unhealthy'
    else if (aqi > 100) category = 'Unhealthy for Sensitive Groups'
    else if (aqi > 50) category = 'Moderate'

    return NextResponse.json({
      aqi: Math.round(aqi),
      pm25: pm25Value,
      category,
      updated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching air quality data:', error)
    return NextResponse.json({
      aqi: 50,
      pm25: null,
      category: 'Good',
      updated_at: new Date().toISOString(),
    })
  }
}
