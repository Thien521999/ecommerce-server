****# Database Schema Documentation

## Tổng quan
Database này sử dụng MongoDB với Mongoose ODM. Tài liệu này mô tả chi tiết về các collections và relationships trong database.

---

## Collections

### 1. Users (Collection: `users`)
Quản lý thông tin người dùng trong hệ thống.

#### Fields
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | Primary key |
| `name` | String | ❌ | ❌ | - | Tên |
| `email` | String | ✅ | ✅ | - | Email (unique) |
| `password` | String | ❌ | ❌ | - | Mật khẩu (hashed) |
| `role` | ObjectId (ref: Role) | ❌ | ❌ | - | Vai trò của user |
| `phoneNumber` | String | ❌ | ❌ | - | Số điện thoại |
| `address` | String | ❌ | ❌ | - | Địa chỉ |
| `avatar` | String | ❌ | ❌ | - | URL avatar |
| `city` | ObjectId (ref: City) | ❌ | ❌ | - | Thành phố |
| `status` | Number | ❌ | ❌ | 1 | Trạng thái (0: inactive, 1: active) |
| `userType` | Number | ❌ | ❌ | 3 | Loại user (1: Facebook, 2: Google, 3: Other) |
| `likedProducts` | Array[ObjectId] (ref: Product) | ❌ | ❌ | [] | Danh sách sản phẩm đã like |
| `viewedProducts` | Array[ObjectId] (ref: Product) | ❌ | ❌ | [] | Danh sách sản phẩm đã xem |
| `addresses` | Array[Object] | ❌ | ❌ | [] | Danh sách địa chỉ |
| `addresses[].address` | String | ❌ | ❌ | - | Địa chỉ chi tiết |
| `addresses[].city` | String | ❌ | ❌ | - | Thành phố |
| `addresses[].phoneNumber` | String | ❌ | ❌ | - | Số điện thoại |
| `addresses[].firstName` | String | ❌ | ❌ | - | Tên |
| `addresses[].lastName` | String | ❌ | ❌ | - | Họ |
| `addresses[].middleName` | String | ❌ | ❌ | - | Tên đệm |
| `addresses[].isDefault` | Boolean | ❌ | ❌ | false | Địa chỉ mặc định |
| `createdAt` | Date | ✅ | ❌ | Auto | Ngày tạo |
| `updatedAt` | Date | ✅ | ❌ | Auto | Ngày cập nhật |

#### Relationships
- **role** → `Role` (Many-to-One)
- **city** → `City` (Many-to-One)
- **likedProducts** → `Product[]` (Many-to-Many)
- **viewedProducts** → `Product[]` (Many-to-Many)

---

### 2. Roles (Collection: `roles`)
Quản lý vai trò và quyền hạn trong hệ thống.

#### Fields
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | Primary key |
| `name` | String | ✅ | ✅ | - | Tên vai trò (unique) |
| `permissions` | Array[String] | ❌ | ❌ | [] | Danh sách quyền hạn |
| `createdAt` | Date | ✅ | ❌ | Auto | Ngày tạo |
| `updatedAt` | Date | ✅ | ❌ | Auto | Ngày cập nhật |

#### Default Roles
- **Admin**: Quyền quản trị viên
- **Basic**: Quyền người dùng cơ bản

#### Relationships
- **Users** → `User[]` (One-to-Many)

---

### 3. Products (Collection: `products`)
Quản lý sản phẩm trong hệ thống.

#### Fields
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | Primary key |
| `name` | String | ✅ | ❌ | - | Tên sản phẩm |
| `slug` | String | ✅ | ✅ | - | Slug URL (unique) |
| `image` | String | ❌ | ❌ | - | URL hình ảnh |
| `price` | Number | ✅ | ❌ | - | Giá sản phẩm |
| `countInStock` | Number | ✅ | ❌ | - | Số lượng tồn kho |
| `description` | String | ❌ | ❌ | - | Mô tả sản phẩm |
| `discount` | Number | ❌ | ❌ | - | Giảm giá (%) |
| `discountStartDate` | Date | ❌ | ❌ | - | Ngày bắt đầu giảm giá |
| `discountEndDate` | Date | ❌ | ❌ | - | Ngày kết thúc giảm giá |
| `sold` | Number | ❌ | ❌ | - | Số lượng đã bán |
| `type` | ObjectId (ref: ProductType) | ✅ | ❌ | - | Loại sản phẩm |
| `location` | ObjectId (ref: City) | ❌ | ❌ | - | Địa điểm sản phẩm |
| `likedBy` | Array[ObjectId] (ref: User) | ❌ | ❌ | [] | Danh sách user đã like |
| `totalLikes` | Number | ❌ | ❌ | 0 | Tổng số lượt like |
| `status` | Number | ❌ | ❌ | 0 | Trạng thái (0: inactive, 1: active) |
| `views` | Number | ❌ | ❌ | 0 | Tổng số lượt xem |
| `uniqueViews` | Array[ObjectId] (ref: User) | ❌ | ❌ | [] | Danh sách user đã xem |
| `createdAt` | Date | ✅ | ❌ | Auto | Ngày tạo |
| `updatedAt` | Date | ✅ | ❌ | Auto | Ngày cập nhật |

