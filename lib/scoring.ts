import type { Location, AuroraData, WeatherData, AirQualityData } from '@/types'

interface ScoreComponents {
  latitude: number
  kp_index: number
  clouds: number
  light_pollution: number
  moon_phase: number
  air_quality: number
}

interface ScoreWeights {
  latitude: number
  kp_index: number
  clouds: number
  light_pollution: number
  moon_phase: number
  air_quality: number
}

// Weights optimized for Northern hemisphere aurora viewing
const WEIGHTS: ScoreWeights = {
  latitude: 0.25,      // Location in aurora belt
  kp_index: 0.25,      // Aurora activity level
  clouds: 0.20,        // Clear skies critical
  light_pollution: 0.15, // Darkness matters
  moon_phase: 0.10,    // Moon brightness impact
  air_quality: 0.05,   // Visibility/clarity
}

/**
 * Calculate latitude score optimized for Northern hemisphere aurora viewing
 * Sweet spot: 65-72°N (directly under aurora oval)
 */
function calculateLatitudeScore(lat: number): number {
  if (lat >= 65 && lat <= 72) return 100 // Optimal aurora oval
  if (lat >= 60 && lat < 65) return 90   // Very good
  if (lat >= 55 && lat < 60) return 70   // Good during active periods
  if (lat >= 50 && lat < 55) return 50   // Requires strong activity
  if (lat >= 45 && lat < 50) return 30   // Only during extreme storms
  return 10 // Below 45°N rarely sees aurora
}

/**
 * Calculate Kp index score
 * Higher Kp = more aurora activity
 * Scale: 0-9, where 5+ is strong activity
 */
function calculateKpScore(kp: number, latitude: number): number {
  // Adjust required Kp based on latitude
  const requiredKp = latitude >= 65 ? 2 : latitude >= 60 ? 4 : 6
  
  if (kp >= requiredKp + 3) return 100 // Excellent
  if (kp >= requiredKp + 2) return 85  // Very good
  if (kp >= requiredKp + 1) return 70  // Good
  if (kp >= requiredKp) return 55      // Moderate
  if (kp >= requiredKp - 1) return 35  // Possible
  return 15 // Unlikely
}

/**
 * Calculate cloud coverage score
 * Lower cloud coverage = better viewing
 */
function calculateCloudScore(cloudCoverage: number): number {
  return Math.max(0, 100 - cloudCoverage)
}

/**
 * Calculate light pollution score from Bortle scale
 * Lower Bortle = darker skies = better viewing
 * Bortle scale: 1 (pristine) to 9 (inner city)
 */
function calculateLightPollutionScore(bortleScale: number): number {
  const bortleScoreMap: { [key: number]: number } = {
    1: 100, // Excellent dark sky
    2: 95,  // Typical dark site
    3: 85,  // Rural sky
    4: 70,  // Rural/suburban transition
    5: 50,  // Suburban sky
    6: 30,  // Bright suburban
    7: 15,  // Suburban/urban transition
    8: 5,   // City sky
    9: 0,   // Inner city
  }
  return bortleScoreMap[bortleScale] || 50
}

/**
 * Calculate moon phase score
 * New moon = best viewing, Full moon = worst
 */
function calculateMoonScore(): number {
  const today = new Date()
  const lunarMonth = 29.53 // days
  const knownNewMoon = new Date('2026-01-06') // Known new moon
  
  const daysSinceNewMoon = (today.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
  const phase = (daysSinceNewMoon % lunarMonth) / lunarMonth
  
  // New moon (0) = 100, Full moon (0.5) = 0
  if (phase < 0.25) {
    // Waxing crescent to first quarter
    return 100 - (phase * 4 * 80)
  } else if (phase < 0.5) {
    // First quarter to full moon
    return 20 - ((phase - 0.25) * 4 * 20)
  } else if (phase < 0.75) {
    // Waning gibbous to last quarter
    return 0 + ((phase - 0.5) * 4 * 20)
  } else {
    // Last quarter to new moon
    return 20 + ((phase - 0.75) * 4 * 80)
  }
}

/**
 * Calculate air quality score
 * Lower AQI = better visibility
 */
function calculateAirQualityScore(aqi: number): number {
  if (aqi <= 50) return 100   // Good
  if (aqi <= 100) return 80   // Moderate
  if (aqi <= 150) return 60   // Unhealthy for sensitive
  if (aqi <= 200) return 40   // Unhealthy
  if (aqi <= 300) return 20   // Very unhealthy
  return 0 // Hazardous
}

/**
 * Main scoring function
 * Combines all factors with weights to produce final score
 */
export function calculateAuroraScore(
  location: Location,
  auroraData: AuroraData | null,
  weatherData: WeatherData | null,
  airQualityData: AirQualityData | null
): {
  total_score: number
  scores: ScoreComponents
  viewing_recommendation: 'excellent' | 'good' | 'moderate' | 'poor' | 'not-visible'
} {
  const scores: ScoreComponents = {
    latitude: calculateLatitudeScore(location.latitude),
    kp_index: auroraData ? calculateKpScore(auroraData.kp_index, location.latitude) : 15,
    clouds: weatherData ? calculateCloudScore(weatherData.cloud_coverage) : 50,
    light_pollution: location.bortle_scale ? calculateLightPollutionScore(location.bortle_scale) : 50,
    moon_phase: calculateMoonScore(),
    air_quality: airQualityData ? calculateAirQualityScore(airQualityData.aqi) : 80,
  }

  // Calculate weighted total score
  const totalScore = 
    scores.latitude * WEIGHTS.latitude +
    scores.kp_index * WEIGHTS.kp_index +
    scores.clouds * WEIGHTS.clouds +
    scores.light_pollution * WEIGHTS.light_pollution +
    scores.moon_phase * WEIGHTS.moon_phase +
    scores.air_quality * WEIGHTS.air_quality

  // Determine viewing recommendation
  let recommendation: 'excellent' | 'good' | 'moderate' | 'poor' | 'not-visible'
  if (totalScore >= 80) recommendation = 'excellent'
  else if (totalScore >= 65) recommendation = 'good'
  else if (totalScore >= 50) recommendation = 'moderate'
  else if (totalScore >= 35) recommendation = 'poor'
  else recommendation = 'not-visible'

  // Override: if clouds are >80%, viewing is poor regardless of other factors
  if (weatherData && weatherData.cloud_coverage > 80) {
    recommendation = 'poor'
  }

  // Override: if Kp is very low and not in optimal latitude, set to not-visible
  if (auroraData && auroraData.kp_index < 2 && location.latitude < 65) {
    recommendation = 'not-visible'
  }

  return {
    total_score: Math.round(totalScore),
    scores,
    viewing_recommendation: recommendation,
  }
}

/**
 * Determine if conditions warrant sending an alert
 * Only send alerts when there's a real chance of seeing aurora
 */
export function shouldSendAlert(
  totalScore: number,
  recommendation: string,
  kpIndex: number,
  cloudCoverage: number
): boolean {
  // Conditions for alert:
  // 1. Score must be 65+ (good or excellent)
  // 2. Kp must be 4+ (moderate to strong activity)
  // 3. Cloud coverage must be <50%
  return (
    totalScore >= 65 &&
    kpIndex >= 4 &&
    cloudCoverage < 50
  )
}
