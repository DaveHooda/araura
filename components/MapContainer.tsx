'use client'

import { useState } from 'react'
import MapComponent from '@/components/Map'
import { LocationList } from '@/components/LocationList'
import type { Location } from '@/types'

interface Props {
  locations: Location[]
  currentUserId?: string | null
}

export function MapContainer({ locations, currentUserId }: Props) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)

  const handleLocationSelect = (location: Location) => {
    setSelectedLocationId(location.id)
  }

  return (
    <div className="flex flex-1 overflow-hidden gap-4 p-4">
      {/* Map */}
      <div className="flex-1 overflow-hidden rounded-lg">
        <MapComponent
          locations={locations}
          selectedLocationId={selectedLocationId || undefined}
          onLocationClick={handleLocationSelect}
        />
      </div>
      {/* Sidebar */}
      <div className="w-96 h-full bg-gray-900 border border-gray-800 rounded-lg overflow-y-auto p-6 scrollbar-hide">
        <LocationList
          locations={locations}
          currentUserId={currentUserId}
          onLocationClick={handleLocationSelect}
        />
      </div>
    </div>
  )
}
