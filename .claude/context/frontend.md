# Frontend 작업 매뉴얼 - Mapmory

> UI/컴포넌트/페이지 작업 시 반드시 읽는다.

## 디자인 시스템

### 컬러 팔레트
```
배경/메인 색상 (따뜻한 파스텔)
  #FFDCDC  연한 핑크
  #FFF2EB  크림
  #FFE8CD  피치
  #FFD6BA  살몬

텍스트
  Primary   #3A2E2A  (기본 텍스트)
  Secondary #6B5B56  (보조 텍스트)
  Muted     #9B8B84  (설명, 힌트)
  Border    #EAD9D0  (테두리, 구분선)
```

### UI 스타일 원칙
- **Warm, Minimal, Soft** 톤
- 둥근 카드 디자인 (rounded-2xl 이상)
- 부드러운 그림자 (shadow-sm ~ shadow-md)
- 지도 중심 인터페이스
- 불필요한 UI 요소 제거

## 컴포넌트 규칙

### 파일 위치
```
src/
└── app/
    ├── _components/     # 공통 컴포넌트
    ├── _hooks/          # 커스텀 훅
    ├── _stores/         # Zustand 스토어
    ├── _types/          # TypeScript 타입
    └── (pages)/         # 라우트 페이지
```

### 컴포넌트 작성 규칙
- 'use client' 필요한 경우에만 추가 (기본은 Server Component)
- props 타입은 interface로 정의, 파일 상단에 위치
- 컴포넌트 파일명: PascalCase (예: PlaceCard.tsx)
- 훅 파일명: camelCase, use 접두사 (예: usePlaces.ts)

### 예시 구조
```tsx
interface PlaceCardProps {
  name: string
  status: 'want' | 'visited'
}

export function PlaceCard({ name, status }: PlaceCardProps) {
  return (
    <div className="rounded-2xl bg-white shadow-sm p-4">
      ...
    </div>
  )
}
```

## 지도 (Naver Map API) 규칙
- 지도 초기화는 클라이언트에서만 ('use client')
- 마커 색상: want → #FFDCDC, visited → #FFD6BA
- 지도 중심 좌표: 서울 기본값 (37.5665, 126.9780)

## 장소 상태 (status)
```typescript
type PlaceStatus = 'want' | 'visited'
```
- `want`: 가고 싶은 장소 (핑크 마커)
- `visited`: 방문 완료 (살몬 마커)

## Tailwind 클래스 패턴

### 카드
```
rounded-2xl bg-white shadow-sm border border-[#EAD9D0] p-4
```

### 버튼 (Primary)
```
rounded-full bg-[#FFDCDC] text-[#3A2E2A] px-4 py-2 hover:bg-[#FFD6BA] transition-colors
```

### 텍스트
```
Primary:   text-[#3A2E2A]
Secondary: text-[#6B5B56]
Muted:     text-[#9B8B84]
```

## 작업 후 체크
- [ ] 반응형 (모바일 우선) 확인
- [ ] 다크모드 대응 여부 확인 (현재 미지원, 추후 고려)
- [ ] 컬러 팔레트 준수 여부
- [ ] 불필요한 'use client' 없는지 확인
