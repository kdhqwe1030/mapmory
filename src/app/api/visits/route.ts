import { createClient } from "@/src/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const place_id = searchParams.get("place_id");

  if (!place_id) {
    return NextResponse.json(
      { error: "place_id is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .eq("place_id", Number(place_id))
    .order("visited_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { place_id, visited_at } = await request.json();
  const { data, error } = await supabase
    .from("visits")
    .insert({ place_id, visited_at })
    .select("*")
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // 방문 기록이 생기면 saved_places.visit_status → visited
  await supabase
    .from("saved_places")
    .update({ visit_status: "visited" })
    .eq("place_id", place_id);

  return NextResponse.json(data, { status: 201 });
}
