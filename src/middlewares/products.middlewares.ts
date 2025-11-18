import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCTS_MESSAGES.NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: PRODUCTS_MESSAGES.NAME_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 100
    },
    errorMessage: PRODUCTS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
  },
  custom: {
    options: async (value) => {
      const product = await databaseService.products.findOne({ name: value })

      if (product) {
        throw new Error(PRODUCTS_MESSAGES.NAME_ALREADY_EXISTS)
      }

      return true
    }
  }
}

const imageSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: PRODUCTS_MESSAGES.IMAGE_URL_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 400
    },
    errorMessage: PRODUCTS_MESSAGES.IMAGE_URL_LENGTH
  }
}

const discountStartDateSchema: ParamSchema = {
  optional: true,
  isISO8601: {
    errorMessage: PRODUCTS_MESSAGES.DISCOUNT_START_DATE_INVALID
  },
  toDate: true,
  custom: {
    options: (value, { req }) => {
      if (value && !req.body.discountEndDate) {
        throw new Error(PRODUCTS_MESSAGES.DISCOUNT_BOTH_REQUIRED)
      }
      return true
    }
  }
}

const discountEndDateSchema: ParamSchema = {
  optional: true,
  isISO8601: {
    errorMessage: PRODUCTS_MESSAGES.DISCOUNT_END_DATE_INVALID
  },
  toDate: true,
  custom: {
    options: (value, { req }) => {
      const start = req.body.discountStartDate
      const end = req.body.discountEndDate

      // Nếu user truyền endDate nhưng không truyền startDate
      if (value && !start) {
        throw new Error(PRODUCTS_MESSAGES.DISCOUNT_BOTH_REQUIRED)
      }

      // Nếu truyền cả 2 → kiểm tra logic end >= start
      if (start && end && new Date(end) < new Date(start)) {
        throw new Error(PRODUCTS_MESSAGES.DISCOUNT_END_DATE_MUST_BE_AFTER_START_DATE)
      }

      return true
    }
  }
}

export const createProductValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      // slug: {
      //   notEmpty: {
      //     errorMessage: PRODUCTS_MESSAGES.SLUG_IS_REQUIRED
      //   },
      //   isString: {
      //     errorMessage: PRODUCTS_MESSAGES.SLUG_MUST_BE_A_STRING
      //   },
      //   trim: true,
      //   isLength: {
      //     options: {
      //       min: 1,
      //       max: 100
      //     },
      //     errorMessage: PRODUCTS_MESSAGES.SLUG_LENGTH_MUST_BE_FROM_1_TO_100
      //   }
      // },
      image: imageSchema,
      countInStock: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.COUNT_IN_STOCK_IS_REQUIRED
        },
        isInt: {
          options: { min: 0 },
          errorMessage: PRODUCTS_MESSAGES.COUNT_IN_STOCK_MUST_BE_A_NUMBER
        }
      },
      price: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.PRICE_IS_REQUIRED
        },
        isFloat: {
          options: { min: 0 },
          errorMessage: PRODUCTS_MESSAGES.PRICE_MUST_BE_A_NUMBER
        }
      },
      discountStartDate: discountStartDateSchema,
      discountEndDate: discountEndDateSchema
    },
    ['body']
  )
)

export const productIdValidator = validate(
  checkSchema(
    {
      id: {
        trim: true,
        isString: {
          errorMessage: PRODUCTS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.ID_IS_REQUIRED,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            const product = await databaseService.products.findOne({ _id: new ObjectId(value) })
            console.log({ product })

            if (!product) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            return Boolean(product)
          }
        }
      }
    },
    ['params']
  )
)

export const productIdBodyValidator = validate(
  checkSchema(
    {
      product_id: {
        trim: true,
        isString: {
          errorMessage: PRODUCTS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.ID_IS_REQUIRED,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            const product = await databaseService.products.findOne({ _id: new ObjectId(value) })
            console.log({ product })

            if (!product) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            return Boolean(product)
          }
        }
      }
    },
    ['body']
  )
)

export const productIdsBodyValidator = validate(
  checkSchema(
    {
      productIds: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.ID_IS_REQUIRED
        },
        isArray: {
          errorMessage: 'productIds must be an array'
        },
        custom: {
          options: async (values: string[]) => {
            if (!Array.isArray(values) || values.length === 0) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.ID_IS_REQUIRED,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            // Chuyển sang ObjectId
            const objectIds = values.map((v) => new ObjectId(v))

            // Lấy các product có _id trong mảng
            const foundProducts = await databaseService.products.find({ _id: { $in: objectIds } }).toArray()

            if (foundProducts.length !== values.length) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateProductValidator = validate(
  checkSchema(
    {
      name: { ...nameSchema, optional: true, notEmpty: undefined },
      slug: {
        optional: true,
        isString: {
          errorMessage: PRODUCTS_MESSAGES.SLUG_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: PRODUCTS_MESSAGES.SLUG_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      image: imageSchema,
      countInStock: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.COUNT_IN_STOCK_IS_REQUIRED
        },
        optional: true,
        isInt: {
          options: { min: 0 },
          errorMessage: PRODUCTS_MESSAGES.COUNT_IN_STOCK_MUST_BE_A_NUMBER
        }
      },
      price: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.PRICE_IS_REQUIRED
        },
        optional: true,
        isFloat: {
          options: { min: 0 },
          errorMessage: PRODUCTS_MESSAGES.PRICE_MUST_BE_A_NUMBER
        }
      },
      discountStartDate: discountStartDateSchema,
      discountEndDate: discountEndDateSchema,
      discount: {
        optional: true,
        isInt: {
          options: { min: 0 },
          errorMessage: PRODUCTS_MESSAGES.DISCOUNT_MUST_BE_A_NUMBER
        }
      },
      sold: {
        optional: true,
        isInt: {
          options: { min: 0 },
          errorMessage: PRODUCTS_MESSAGES.DISCOUNT_MUST_BE_A_NUMBER
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [[0, 1]],
          errorMessage: PRODUCTS_MESSAGES.STATUS_INVALID
        },
        toInt: true
      }
    },
    ['body']
  )
)
