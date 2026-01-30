import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Location, SavedLocation } from '@/types'
import { SavedLocationsClient } from '@/components/SavedLocationsClient'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data, error } = await supabase
    .from('saved_locations')
    .select('*, location:locations(*)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved locations', error.message)
  }

  const savedWithLocations = (data || []) as Array<
    SavedLocation & { location: Location }
  >

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Your Favorites</h1>
            <p className="text-gray-400 text-sm mt-1">
              Saved aurora locations you want to remember.
            </p>
          </div>
          <a
            href="/"
            className="text-sm text-green-400 hover:text-green-300"
          >
            ← Back to map
          </a>
        </div>

        <SavedLocationsClient initialSaved={savedWithLocations} />
      </div>
    </main>
  )
}
