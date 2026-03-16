import { createClient } from '@/src/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { name, address, external_id, lat, lng, naver_category } = await request.json()

  // Check if place already exists
  const { data: existing } = await supabase
    .from('places')
    .select('*')
    .eq('external_id', external_id)
    .single()

  if (existing) {
    if (!existing.naver_category && naver_category) {
      const { data: updated } = await supabase
        .from('places')
        .update({ naver_category })
        .eq('id', existing.id)
        .select()
        .single()
      return NextResponse.json(updated ?? existing)
    }
    return NextResponse.json(existing)
  }

  const { data, error } = await supabase
    .from('places')
    .insert({ name, address, external_id, lat, lng, naver_category })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
