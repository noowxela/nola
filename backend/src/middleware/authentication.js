import jwt from 'jsonwebtoken';

// const redis = require('redis')
// const UserModel = require('module/auth/user')
import { User as UserModel} from '../module/auth/user.js';

const authentication = async (req, res, next) => {
  try {
    const {
      headers: { authorization }
    } = req
    if (!authorization) {
      return next()
    }

    const accessToken = authorization.split(' ')[1]

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    if (!decoded) {
      return next()
    }

    // const isExpired = await redis.get(`expiredToken:${accessToken}`)
    // if (isExpired) {
    //   return next()
    // }

    const user = await UserModel.findById(decoded.userId)
    if (!user) {
      return next()
    }

    Object.assign(req, {
      user,
      accessToken
    })

    return next()
  } catch (error) {
    return next()
  }
}

export { authentication }

