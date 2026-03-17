import { createClient } from '@/src/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { name, icon, color } = body
  if (!name || !icon) return NextResponse.json({ error: 'name and icon required' }, { status: 400 })

  // 현재 최대 sort_order + 1
  const { data: maxData } = await supabase
    .from('categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  const nextOrder = (maxData?.sort_order ?? 0) + 1

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, icon, color: color || null, sort_order: nextOrder })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// 순서 일괄 업데이트: body = { ids: number[] } (앞에서부터 1번)
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { ids } = await request.json()
  const results = await Promise.all(
    (ids as number[]).map((id, index) =>
      supabase.from('categories').update({ sort_order: index + 1 }).eq('id', id)
    )
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
