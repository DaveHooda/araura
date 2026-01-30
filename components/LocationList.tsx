'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Location, SavedLocation } from '@/types'
import { calculateAuroraScore } from '@/lib/scoring'

interface Props {
  locations: Location[]
  currentUserId?: string | null
  onLocationClick?: (location: Location) => void
}

interface LocationScore {
  total_score: number
  viewing_recommendation: 'excellent' | 'good' | 'moderate' | 'poor' | 'not-visible'
}

export function LocationList({ locations, currentUserId, onLocationClick }: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTiers, setSelectedTiers] = useState<number[]>([1, 2, 3])
  const [scores, setScores] = useState<{ [key: string]: LocationScore }>({})

  useEffect(() => {
    const fetchSaved = async () => {
      if (!currentUserId) {
        setSaved([])
        return
      }
      try {
        const res = await fetch('/api/saved-locations')
        if (!res.ok) return
        const data = await res.json()
        const savedIds = (data.saved_locations as SavedLocation[] | undefined)?.map(
          (s) => s.location_id
        )
        setSaved(savedIds ?? [])
      } catch {
        // ignore fetch errors
      }
    }
    fetchSaved()
  }, [currentUserId])

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

  const toggleTierFilter = (tier: number) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    )
  }

  const toggleSave = async (locationId: string) => {
    if (!currentUserId) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    const isSaved = saved.includes(locationId)
    const method = isSaved ? 'DELETE' : 'POST'

    try {
      const res = await fetch('/api/saved-locations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location_id: locationId }),
      })

      if (res.ok) {
        setSaved((prev) =>
          isSaved ? prev.filter((id) => id !== locationId) : [...prev, locationId]
        )
      }
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Filter by Tier
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3].map((tier) => (
            <button
              key={tier}
              onClick={() => toggleTierFilter(tier)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedTiers.includes(tier)
                  ? tier === 1
                    ? 'bg-green-600 text-white'
                    : tier === 2
                    ? 'bg-blue-600 text-white'
                    : 'bg-orange-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Tier {tier}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          All Locations ({filteredLocations.length})
        </h3>
        <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pb-8 rounded-lg">
          {filteredLocations.map((location) => {
            const isSaved = saved.includes(location.id)
            return (
              <div
                key={location.id}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 
                      className="text-white font-medium group-hover:text-green-400 transition-colors cursor-pointer"
                      onClick={() => onLocationClick?.(location)}
                    >
                      {location.name}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">{location.country}</p>
                    {scores[location.id] && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs font-semibold ${getStatusColor(scores[location.id].total_score)}`}>
                          Aurora: {getStatusText(scores[location.id].total_score)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {scores[location.id].total_score}/100
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        location.tier === 1
                          ? 'bg-green-500/20 text-green-400'
                          : location.tier === 2
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      Tier {location.tier}
                    </span>
                    <button
                      onClick={() => toggleSave(location.id)}
                      disabled={loading}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                        isSaved
                          ? 'border-green-500 text-green-400 hover:bg-green-500/10'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
