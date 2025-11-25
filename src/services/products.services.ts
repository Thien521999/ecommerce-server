/* eslint-disable @typescript-eslint/no-explicit-any */
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
        price: body.price,
        discountStartDate: body.discountStartDate,
        discountEndDate: body.discountEndDate
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

  async getAllProducts(user_id: string, params: any) {
    const limit = params?.limit ? +params.limit : 10
    const page = params?.page ? +params.page : 1
    const search = params?.search ?? ''
    const productType = params?.productType ?? ''
    const minPrice = +params?.minPrice || 0
    const maxPrice = +params?.maxPrice || Number.MAX_SAFE_INTEGER
    const order = params?.order || 'desc'
    const productLocation = params.productLocation || ''
    const minStar = params?.minStar ? +params.minStar : 0
    const maxStar = params?.maxStar ? +params.maxStar : 5
    const statusFilter = params?.status

    // Build filter stages (reusable for both query and count)
    const filterStages: any[] = []

    // 1. Search by name
    if (search.trim() !== '') {
      filterStages.push(
        {
          $match: {
            $text: {
              $search: search
            }
          }
        },
        {
          $addFields: {
            score: { $meta: 'textScore' } // search "Iphone 11", vẫn trả về "Iphone 17 pro max" nhưng "Iphone 11" sẽ có score cao hơn và được sắp xếp lên đầu
          }
        },
        {
          $sort: { score: -1 } // Sort by relevance score
        }
      )
    }

    // 2. Filter productType
    if (productType) {
      const typeIds = productType?.split(',')?.map((id: string) => new ObjectId(id))
      filterStages.push({
        $match: {
          type: {
            $in: typeIds
          }
        }
      })
    }

    // 3. Filter productLocation
    if (productLocation) {
      const locationIds = productLocation?.split(',')?.map((id: string) => new ObjectId(id))
      filterStages.push({
        $match: {
          location: {
            $in: locationIds
          }
        }
      })
    }

    // 4. Filter price range
    if (minPrice >= 0 && maxPrice >= minPrice) {
      filterStages.push({
        $match: {
          price: { $gte: minPrice, $lte: maxPrice }
        }
      })
    }

    // 5. Filter rating (star)
    if (minStar >= 0 && maxStar >= minStar) {
      filterStages.push({
        $match: {
          rating: { $gte: minStar, $lte: maxStar }
        }
      })
    }

    // 6. Filter status
    if (statusFilter !== undefined) {
      const statuses = statusFilter?.split('|')?.map((s: number) => Number(s))

      filterStages.push({
        $match: {
          status: { $in: statuses }
        }
      })
    }

    // 7. Sort
    // const [sortField, sortDir] = order.split(' ')
    // const sortOrder = sortDir.toLowerCase() === 'asc' ? 1 : -1

    // filterStages.push({
    //   $sort: {
    //     [sortField]: sortOrder
    //   }
    // })

    // Build lookup and pagination stages
    const lookupAndPaginationStages: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'likedBy',
          foreignField: '_id',
          as: 'likedBy'
        }
      },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]

    // Combine stages for the main query
    const aggregationPipeline = [...filterStages, ...lookupAndPaginationStages]

    // Execute main query
    const products = await databaseService.products.aggregate(aggregationPipeline).toArray()

    // Count total documents with the same filters
    const countPipeline = [...filterStages, { $count: 'total' }]
    const countResult = await databaseService.products.aggregate(countPipeline).toArray()
    const totalCount = countResult.length > 0 ? countResult[0].total : 0
    const totalPage = Math.ceil(totalCount / limit)

    return {
      status: 200,
      message: 'Success',
      data: {
        products,
        totalPage,
        totalCount
      }
    }
  }
}

const productsService = new ProductsService()
export default productsService
