import { createClient } from '@/src/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { name, address, external_id, lat, lng } = await request.json()

  // Check if place already exists
  const { data: existing } = await supabase
    .from('places')
    .select('*')
    .eq('external_id', external_id)
    .single()

  if (existing) return NextResponse.json(existing)

  const { data, error } = await supabase
    .from('places')
    .insert({ name, address, external_id, lat, lng })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
