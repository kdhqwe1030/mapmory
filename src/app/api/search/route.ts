import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  if (!query || query.trim().length < 1) {
    return NextResponse.json({ items: [] })
  }

  const res = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_DEVELOPERS_CLIENT_ID!,
        'X-Naver-Client-Secret': process.env.NAVER_DEVELOPERS_CLIENT_SECRET!,
      },
      next: { revalidate: 0 },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ items: [] }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
