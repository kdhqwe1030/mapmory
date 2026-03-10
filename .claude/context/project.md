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

### MVP (1단계) - 현재 개발 중
- [x] 프로젝트 초기 설정
- [ ] 지도 기반 UI (Naver Map API)
- [ ] 장소 검색
- [ ] 장소 저장 (want / visited)
- [ ] 저장된 장소 마커 표시
- [ ] 사용자 필터 (태그)

### 2단계 (확장)
- 방문 기록 (날짜, 후기, 사진)
- 캘린더 뷰
- 데이트 계획 기능

## 핵심 화면 구조
```
메인 화면
├── 상단: 검색바
├── 중앙: 지도 (마커 표시)
└── 하단: Bottom Sheet (저장된 장소 리스트)
```

## 디렉토리 구조 (계획)
```
src/
└── app/
    ├── layout.tsx
    ├── page.tsx          # 메인 지도 화면
    └── globals.css
```

## 업데이트 이력
- 2026-03-10: 기획서 확정, context 문서 초기화
