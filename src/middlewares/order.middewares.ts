import { checkSchema } from 'express-validator'
import { ORDERS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

// "paymentMethod",
//       "itemsPrice",
//       "shippingPrice",
//       "totalPrice",
//       "fullName",
//       "city",
//       "address",
//       "phone",

export const orderBodyValidator = validate(
  checkSchema(
    {
      fullName: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.FULL_NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: ORDERS_MESSAGES.FULL_NAME_IS_REQUIRED
        }
      },
      address: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.ADDRESS_IS_REQUIRED
        },
        isString: {
          errorMessage: ORDERS_MESSAGES.ADDRESS_MUST_BE_A_STRING
        }
      },
      city: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.CITY_IS_REQUIRED
        },
        isString: {
          errorMessage: ORDERS_MESSAGES.CITY_MUST_BE_A_STRING
        }
      },
      phone: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.PHONE_IS_REQUIRED
        },
        isInt: {
          options: { min: 0 },
          errorMessage: ORDERS_MESSAGES.PHONE_MUST_BE_A_NUMBER
        }
      },
      paymentMethod_id: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.PAYMENT_METHOD_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: ORDERS_MESSAGES.PAYMENT_METHOD_ID_MUST_BE_A_STRING
        }
      },
      deliveryMethod_id: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.DELIVERY_METHOD_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: ORDERS_MESSAGES.DELIVERY_METHOD_ID_MUST_BE_A_STRING
        }
      },
      itemsPrice: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.ITEMS_PRICE_IS_REQUIRED
        },
        isInt: {
          options: { min: 0 },
          errorMessage: ORDERS_MESSAGES.ITEMS_PRICE_MUST_BE_A_NUMBER
        }
      },
      shippingPrice: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.SHIPPING_PRICE_IS_REQUIRED
        },
        isInt: {
          options: { min: 0 },
          errorMessage: ORDERS_MESSAGES.SHIPPING_PRICE_MUST_BE_A_NUMBER
        }
      },
      totalPrice: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.TOTAL_PRICE_IS_REQUIRED
        },
        isInt: {
          options: { min: 0 },
          errorMessage: ORDERS_MESSAGES.TOTAL_PRICE_MUST_BE_A_NUMBER
        }
      }
    },
    ['body']
  )
)
