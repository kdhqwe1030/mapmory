# 폴더 구조 규칙 - Mapmory

> 파일 생성, 이동, 구조 파악 작업 시 반드시 읽는다.

---

## 핵심 원칙

**Feature-first 구조**
- 기능(feature) 단위로 파일을 묶는다
- 특정 기능에서만 쓰이는 컴포넌트/훅/타입은 해당 feature 폴더 안에 둔다
- 2개 이상의 feature에서 공통으로 쓰일 때만 상위로 꺼낸다

---

## 전체 구조

```
src/
├── app/                        # Next.js App Router (라우트만)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css

├── components/                 # 완전 공통 UI (feature 무관)
│   ├── ui/                     # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Chip.tsx
│   │   └── Modal.tsx
│   └── layout/                 # 레이아웃 컴포넌트
│       ├── Header.tsx
│       └── PageContainer.tsx

├── features/                   # 기능별 모듈
│   ├── map/
│   │   ├── components/         # 지도 전용 컴포넌트
│   │   │   ├── MapView.tsx
│   │   │   ├── MapMarker.tsx
│   │   │   └── CurrentLocationButton.tsx
│   │   ├── hooks/              # 지도 전용 훅
│   │   │   ├── useNaverMap.ts
│   │   │   └── useMapCenter.ts
│   │   ├── utils/              # 지도 유틸
│   │   │   └── marker.ts
│   │   └── types/
│   │       └── map.types.ts
│   │
│   ├── places/
│   │   ├── components/
│   │   │   ├── PlaceCard.tsx
│   │   │   ├── PlaceList.tsx
│   │   │   ├── PlaceSearchBar.tsx
│   │   │   └── SavedPlaceButton.tsx
│   │   ├── hooks/
│   │   │   ├── usePlaceSearch.ts
│   │   │   └── useSavedPlaces.ts
│   │   ├── services/
│   │   │   └── place.service.ts
│   │   └── types/
│   │       └── place.types.ts
│   │
│   ├── filters/
│   │   ├── components/
│   │   │   ├── FilterChipList.tsx
│   │   │   └── FilterEditor.tsx
│   │   ├── hooks/
│   │   │   └── useFilters.ts
│   │   └── types/
│   │       └── filter.types.ts
│   │
│   └── visits/
│       ├── components/
│       │   └── VisitBadge.tsx
│       ├── hooks/
│       │   └── useVisits.ts
│       └── types/
│           └── visit.types.ts

├── hooks/                      # 완전 공통 훅 (feature 무관)
│   ├── useDebounce.ts
│   └── useModal.ts

├── lib/                        # 외부 라이브러리 초기화 및 설정
│   ├── naver-map.ts
│   ├── utils.ts
│   └── constants.ts

├── services/                   # 공통 API 클라이언트
│   └── api-client.ts

├── store/                      # Zustand 전역 스토어
│   ├── place.store.ts
│   ├── filter.store.ts
│   └── map.store.ts

├── types/                      # 공통 타입
│   └── common.ts

└── styles/
    └── theme.css
```

---

## 파일 배치 기준

### feature 폴더 내부에 두는 것
- 해당 기능에서만 사용하는 컴포넌트, 훅, 타입, 유틸, 서비스

### 상위로 꺼내는 기준
| 폴더 | 기준 |
|---|---|
| `components/ui/` | 어떤 feature에도 종속되지 않는 순수 UI |
| `components/layout/` | 전체 레이아웃 구조 컴포넌트 |
| `hooks/` | 2개 이상 feature에서 공통으로 쓰이는 훅 |
| `store/` | 여러 feature가 공유하는 전역 상태 |
| `types/` | 여러 feature에 걸쳐 쓰이는 공통 타입 |
| `lib/` | 외부 라이브러리 초기화, 전역 유틸, 상수 |
| `services/` | 공통 API 클라이언트 |

---

## 명명 규칙

| 종류 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase | `PlaceCard.tsx` |
| 훅 파일 | camelCase, `use` 접두사 | `usePlaceSearch.ts` |
| 타입 파일 | camelCase, `.types.ts` | `place.types.ts` |
| 서비스 파일 | camelCase, `.service.ts` | `place.service.ts` |
| 스토어 파일 | camelCase, `.store.ts` | `place.store.ts` |
| 유틸 파일 | camelCase | `marker.ts` |

---

## 새 기능 추가 시 체크

1. 이 기능이 특정 feature에만 속하는가? → `features/{feature}/` 안에 생성
2. 2개 이상 feature에서 쓰이는가? → 상위 공통 폴더로 이동
3. 새 feature가 필요한가? → `features/` 아래 새 폴더 생성 (위 구조 패턴 따름)
