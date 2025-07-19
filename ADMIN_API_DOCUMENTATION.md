# 픽셀굿즈 관리자 API 문서

## 인증
모든 관리자 API는 JWT 토큰 인증이 필요하며, 사용자의 `isAdmin` 권한을 확인합니다.

**헤더 설정:**
```
Authorization: Bearer {JWT_TOKEN}
```

## 1. 상품 관리 API

### 전체 상품 조회 (승인 대기 포함)
```
GET /api/admin/products
```
- 모든 상품 (활성/비활성, 승인/미승인 포함)
- 카테고리 정보 및 판매자 정보 포함

### 상품 승인/거부
```
PUT /api/admin/products/:productId/approve
Body: { "approved": true/false }
```

### 상품 활성화/비활성화
```
PUT /api/admin/products/:productId/status
Body: { "is_active": true/false }
```

### 상품 삭제
```
DELETE /api/admin/products/:productId
```

## 2. 판매자 관리 API

### 전체 판매자 조회
```
GET /api/admin/sellers
```
- 모든 판매자 정보
- 연결된 사용자 정보 포함

### 판매자 승인/거부
```
PUT /api/admin/sellers/:sellerId/approve
Body: { "approved": true/false }
```

## 3. 주문 관리 API

### 전체 주문 조회
```
GET /api/admin/orders
```
- 모든 주문 내역
- 사용자 정보 포함

## 4. 사용자 관리 API

### 전체 사용자 조회
```
GET /api/admin/users
```

### 사용자 권한 관리
```
PUT /api/admin/users/:userId/role
Body: { "isAdmin": true/false }
```

## 5. 통계 API

### 사이트 통계
```
GET /api/admin/stats
```
**응답 데이터:**
- totalProducts: 총 상품 수
- totalUsers: 총 사용자 수
- totalOrders: 총 주문 수
- totalSellers: 총 판매자 수
- pendingProducts: 승인 대기 상품 수
- pendingSellers: 승인 대기 판매자 수
- totalRevenue: 총 매출

## 6. 리뷰 관리 API

### 전체 리뷰 조회
```
GET /api/admin/reviews
```

### 리뷰 승인/거부
```
PUT /api/admin/reviews/:reviewId/approve
Body: { "approved": true/false }
```

### 리뷰 삭제
```
DELETE /api/admin/reviews/:reviewId
```

## 7. 카테고리 관리 API

### 카테고리 생성
```
POST /api/admin/categories
Body: { "name": "카테고리명", "name_ko": "한국어명" }
```

### 카테고리 수정
```
PUT /api/admin/categories/:categoryId
Body: { "name": "수정된명", "name_ko": "수정된 한국어명" }
```

### 카테고리 삭제
```
DELETE /api/admin/categories/:categoryId
```

## 8. 쿠폰 관리 API

### 쿠폰 생성
```
POST /api/admin/coupons
Body: {
  "code": "COUPON2024",
  "discount_type": "percentage",
  "discount_value": 10,
  "min_order_amount": 50000,
  "max_discount": 10000,
  "expires_at": "2024-12-31"
}
```

### 쿠폰 수정/삭제
```
PUT /api/admin/coupons/:couponId
DELETE /api/admin/coupons/:couponId
```

## 9. 이벤트 관리 API

### 이벤트 생성/수정/삭제
```
POST /api/admin/events
PUT /api/admin/events/:eventId
DELETE /api/admin/events/:eventId
```

## 10. 알림 관리 API

### 전체 알림 발송
```
POST /api/admin/notifications/broadcast
Body: {
  "title": "공지사항",
  "message": "내용",
  "type": "announcement"
}
```

## 11. 시스템 설정 API

### 사이트 설정 조회/수정
```
GET /api/admin/settings
PUT /api/admin/settings
```

## 데이터베이스 테이블 구조

**주요 테이블:**
- users (사용자)
- products (상품)
- sellers (판매자)
- orders (주문)
- order_items (주문 상품)
- reviews (리뷰)
- categories (카테고리)
- coupons (쿠폰)
- payments (결제)
- notifications (알림)
- admin_logs (관리자 로그)

**모든 테이블에 created_at, updated_at 컬럼 존재**