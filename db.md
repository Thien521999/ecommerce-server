****# Database Schema Documentation
## Tổng quan
Database này sử dụng MongoDB với MongoDB Node Driver. Tài liệu này mô tả chi tiết về các collections và relationships trong database.

## 1. Phân tích `users` collection

// save DB là users

```ts
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role_id: Objectid;            // Vai trò của user
  phoneNumber: string;
  address: string;
  avatar: string;
  city_id: ObjectId;
  status: userStatus;           // 1 | Trạng thái (0: inactive, 1: active)
  user_type: userType;          // 3 | Loại user (1: Facebook, 2: Google, 3: Other)
  likedProducts: ObjectId[];    // [] | Danh sách sản phẩm đã like
  viewedProducts: ObjectId[];   // [] | Danh sách sản phẩm đã xem
  addresses: Address[];
  created_at: Date;
  updated_at: Date;
}
```

## 2. Phân tích `roles` collection

```ts
interface Role {
  _id: ObjectId;
  name: string;
  permissions: string[]; // Danh sách quyền hạn
  createdAt: Date;
  updatedAt: Date;
}
```

#### Default Roles
- **Admin**: Quyền quản trị viên
- **Basic**: Quyền người dùng cơ bản

#### Relationships
- **Users** → `User[]` (One-to-Many) // gọi là Many-to-One (nhiều User đến một Role).

## 3. Phân tích `products` collection

```ts
interface Product {
  _id: ObjectId;
  name: string;
  slug: string;         // Slug URL (unique)
  image: string;
  price: number;
  countInStock: number; // Số lượng tồn kho
  description: string;
  discount: number;
  discountStartDate: Date;
  discountEndDate: Date;
  sold: number; // Số lượng đã bán
  type_id: ObjectId; // Loại sản phẩm
  location_id: ObjectId;
  likedBy: ObjectId[]; // Danh sách user đã like
  totalLikes: number;  // 0 | Tổng số lượt like
  status: productStatus; // 0 | Trạng thái (0: inactive, 1: active)
  views: number; // 0 | Tổng số lượt xem
  uniqueViews: ObjectId[]; // Danh sách user đã xem

  createdAt: Date;
  updatedAt: Date;
}
```

#### Relationships
- **type** → `ProductType` (Many-to-One)
- **location** → `City` (Many-to-One)
- **likedBy** → `User[]` (Many-to-Many)
- **uniqueViews** → `User[]` (Many-to-Many)
- **Reviews** → `Review[]` (One-to-Many)
- **Orders** → `Order[]` (One-to-Many)

## 4. Phân tích `producttypes` collection
Quản lý loại sản phẩm.
```ts
interface ProductType {
  _id: ObjectIds;
  name: string;
  slug: string; //  Slug URL (unique)
  createdAt: Date;
  updatedAt: Date;
}
```

#### Relationships
- **Products** → `Product[]` (One-to-Many)

## 5. Phân tích `cities` collection

```ts
interface City {
  _id: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 6. Phân tích `reviews` collection

```ts
interface Review {
  _id: ObjectId;
  content: string;
  star: number; // Số sao (1-5)
  product_id: ObjectId // Sản phẩm được đánh giá
  user_id: ObjectId    // User đánh giá

  createdAt: Date;
  updatedAt: Date;
}
```

## 7. Phân tích `orders` collection

```ts
interface Order {
  _id: ObjectId;
  orderItems: itemProduct[]; // Danh sách sản phẩm trong đơn
  shippingAddress: {
    fullname: string
    address: string
    city: string
    phone: number
  };
  paymentMethod_id: ObjectId; // Phương thức thanh toán
  deliveryMethod_id: any;     // Phương thức giao hàng
  itemsPrice: number;   // Tổng tiền sản phẩm
  shippingPrice: number // Phí vận chuyển
  totalPrice: number // Tổng tiền
  user_id: ObjectId // User đặt hàng
  isPaid: number        // 0 | Đã thanh toán (0: chưa, 1: rồi)
  paidAt: Date          // 0 | Đã giao hàng (0: chưa, 1: rồi)
  isDelivered: number   // 0 | Đã giao hàng (0: chưa, 1: rồi)
  deliveryAt: Date      // 0 | Đã giao hàng (0: chưa, 1: rồi)
  status: number 1      // 0 | Trạng thái (0: chờ thanh toán, 1: chờ giao hàng, 2: hoàn thành, 3: hủy)

  createdAt: Date;
  updatedAt: Date;
}
```

#### Relationships
- **user** → `User` (Many-to-One)
- **orderItems[].product** → `Product` (Many-to-One)
- **shippingAddress.city** → `City` (Many-to-One)
- **paymentMethod** → `PaymentType` (Many-to-One)
- **deliveryMethod** → `DeliveryType` (Many-to-One)

## 8. Phân tích `paymenttypes` collection

```ts
interface PaymentType {
  _id: ObjectId;
  name: string; // Tên phương thức (unique)
  type: string // Loại (PAYMENT_LATER, VN_PAYMENT, PAYPAL)

  createdAt: Date;
  updatedAt: Date;
}
```

#### Payment Types
- `PAYMENT_LATER`: Thanh toán sau
- `VN_PAYMENT`: Ví điện tử VNPay
- `PAYPAL`: PayPal

#### Relationships
- **Orders** → `Order[]` (One-to-Many)

## 9. Phân tích `deliverytypes` collection

```ts
interface DeliveryType {
  _id: ObjectId;
  name: string; // Tên phương thức (unique)
  price: string // Loại (PAYMENT_LATER, VN_PAYMENT, PAYPAL)

  createdAt: Date;
  updatedAt: Date;
}
```

## 10. Phân tích  `refresh_tokens` collection

```ts
interface RefreshToken {
  _id: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
}
```

****

```ts
export enum userStatus {
  Unverified, // chưa xác thực email, mặc định 0
  Verified, // đã xác thực email
}
```

```ts
export enum productStatus {
  Inactive, // chưa xác thực email, mặc định 0
  Active, // đã xác thực email
}
```

```ts
export enum userType {
  Unverified, // chưa xác thực email, mặc định 0
  Verified, // đã xác thực email
}
```

```ts
interface Address {
  address: string;
  city: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
  isDefault: boolean; // default : false
}
```

```ts
interface itemProduct {
    name: string
    amount: number
    image: string
    price: number
    discount: number
    product_id: ObjectId // sản phẩm
}
```