#### Relationships
- **type** → `ProductType` (Many-to-One)
- **location** → `City` (Many-to-One)
- **likedBy** → `User[]` (Many-to-Many)
- **uniqueViews** → `User[]` (Many-to-Many)
- **Reviews** → `Review[]` (One-to-Many)
- **Orders** → `Order[]` (One-to-Many)

---

### 4. ProductTypes (Collection: `producttypes`)
Quản lý loại sản phẩm.

#### Fields
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | Primary key |
| `name` | String | ✅ | ❌ | - | Tên loại sản phẩm |
| `slug` | String | ✅ | ✅ | - | Slug URL (unique) |
| `createdAt` | Date | ✅ | ❌ | Auto | Ngày tạo |
| `updatedAt` | Date | ✅ | ❌ | Auto | Ngày cập nhật |

#### Relationships
- **Products** → `Product[]` (One-to-Many)

---

### 5. Cities (Collection: `cities`)
Quản lý thành phố/địa điểm.

#### Fields
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | Primary key |
| `name` | String | ✅ | ✅ | - | Tên thành phố (unique) |
| `createdAt` | Date | ✅ | ❌ | Auto | Ngày tạo |
| `updatedAt` | Date | ✅ | ❌ | Auto | Ngày cập nhật |

#### Relationships
- **Users** → `User[]` (One-to-Many)
- **Products** → `Product[]` (One-to-Many)
- **Orders** → `Order[]` (One-to-Many)

---

### 6. Reviews (Collection: `reviews`)
Quản lý đánh giá sản phẩm.

#### Fields
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | Primary key |
| `content` | String | ✅ | ❌ | - | Nội dung đánh giá |
| `star` | Number | ✅ | ❌ | - | Số sao (1-5) |
| `product` | ObjectId (ref: Product) | ✅ | ❌ | - | Sản phẩm được đánh giá |
| `user` | ObjectId (ref: User) | ✅ | ❌ | - | User đánh giá |
| `createdAt` | Date | ✅ | ❌ | Auto | Ngày tạo |
| `updatedAt` | Date | ✅ | ❌ | Auto | Ngày cập nhật |

#### Relationships
- **product** → `Product` (Many-to-One)
- **user** → `User` (Many-to-One)

---

### 7. Orders (Collection: `orders`)
Quản lý đơn hàng.

#### Fields
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | Primary key |
| `orderItems` | Array[Object] | ✅ | ❌ | [] | Danh sách sản phẩm trong đơn |
| `orderItems[].name` | String | ✅ | ❌ | - | Tên sản phẩm |
| `orderItems[].amount` | Number | ✅ | ❌ | - | Số lượng |
| `orderItems[].image` | String | ✅ | ❌ | - | Hình ảnh |
| `orderItems[].price` | Number | ✅ | ❌ | - | Giá |
| `orderItems[].discount` | Number | ❌ | ❌ | - | Giảm giá |
| `orderItems[].product` | ObjectId (ref: Product) | ✅ | ❌ | - | Sản phẩm |
| `shippingAddress` | Object | ✅ | ❌ | - | Địa chỉ giao hàng |
| `shippingAddress.fullName` | String | ✅ | ❌ | - | Họ tên |
| `shippingAddress.address` | String | ✅ | ❌ | - | Địa chỉ |
| `shippingAddress.city` | ObjectId (ref: City) | ✅ | ❌ | - | Thành phố |
| `shippingAddress.phone` | Number | ✅ | ❌ | - | Số điện thoại |
| `paymentMethod` | ObjectId (ref: PaymentType) | ✅ | ❌ | - | Phương thức thanh toán |
| `deliveryMethod` | ObjectId (ref: DeliveryType) | ✅ | ❌ | - | Phương thức giao hàng |
| `itemsPrice` | Number | ✅ | ❌ | - | Tổng tiền sản phẩm |
| `shippingPrice` | Number | ✅ | ❌ | - | Phí vận chuyển |
| `totalPrice` | Number | ✅ | ❌ | - | Tổng tiền |
| `user` | ObjectId (ref: User) | ✅ | ❌ | - | User đặt hàng |
| `isPaid` | Number | ❌ | ❌ | 0 | Đã thanh toán (0: chưa, 1: rồi) |
| `paidAt` | Date | ❌ | ❌ | - | Ngày thanh toán |
| `isDelivered` | Number | ❌ | ❌ | 0 | Đã giao hàng (0: chưa, 1: rồi) |
| `deliveryAt` | Date | ❌ | ❌ | - | Ngày giao hàng |
| `status` | Number | ❌ | ❌ | 1 | Trạng thái (0: chờ thanh toán, 1: chờ giao hàng, 2: hoàn thành, 3: hủy) |
| `createdAt` | Date | ✅ | ❌ | Auto | Ngày tạo |
| `updatedAt` | Date | ✅ | ❌ | Auto | Ngày cập nhật |

