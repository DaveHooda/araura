import { createClient } from '@/lib/supabase/server'
import { MapContainer } from '@/components/MapContainer'
import { SignOutButton } from '@/components/SignOutButton'
import { Logo } from '@/components/Logo'
import type { Location } from '@/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // Fetch all locations from database
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .order('tier', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching locations:', error)
  }

  const locationsList: Location[] = locations || []

  return (
    <main className="h-screen flex flex-col bg-gray-950 overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div>
              <h1 className="text-3xl font-bold text-white">Araura</h1>
              <p className="text-sm text-gray-400">
                Find the best Northern Lights viewing locations near you
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <a
                  href="/favorites"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Favorites
                </a>
                <SignOutButton />
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/auth/signup"
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content with Map & Sidebar */}
      <MapContainer locations={locationsList} currentUserId={user?.id ?? null} />
    </main>
  )
}
