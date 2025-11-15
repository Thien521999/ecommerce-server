import { Request, Response, NextFunction } from 'express'
import { pick } from 'lodash'

type FiterKeys<T> = Array<keyof T> //Tao ra 1 mang co nhung item lay ra tu nhung thang T

export const fiterMiddeware =
  <T>(fiterKeys: FiterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, fiterKeys)
    next()
  }
