'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Location } from '@/types'
import { calculateAuroraScore } from '@/lib/scoring'

interface MapComponentProps {
  locations: Location[]
  center?: [number, number]
  zoom?: number
  onLocationClick?: (location: Location) => void
  selectedLocationId?: string
}

interface LocationScore {
  total_score: number
  viewing_recommendation: 'excellent' | 'good' | 'moderate' | 'poor' | 'not-visible'
}

export default function MapComponent({
  locations,
  center = [65.0, 0.0], // Default: Northern aurora belt
  zoom = 3,
  onLocationClick,
  selectedLocationId,
}: MapComponentProps) {
  const mapRef = useRef<any | null>(null)
  const lRef = useRef<any>(null) // Store L reference
  const markersRef = useRef<{ [key: string]: any }>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [scores, setScores] = useState<{ [key: string]: LocationScore }>({})

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current) return

    // Dynamically import Leaflet only in browser
    import('leaflet').then((L) => {
      lRef.current = L.default // Store L for later use
      // Initialize map
      const map = L.default.map('map', {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false, // Remove Leaflet attribution
        minZoom: 2, // Prevent zooming out too far
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]], // Prevent panning to white space
        maxBoundsViscosity: 1.0, // Strict bounds (user can't pan outside)
      })

      // Add CartoDB Dark Matter base layer (night-friendly theme)
      L.default.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map)

      // Add light pollution overlay
      L.default.tileLayer('https://tiles.lightpollutionmap.info/VIIRS_2023/{z}/{x}/{y}.png', {
        attribution: 'Light Pollution Map',
        opacity: 0.5,
        maxZoom: 12,
      }).addTo(map)

      mapRef.current = map
      setIsLoaded(true)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Fetch aurora scores for all locations
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const [auroraRes, weatherRes, aqRes] = await Promise.all([
          fetch('/api/aurora'),
          fetch('/api/weather'),
          fetch('/api/air-quality'),
        ])

        const aurora = await auroraRes.json()
        const weather = await weatherRes.json()
        const aq = await aqRes.json()

        const newScores: { [key: string]: LocationScore } = {}

        locations.forEach((location) => {
          const score = calculateAuroraScore(
            location,
            aurora,
            weather,
            aq
          )
          newScores[location.id] = score
        })

        setScores(newScores)
      } catch (error) {
        console.error('Error fetching scores:', error)
      }
    }

    if (locations.length > 0) {
      fetchScores()
      // Refresh scores every 30 minutes
      const interval = setInterval(fetchScores, 30 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [locations])

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 65) return 'text-green-300'
    if (score >= 50) return 'text-yellow-400'
    if (score >= 35) return 'text-orange-400'
    return 'text-red-400'
  }

  const getStatusText = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 65) return 'Good'
    if (score >= 50) return 'Moderate'
    if (score >= 35) return 'Poor'
    return 'Very Poor'
  }

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !lRef.current) return

    const L = lRef.current
    const map = mapRef.current

    // Remove old markers
    Object.values(markersRef.current).forEach(marker => marker.remove())
    markersRef.current = {}

    // Add new markers
    locations.forEach(location => {
      // Create custom icon based on tier
      const tierColors: { [key: number]: string } = {
        1: '#22c55e', // green - premium
        2: '#3b82f6', // blue - good
        3: '#f59e0b', // orange - moderate
      }

      const color = tierColors[location.tier] || '#3b82f6'

      const icon = L.divIcon({
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([location.latitude, location.longitude], { icon })
        .addTo(map)

      marker.on('click', () => {
        setSelectedLocation(location)
        if (onLocationClick) {
          onLocationClick(location)
        }
      })

      // Highlight selected location
      if (selectedLocationId === location.id) {
        setSelectedLocation(location)
      }

      markersRef.current[location.id] = marker
    })
  }, [locations, isLoaded, onLocationClick, selectedLocationId])

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full rounded-lg overflow-hidden" />
      
      {/* Legend */}
      <div className="absolute bottom-12 right-4 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg text-white text-sm shadow-lg z-[1000]">
        <h4 className="font-semibold mb-2">Location Tiers</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Tier 1 - Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Tier 2 - Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>Tier 3 - Moderate</span>
          </div>
        </div>
      </div>

      {/* Location Details Popup */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur-sm p-4 rounded-lg text-white shadow-lg z-[1000] max-w-sm">
          <div className="flex justify-between items-start gap-2 mb-3">
            <div>
              <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
              <p className="text-sm text-gray-400">{selectedLocation.country}</p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-white text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-sm mb-4">
            {scores[selectedLocation.id] && (
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
                <span className="text-gray-400">Aurora Status:</span>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${getStatusColor(scores[selectedLocation.id].total_score)}`}>
                    {getStatusText(scores[selectedLocation.id].total_score)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {scores[selectedLocation.id].total_score}/100
                  </span>
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Tier:</span>
              <span className={`font-semibold px-2 py-1 rounded ${
                selectedLocation.tier === 1
                  ? 'bg-green-500/20 text-green-400'
                  : selectedLocation.tier === 2
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-orange-500/20 text-orange-400'
              }`}>
                Tier {selectedLocation.tier}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Accessibility:</span>
              <span className="capitalize">{selectedLocation.accessibility}</span>
            </div>
            {selectedLocation.bortle_scale && (
              <div className="flex justify-between">
                <span className="text-gray-400">Bortle Scale:</span>
                <span>{selectedLocation.bortle_scale}</span>
              </div>
            )}
            {selectedLocation.nearby_city && (
              <div className="flex justify-between">
                <span className="text-gray-400">Nearby City:</span>
                <span>{selectedLocation.nearby_city}</span>
              </div>
            )}
            {selectedLocation.best_months && selectedLocation.best_months.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Best Months:</span>
                <span>{selectedLocation.best_months.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <a
              href={`https://maps.google.com/?q=${selectedLocation.latitude},${selectedLocation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded text-center transition-colors"
            >
              Google Maps
            </a>
            <button
              onClick={() => setShowRatingModal(true)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              How We Rate
            </button>
          </div>
        </div>
      )}

      {/* Rating Calculation Modal */}
      {showRatingModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md max-h-[80vh] overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How We Calculate Ratings</h2>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h3 className="font-semibold text-green-400 mb-1">Aurora Activity (Kp Index)</h3>
                <p>We monitor real-time solar activity and geomagnetic storms. Higher Kp values mean more intense and visible auroras, visible at lower latitudes.</p>
              </div>

              <div>
                <h3 className="font-semibold text-blue-400 mb-1">Cloud Cover</h3>
                <p>Clear skies are essential for aurora viewing. We check current and forecasted cloud conditions to predict visibility.</p>
              </div>

              <div>
                <h3 className="font-semibold text-yellow-400 mb-1">Light Pollution (Bortle Scale)</h3>
                <p>Darker locations (lower Bortle numbers) are better for viewing faint auroras. We factor in each location's light pollution level.</p>
              </div>

              <div>
                <h3 className="font-semibold text-orange-400 mb-1">Air Quality</h3>
                <p>Better air quality means better visibility. We monitor particulate matter and pollution levels at each location.</p>
              </div>

              <div>
                <h3 className="font-semibold text-purple-400 mb-1">Location Accessibility</h3>
                <p>We consider how easy it is to reach the location and stay there for aurora viewing.</p>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-400 mb-1">Historical Data</h3>
                <p>Each location's historical aurora frequency and seasonal patterns are factored into the rating.</p>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">Ratings update every 30 minutes based on the latest atmospheric and solar data.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
