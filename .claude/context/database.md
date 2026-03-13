# 데이터베이스 스키마 - Mapmory

> DB: Supabase (PostgreSQL)
> 최초 작성: 2026-03-13

---

## 테이블 구조

### categories (카테고리)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGSERIAL PK | 자동 증가 |
| name | TEXT NOT NULL | 카테고리 이름 |
| created_at | TIMESTAMPTZ | 생성일 (default: now()) |

---

### places (장소 원본 정보)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGSERIAL PK | 자동 증가 |
| external_id | TEXT | Naver Local Search API의 장소 ID |
| name | TEXT NOT NULL | 장소 이름 |
| address | TEXT | 주소 |
| created_at | TIMESTAMPTZ | 생성일 |

- `external_id`에 인덱스 존재 (`idx_places_external_id`)
- 네이버 API 검색 결과를 저장하는 테이블

---

### saved_places (사용자가 저장한 장소)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGSERIAL PK | 자동 증가 |
| place_id | BIGINT FK | places.id 참조 (CASCADE) |
| category_id | BIGINT FK | categories.id 참조 (SET NULL) |
| visit_status | TEXT | 'not_visited' \| 'visited' (default: 'not_visited') |
| created_at | TIMESTAMPTZ | 저장일 |

- `place_id`, `category_id`에 인덱스 존재
- places가 삭제되면 saved_places도 삭제 (CASCADE)
- categories가 삭제되면 category_id는 NULL 처리 (SET NULL)

---

### visits (방문 기록)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGSERIAL PK | 자동 증가 |
| saved_place_id | BIGINT FK | saved_places.id 참조 (CASCADE) |
| visited_at | TIMESTAMPTZ NOT NULL | 실제 방문 날짜 |
| note | TEXT | 방문 메모 (선택) |
| created_at | TIMESTAMPTZ | 기록 생성일 |

- `saved_place_id`에 인덱스 존재
- saved_places가 삭제되면 visits도 삭제 (CASCADE)

---

### todos (할 일 목록)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGSERIAL PK | 자동 증가 |
| title | TEXT NOT NULL | 할 일 제목 |
| is_done | BOOLEAN | 완료 여부 (default: false) |
| place_id | BIGINT FK | places.id 참조 (SET NULL, nullable) |
| created_at | TIMESTAMPTZ | 생성일 |

- `place_id`에 인덱스 존재
- 장소 연결은 선택사항 (nullable)
- places가 삭제되면 place_id는 NULL 처리 (SET NULL)

---

## 테이블 관계도

```
categories ──< saved_places >── places ──< todos
                    │
                    └──< visits
```

- `places` : `saved_places` = 1 : N
- `categories` : `saved_places` = 1 : N
- `saved_places` : `visits` = 1 : N
- `places` : `todos` = 1 : N (optional)

---

## 설계 결정 사항

- **places와 saved_places 분리**: 같은 장소를 여러 카테고리에 저장하는 확장을 고려한 구조
- **visits 별도 테이블**: saved_places에 방문일 컬럼을 넣지 않고 분리 → 향후 다중 방문 기록, 메모, 사진 확장 대비
- **todo.place_id → places 직접 참조**: saved_places가 아닌 places를 참조 → 저장 안 한 장소에도 TODO 연결 가능 (향후 확장)