#### Relationships
- **user** → `User` (Many-to-One)
- **orderItems[].product** → `Product` (Many-to-One)
- **shippingAddress.city** → `City` (Many-to-One)
- **paymentMethod** → `PaymentType` (Many-to-One)
- **deliveryMethod** → `DeliveryType` (Many-to-One)

---

### 8. PaymentTypes (Collection: `paymenttypes`)
Quản lý phương thức thanh toán.

#### Fields
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | Primary key |
| `name` | String | ✅ | ✅ | - | Tên phương thức (unique) |
| `type` | String | ✅ | ❌ | - | Loại (PAYMENT_LATER, VN_PAYMENT, PAYPAL) |
| `createdAt` | Date | ✅ | ❌ | Auto | Ngày tạo |
| `updatedAt` | Date | ✅ | ❌ | Auto | Ngày cập nhật |

#### Payment Types
- `PAYMENT_LATER`: Thanh toán sau
- `VN_PAYMENT`: Ví điện tử VNPay
- `PAYPAL`: PayPal

#### Relationships
- **Orders** → `Order[]` (One-to-Many)

---

### 9. DeliveryTypes (Collection: `deliverytypes`)
Quản lý phương thức giao hàng.

#### Fields
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | Primary key |
| `name` | String | ✅ | ✅ | - | Tên phương thức (unique) |
| `price` | Number | ✅ | ❌ | - | Giá vận chuyển |
| `createdAt` | Date | ✅ | ❌ | Auto | Ngày tạo |
| `updatedAt` | Date | ✅ | ❌ | Auto | Ngày cập nhật |

#### Relationships
- **Orders** → `Order[]` (One-to-Many)

---

## Entity Relationship Diagram (ERD)

```
┌─────────┐         ┌─────────┐
│  Role   │◄────────│  User   │
└─────────┘         └────┬────┘
                         │
                         │ 1:N
                         │
                    ┌────▼────┐
                    │ Product │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        │ 1:N            │ 1:N            │ 1:N
    ┌───▼────┐      ┌───▼────┐      ┌───▼────┐
    │Review  │      │ Order  │      │Product │
    └────────┘      └───┬────┘      │ Type   │
                        │            └────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        │ N:1           │ N:1           │ N:1
    ┌───▼────┐      ┌───▼────┐      ┌───▼────┐
    │Payment │      │Delivery│      │  City  │
    │ Type   │      │ Type   │      └────────┘
    └────────┘      └────────┘
```

---

## Indexes

### Users
- `email`: Unique index
- `role`: Index for join queries

### Products
- `slug`: Unique index
- `type`: Index for filtering
- `location`: Index for filtering
- `status`: Index for filtering

### Roles
- `name`: Unique index

### Cities
- `name`: Unique index

### PaymentTypes
- `name`: Unique index

### DeliveryTypes
- `name`: Unique index

### ProductTypes
- `slug`: Unique index

### Reviews
- `product`: Index for join queries
- `user`: Index for join queries

### Orders
- `user`: Index for join queries
- `status`: Index for filtering

---

## Validation Rules

### Users
- `email`: Must be unique and required
- `status`: Must be 0 or 1
- `userType`: Must be 1, 2, or 3

### Products
- `slug`: Must be unique and required
- `price`: Must be a positive number
- `countInStock`: Must be a non-negative number
- `status`: Must be 0 or 1
- `discount`: Should be between 0 and 100

### Reviews
- `star`: Must be between 1 and 5
- `content`: Required

### Orders
- `status`: Must be 0, 1, 2, or 3
- `isPaid`: Must be 0 or 1
- `isDelivered`: Must be 0 or 1
- `totalPrice`: Must be positive

---

## Timestamps
Tất cả các collections đều có `timestamps: true`, tự động tạo và cập nhật:
- `createdAt`: Ngày tạo record
- `updatedAt`: Ngày cập nhật record lần cuối

---

## Notes
- Tất cả các ObjectId references đều có thể populate để lấy thông tin đầy đủ
- Các enum fields có giá trị mặc định để đảm bảo data consistency
- Các unique fields sẽ tự động tạo index trong MongoDB
- Timestamps được tự động quản lý bởi Mongoose
