import { NextResponse } from 'next/server'

// Cache duration in seconds
const CACHE_DURATION = 30 * 60 // 30 minutes

export async function GET() {
  try {
    // Fetch current Kp index from NOAA SWPC
    const kpResponse = await fetch(
      'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
      { next: { revalidate: CACHE_DURATION } }
    )

    if (!kpResponse.ok) {
      throw new Error('Failed to fetch Kp index')
    }

    const kpData = await kpResponse.json()
    
    // Fetch 3-day forecast
    const forecastResponse = await fetch(
      'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json',
      { next: { revalidate: CACHE_DURATION } }
    )

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch Kp forecast')
    }

    const forecastData = await forecastResponse.json()

    // Parse current Kp (skip header row, get latest entry)
    const latestKp = kpData[kpData.length - 1]
    const currentKp = parseFloat(latestKp[1])

    // Parse forecast (skip header row)
    const forecast = forecastData.slice(1).map((entry: string[]) => ({
      time: entry[0],
      kp: parseFloat(entry[1]),
    }))

    return NextResponse.json({
      kp_index: currentKp,
      forecast: forecast.slice(0, 12), // Next 12 periods (3 hours each = 36 hours)
      updated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching aurora data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch aurora data' },
      { status: 500 }
    )
  }
}
