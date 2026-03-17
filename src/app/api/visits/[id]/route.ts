import { createClient } from '@/src/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { visited_at } = await request.json()
  const { data, error } = await supabase
    .from('visits')
    .update({ visited_at })
    .eq('id', Number(id))
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // 삭제 전 place_id 조회
  const { data: visit } = await supabase
    .from('visits')
    .select('place_id')
    .eq('id', Number(id))
    .single()

  const { error } = await supabase
    .from('visits')
    .delete()
    .eq('id', Number(id))
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 남은 방문 기록 없으면 visit_status → not_visited
  if (visit?.place_id) {
    const { count } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .eq('place_id', visit.place_id)
    if (count === 0) {
      await supabase
        .from('saved_places')
        .update({ visit_status: 'not_visited' })
        .eq('place_id', visit.place_id)
    }
  }

  return new NextResponse(null, { status: 204 })
}
