'use client'

import { useState } from 'react'
import type { Location, SavedLocation } from '@/types'

interface SavedWithLocation extends SavedLocation {
  location: Location
}

interface Props {
  initialSaved: SavedWithLocation[]
}

export function SavedLocationsClient({ initialSaved }: Props) {
  const [saved, setSaved] = useState<SavedWithLocation[]>(initialSaved)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const remove = async (locationId: string) => {
    setLoadingId(locationId)
    try {
      await fetch('/api/saved-locations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location_id: locationId }),
      })
      setSaved((prev) => prev.filter((s) => s.location_id !== locationId))
    } finally {
      setLoadingId(null)
    }
  }

  if (saved.length === 0) {
    return <p className="text-gray-400">No favorites yet. Save a location from the home page.</p>
  }

  return (
    <div className="space-y-3">
      {saved.map((item) => (
        <div
          key={item.id}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-start justify-between"
        >
          <div>
            <h3 className="text-white font-semibold">{item.location.name}</h3>
            <p className="text-sm text-gray-400">{item.location.country}</p>
            <p className="text-xs text-gray-500 mt-1">Tier {item.location.tier} • {item.location.accessibility}</p>
          </div>
          <button
            onClick={() => remove(item.location_id)}
            disabled={loadingId === item.location_id}
            className="text-sm px-3 py-1 rounded border border-red-400 text-red-300 hover:bg-red-500/10 disabled:opacity-60"
          >
            {loadingId === item.location_id ? 'Removing…' : 'Remove'}
          </button>
        </div>
      ))}
    </div>
  )
}
