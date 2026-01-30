import { NextRequest, NextResponse } from 'next/server'

// Cache duration in seconds
const CACHE_DURATION = 60 * 60 // 1 hour

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

    // Use Open-Meteo (completely free, no API key)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover,temperature_2m,visibility,relative_humidity_2m,weather_code&timezone=auto`

    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATION },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()

    // Map weather codes to descriptions
    const weatherCodeMap: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    }

    return NextResponse.json({
      cloud_coverage: data.current.cloud_cover || 0,
      temperature: data.current.temperature_2m || 0,
      visibility: data.current.visibility || 10000,
      humidity: data.current.relative_humidity_2m || 0,
      conditions: weatherCodeMap[data.current.weather_code] || 'Unknown',
      updated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}
