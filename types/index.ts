export interface Location {
  id: string
  name: string
  description: string | null
  latitude: number
  longitude: number
  country: string
  region: string | null
  tier: 1 | 2 | 3
  bortle_scale: number | null
  accessibility: 'easy' | 'moderate' | 'difficult'
  amenities: {
    parking?: boolean
    accommodation?: boolean
    food?: boolean
    restrooms?: boolean
    [key: string]: boolean | undefined
  }
  best_months: number[]
  nearby_city: string | null
  nearby_airport: string | null
  created_at: string
}

export interface SavedLocation {
  id: string
  user_id: string
  location_id: string
  notes: string | null
  alert_enabled: boolean
  alert_min_kp: number
  created_at: string
  updated_at: string
  location?: Location
}

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  email: string | null
  avatar_url: string | null
  notification_preferences: {
    email_alerts: boolean
    alert_min_kp: number
  }
  created_at: string
  updated_at: string
}

export interface AuroraData {
  kp_index: number
  forecast: Array<{
    time: string
    kp: number
  }>
  updated_at: string
}

export interface WeatherData {
  cloud_coverage: number
  temperature: number
  visibility: number
  humidity: number
  conditions: string
  updated_at: string
}

export interface AirQualityData {
  aqi: number
  pm25: number | null
  category: string
  updated_at: string
}

export interface LocationScore {
  location: Location
  total_score: number
  scores: {
    latitude: number
    kp_index: number
    clouds: number
    light_pollution: number
    moon_phase: number
    air_quality: number
  }
  aurora_data: AuroraData | null
  weather_data: WeatherData | null
  air_quality_data: AirQualityData | null
  viewing_recommendation: 'excellent' | 'good' | 'moderate' | 'poor' | 'not-visible'
}
