import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('saved_locations')
    .select('*, location:locations(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ saved_locations: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const { location_id, notes, alert_enabled = false, alert_min_kp = 5 } = body || {}

  if (!location_id) {
    return NextResponse.json({ error: 'location_id is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('saved_locations')
    .upsert({
      user_id: user.id,
      location_id,
      notes: notes ?? null,
      alert_enabled,
      alert_min_kp,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const { location_id } = body || {}

  if (!location_id) {
    return NextResponse.json({ error: 'location_id is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('saved_locations')
    .delete()
    .eq('user_id', user.id)
    .eq('location_id', location_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
