import { config } from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import City from '~/models/schemas/City.schema'
import DeliveryType from '~/models/schemas/DeliveryType.schema'
import PaymentType from '~/models/schemas/PaymentType.schema'
import Product from '~/models/schemas/Product.schema'
import ProductType from '~/models/schemas/ProductType.schema'
// import Blog from '~/models/schemas/Blog.schema'
// import Bookmark from '~/models/schemas/Bookmark.schema'
// import Conversation from '~/models/schemas/Conversations.schema'
// import Notification from '~/models/schemas/Notification.schema'
// import Comment from '~/models/schemas/Comment.schema'
// import Follower from '~/models/schemas/Follower.schema'
// import Hashtag from '~/models/schemas/Hashtag.schema'
// import Like from '~/models/schemas/Like.schema'
// import Province from '~/models/schemas/Province.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Role from '~/models/schemas/Role.schema'
import User from '~/models/schemas/User.schema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ecommerce.bobdwgi.mongodb.net/`
// mongodb+srv://ecommerce:<db_password>@ecommerce.bobdwgi.mongodb.net/
class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('error', error)
      throw error
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1'])
    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
    }
  }

  async indexRefreshTokens() {
    const exists = await this.refreshToken.indexExists(['token_1', 'exp_1'])
    if (!exists) {
      this.refreshToken.createIndex({ token: 1 })
      this.refreshToken.createIndex(
        {
          exp: 1
        },
        {
          expireAfterSeconds: 0 // dựa vaò mốc thời gian là exp, cũ quá thì mongoDB tự xoá
        }
      )
    }
  }

  // async indexFollowers() {
  //   const exists = await this.followers.indexExists(['user_id_1_followed_user_id_1'])
  //   if (!exists) {
  //     this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
  //   }
  // }

  // async indexProvince() {
  //   const exists = await this.provinces.indexExists(['value_1'])
  //   if (!exists) {
  //     this.provinces.createIndex({ value: 1 })
  //   }
  // }

  // async indexNotifications() {
  //   const exists = await this.notifications.indexExists(['user_id_1'])
  //   if (!exists) {
  //     this.notifications.createIndex({ user_id: 1 })
  //   }
  // }

  // async indexLikes() {
  //   const exists = await this.likes.indexExists(['user_id_1_blog_id_1'])
  //   if (!exists) {
  //     this.likes.createIndex({ user_id: 1, blog_id: 1 })
  //   }
  // }

  // async indexBookmark() {
  //   const exists = await this.bookmarks.indexExists(['user_id_1_blog_id_1'])
  //   if (!exists) {
  //     this.bookmarks.createIndex({ user_id: 1, blog_id: 1 })
  //   }
  // }

  // async indexHashtags() {
  //   const exists = await this.hashtags.indexExists(['name_1'])
  //   if (!exists) {
  //     this.hashtags.createIndex({ name: 1 })
  //   }
  // }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTION as string)
  }
  get citys(): Collection<City> {
    return this.db.collection(process.env.DB_CITY_COLLECTION as string)
  }
  get roles(): Collection<Role> {
    return this.db.collection(process.env.DB_ROLE_COLLECTION as string)
  }
  get producttypes(): Collection<ProductType> {
    return this.db.collection(process.env.DB_PRODUCT_TYPE_COLLECTION as string)
  }
  get deliverytype(): Collection<DeliveryType> {
    return this.db.collection(process.env.DB_DELIVERY_TYPE_COLLECTION as string)
  }
  get paymenttype(): Collection<PaymentType> {
    return this.db.collection(process.env.DB_PAYMENT_TYPE_COLLECTION as string)
  }
  // get bookmarks(): Collection<Bookmark> {
  //   return this.db.collection(process.env.DB_BOOKMARKS_COLLECTION as string)
  // }
  // get likes(): Collection<Like> {
  //   return this.db.collection(process.env.DB_LIKES_COLLECTION as string)
  // }
  // get hashtags(): Collection<Hashtag> {
  //   return this.db.collection(process.env.DB_HASHTAGS_COLLECTION as string)
  // }
  // get provinces(): Collection<Province> {
  //   return this.db.collection(process.env.DB_PROVINCES_COLLECTION as string)
  // }
  // get conversations(): Collection<Conversation> {
  //   return this.db.collection(process.env.DB_CONVERSATIONS_COLLECTION as string)
  // }
  // get notifications(): Collection<Notification> {
  //   return this.db.collection(process.env.DB_NOTIFICATIONS_COLLECTION as string)
  // }
  // get comments(): Collection<Comment> {
  //   return this.db.collection(process.env.DB_COMMENTS_COLLECTION as string)
  // }
}

const databaseService = new DatabaseService()
export default databaseService
