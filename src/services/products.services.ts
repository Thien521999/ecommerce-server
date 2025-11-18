import { ObjectId } from 'mongodb'
import { CreateProductReqBody, UpdateProductReqBody } from '~/models/requests/Product.requests'
import Product from '~/models/schemas/Product.schema'
import databaseService from './database.services'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import usersService from './users.services'

class ProductsService {
  async createProduct(user_id: string, body: CreateProductReqBody) {
    // ket qua cua insertOne :
    // {
    //   "acknowledged": true,
    //   "insertedId": "673a4c885c268be011c0b030"
    // }
    const result = await databaseService.products.insertOne(
      new Product({
        user_id: new ObjectId(user_id),
        name: body.name,
        image: body.image,
        countInStock: body.countInStock,
        price: body.price
      })
    )

    const product = await databaseService.products.findOne({
      _id: result.insertedId
    })

    return product
  }

  async updateProduct(product_id: string, body: UpdateProductReqBody) {
    const product = await databaseService.products.findOneAndUpdate(
      {
        _id: new ObjectId(product_id)
      },
      {
        $set: {
          ...body
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return product.value
  }

  async getDetailProduct(product_id: string) {
    const product = await databaseService.products.findOne({
      _id: new ObjectId(product_id)
    })

    return product
  }

  async deleteProduct(product_id: string) {
    await databaseService.products.deleteOne({
      _id: new ObjectId(product_id)
    })

    return {
      message: PRODUCTS_MESSAGES.DELETED_PRODUCT_SUCCESS
    }
  }

  async getAllProductLiked(user_id: string, params: { page: number; limit: number; search: string }) {
    const limit = Number(params.limit)
    const page = Number(params.page)
    const search = params.search

    const user = await usersService.getMe(user_id)
    if (!user || !user.likedProducts) {
      return {
        message: PRODUCTS_MESSAGES.SUCCESS,
        data: {
          products: [],
          page,
          limit,
          total_page: 0
        }
      }
    }

    // Build query
    const query: Record<string, any> = {
      _id: { $in: user.likedProducts.map((id) => new ObjectId(id)) }
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const total = await databaseService.products.countDocuments(query)
    const total_page = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const products = await databaseService.products.find(query).skip(skip).limit(limit).toArray()

    return {
      message: PRODUCTS_MESSAGES.SUCCESS,
      data: {
        products,
        page,
        limit,
        total_page
      }
    }
  }

  async getAllProductViewed(user_id: string, params: { page: number; limit: number; search: string }) {
    const limit = Number(params.limit)
    const page = Number(params.page)
    const search = params.search

    const user = await usersService.getMe(user_id)
    if (!user || !user.viewedProducts) {
      return {
        message: PRODUCTS_MESSAGES.SUCCESS,
        data: {
          products: [],
          page,
          limit,
          total_page: 0
        }
      }
    }

    // Build query
    const query: Record<string, any> = {
      _id: { $in: user.viewedProducts.map((id) => new ObjectId(id)) }
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const total = await databaseService.products.countDocuments(query)
    const total_page = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const products = await databaseService.products.find(query).skip(skip).limit(limit).toArray()

    return {
      message: PRODUCTS_MESSAGES.SUCCESS,
      data: {
        products,
        page,
        limit,
        total_page
      }
    }
  }

  async likeProduct(user_id: string, product_id: string) {
    const userObjectId = new ObjectId(user_id)
    const productObjectId = new ObjectId(product_id)

    // 1. Tìm product, user có ton tai ko
    const [existingUser, existingProduct] = await Promise.all([
      databaseService.users.findOne({
        _id: userObjectId
      }),
      databaseService.products.findOne({
        _id: productObjectId
      })
    ])

    if (!existingUser) {
      return {
        message: PRODUCTS_MESSAGES.THE_USER_IS_NOT_EXIST
      }
    }
    if (!existingProduct) {
      return {
        message: PRODUCTS_MESSAGES.THE_PRODUCT_IS_NOT_EXIST
      }
    }

    if (existingUser.likedProducts.some((id) => id.equals(productObjectId))) {
      return {
        message: PRODUCTS_MESSAGES.THE_PRODUCT_IS_LIKED
      }
    }

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: userObjectId
        },
        { $push: { likedProducts: productObjectId } }
      ),
      databaseService.products.updateOne(
        {
          _id: productObjectId
        },
        {
          $inc: { totalLikes: 1 },
          $addToSet: { likedBy: userObjectId }
        }
      )
    ])

    return {
      message: PRODUCTS_MESSAGES.LIKED_PRODUCT_SUCCESSFULLY
    }
  }

  async unlikeProduct(user_id: string, product_id: string) {
    const userObjectId = new ObjectId(user_id)
    const productObjectId = new ObjectId(product_id)

    const [existingUser, existingProduct] = await Promise.all([
      databaseService.users.findOne({
        _id: userObjectId
      }),
      databaseService.products.findOne({
        _id: productObjectId
      })
    ])

    if (!existingUser) {
      return {
        message: PRODUCTS_MESSAGES.THE_USER_IS_NOT_EXISTED
      }
    }
    if (!existingProduct) {
      return {
        message: 'The product is not existed'
      }
    }

    if (!existingUser.likedProducts.some((id) => id.equals(productObjectId))) {
      return {
        message: PRODUCTS_MESSAGES.THE_PRODUCT_IS_NOT_LIKED_YET
      }
    }

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: userObjectId
        },
        { $pull: { likedProducts: productObjectId } }
      ),
      databaseService.products.updateOne(
        {
          _id: productObjectId
        },
        { $inc: { totalLikes: -1 }, $pull: { likedBy: userObjectId } }
      )
    ])

    return {
      message: PRODUCTS_MESSAGES.UNLIKED_PRODUCT_SUCCESSFULLY
    }
  }

  async deleteManyProduct(productIds: string[]) {
    const validIds = productIds.filter((v) => ObjectId.isValid(v))

    console.log({ validIds })
    if (validIds.length !== productIds.length) {
      // throw new Error('Có ID không hợp lệ')
      return {
        message: 'Có ID không hợp lệ'
      }
    }

    const objectIds = productIds.map((v) => new ObjectId(v))
    await databaseService.products.deleteMany({ _id: { $in: objectIds } })

    return {
      message: PRODUCTS_MESSAGES.DELETE_PRODUCTS_SUCCESS
    }
  }

  // async getAllProducts(user_id: string, params: any) {
  //   const limit = Number(params.limit)
  //   const page = Number(params.page)
  //   const search = String(params.search) || ''
  //   const order = params.order || 'desc'
  //   const productType = params.productType || ''
  //   const productLocation = params.productLocation || ''
  //   const minStar = params.minStar ? +params.minStar : 0
  //   const maxStar = params.maxStar ? +params.maxStar : 5
  //   const minPrice = params.minPrice ? +params.minPrice : 0
  //   const maxPrice = params.maxPrice ? +params.maxPrice : Number.MAX_SAFE_INTEGER
  //   const statusFilter = params?.status

  //   // ------------------------------
  //   // 1. Build query
  //   // ------------------------------
  //   const query: Record<string, any> = {}

  //   // TYPE Filter
  //   if (productType) {
  //     const typeIds = productType.split('|').map((id: string) => new ObjectId(id))
  //     query.type = typeIds.length > 1 ? { $in: typeIds } : typeIds[0]
  //   }

  //   // LOCATION Filter
  //   if (productLocation) {
  //     const locIds = productLocation.split('|').map((id: string) => new ObjectId(id))
  //     query.location = locIds.length > 1 ? { $in: locIds } : locIds[0]
  //   }

  //   // STATUS Filter
  //   if (statusFilter !== undefined) {
  //     const statusValues = statusFilter.split('|').map((s: string) => Number(s))
  //     query.status = statusValues.length > 1 ? { $in: statusValues } : statusValues[0]
  //   }

  //   // SEARCH
  //   if (search) {
  //     query.name = { $regex: search, $options: 'i' }
  //   }

  //   // PRICE RANGE
  //   query.price = { $gte: minPrice, $lte: maxPrice }

  //   // ------------------------------
  //   // 2. Total count
  //   // ------------------------------
  //   const totalCount = await databaseService.products.countDocuments(query)
  //   const totalPage = Math.ceil(totalCount / limit)
  //   const skip = (page - 1) * limit

  //   // ------------------------------
  //   // 3. Parse sort options
  //   // ------------------------------
  //   const sortOptions = {}
  //   if (order) {
  //     order.split(',').forEach((item: any) => {
  //       const [field, direction] = item.trim().split(' ')
  //       sortOptions[field] = direction.toLowerCase() === 'asc' ? 1 : -1
  //     })
  //   }

  //   // ------------------------------
  //   // 4. Selected output fields
  //   // ------------------------------
  //   const project = {
  //     image: 1,
  //     name: 1,
  //     createdAt: 1,
  //     price: 1,
  //     countInStock: 1,
  //     totalLikes: 1,
  //     averageRating: 1,
  //     status: 1,
  //     type: { id: '$typeInfo._id', name: '$typeInfo.name' },
  //     location: { id: '$locationInfo._id', name: '$locationInfo.name' }
  //   }

  //   // ------------------------------
  //   // 5. Build pipeline
  //   // ------------------------------
  //   const pipeline = [
  //     { $match: query },
  //     { $sort: sortOptions },
  //     ...(page !== -1 && limit !== -1 ? [{ $skip: skip }, { $limit: limit }] : []),
  //     {
  //       $lookup: {
  //         from: 'reviews',
  //         localField: '_id',
  //         foreignField: 'product',
  //         as: 'reviews'
  //       }
  //     },
  //     {
  //       $addFields: {
  //         averageRating: {
  //           $ifNull: [{ $avg: '$reviews.star' }, 0]
  //         }
  //       }
  //     },
  //     {
  //       // Filter theo star (minStar - maxStar)
  //       $match: {
  //         averageRating: { $gte: minStar, $lte: maxStar }
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'producttypes',
  //         localField: 'type',
  //         foreignField: '_id',
  //         as: 'typeInfo'
  //       }
  //     },
  //     { $unwind: '$typeInfo' },
  //     {
  //       $lookup: {
  //         from: 'cities',
  //         localField: 'location',
  //         foreignField: '_id',
  //         as: 'locationInfo'
  //       }
  //     },
  //     { $unwind: '$locationInfo' },
  //     { $project: project }
  //   ]

  //   const items = await productsCol.aggregate(pipeline).toArray()

  //   return {
  //     status: 200,
  //     message: 'Success',
  //     data: {
  //       products: items,
  //       totalPage,
  //       totalCount
  //     }
  //   }
  // }
}

const productsService = new ProductsService()
export default productsService
