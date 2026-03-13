# Mapmory - 프로젝트 컨텍스트

## 서비스 개요
**"지도 위에 데이트 추억을 쌓아가는 서비스"**

지도(Map) + 추억(Memory) = Mapmory
지도 기반으로 데이트 장소를 저장하고, 방문 기록을 남기며, 가고 싶은 장소를 관리하는 개인 장소 아카이브 서비스.

## 기술 스택
| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 지도 | Naver Map API |
| 상태 관리 | Zustand |
| 데이터 | React Query |

## 핵심 개념
- **장소 상태**: `want` (가고싶음) / `visited` (방문완료) 두 가지
- **필터**: 사용자가 직접 생성하는 태그 방식 (카페, 맛집, 전시 등)
- **지도 중심**: 앱 진입 시 바로 지도가 보이는 구조

## 데이터 구조

### places (장소 정보)
```
id, name, address, lat, lng, category
```

### saved_places (사용자 저장 장소)
```
id, place_id, status(want|visited), memo, created_at
```

### visits (확장 - 방문 기록)
```
place_id, visited_at, review, photos
```

## 개발 단계

### MVP (1단계) - 완료
- [x] 프로젝트 초기 설정
- [x] 지도 기반 UI (Naver Map API) — MapView.tsx + useNaverMap.ts
- [x] 현재 위치 마커 + 재이동 버튼
- [x] 장소 검색 (Naver Local Search API) — PlaceSearchBar.tsx
  - 스로틀링 500ms, 엔터 자동 선택, 거리 표시
- [x] 검색 장소 선택 → 지도 마커 이동 + 바텀시트 상세
- [x] 장소 상세 (PlaceDetail.tsx) — 이미지 가로스크롤, 주소, 전화, 링크
- [x] 드래그 바텀시트 (BottomSheet.tsx) — 전체화면/뒤로가기 지원
- [x] Mock 장소 카드 리스트 (PlaceCard.tsx) — 실제 저장 없음
- [x] 필터 드롭다운 (FilterDropdown.tsx) — all / visited / want
- [x] StatusBadge.tsx — want/visited 뱃지 (현재 미사용)
- [ ] 실제 장소 저장/관리 — 미구현 (MOCK_PLACES만 존재)

### 2단계 (현재 개발 예정) — tasks/category2.md 참고
- 사용자 정의 카테고리 생성
- 장소를 카테고리에 저장 (단일 카테고리 MVP)
- 방문 상태 관리 (not_visited / visited) + 방문 날짜
- TODO 리스트 (장소 연결 가능)
- 카테고리 관리 화면 / TODO 관리 화면
- 지도 ↔ 관리 화면 전환 버튼 (책 아이콘 ↔ 지도 아이콘)

## 현재 실제 폴더 구조
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # 메인 지도 화면 (전체 상태 관리)
│   ├── globals.css
│   └── api/
│       ├── search/route.ts   # Naver Local Search API proxy
│       └── images/route.ts   # Naver Image Search API proxy
├── components/
│   ├── ui/
│   │   ├── BottomSheet.tsx
│   │   ├── FilterDropdown.tsx
│   │   └── StatusBadge.tsx
│   └── Providers.tsx
├── features/
│   ├── map/
│   │   ├── components/MapView.tsx
│   │   ├── hooks/useNaverMap.ts
│   │   └── types/map.types.ts
│   └── places/
│       └── components/
│           ├── PlaceCard.tsx
│           ├── PlaceDetail.tsx
│           └── PlaceSearchBar.tsx
└── lib/
    └── naver-map.ts          # 지도 기본값 (기본 좌표, 줌)
```

## 현재 상태 요약 (2026-03-13)
- 장소 저장 기능 없음 (MOCK_PLACES 하드코딩)
- Zustand store 미구현
- React Query 미사용
- 데이터 영속성 없음 (localStorage/DB 연동 없음)

## 업데이트 이력
- 2026-03-10: 기획서 확정, context 문서 초기화
- 2026-03-13: 1단계 MVP 완료 상태 반영, 실제 폴더 구조 업데이트
