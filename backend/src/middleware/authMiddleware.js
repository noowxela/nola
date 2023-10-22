import { User as UserModel } from '../module/auth/user.js';


const authMiddleware = {
  isAuth: async (resolve, source, args, context, info) => {
    const { user } = context

    if (!user) {
      return Promise.reject(new Error('You must be authorized.'))
    }

    return resolve(source, args, context, info)
  },

  isAdmin: async (resolve, source, args, context, info) => {
    const user = await UserModel.findOne({
      username: args.username,
      $or: [{ role: 'admin' }, { role: 'manager' }]
    })
    if (!user) {
      return Promise.reject(new Error('Wrong Account or Password'))
    }

    return resolve(source, args, context, info)
  },

  isGuest: async (resolve, source, args, context, info) => {
    const { user } = context

    if (user) {
      return Promise.reject(new Error('You have already authorized.'))
    }

    return resolve(source, args, context, info)
  },

  isVerified: async (resolve, source, args, context, info) => {
    const {
      user: {
        account: {
          verification: { verified }
        }
      }
    } = context

    if (!verified) {
      return Promise.reject(new Error('You must be verified.'))
    }

    return resolve(source, args, context, info)
  },

  isUnverfied: async (resolve, source, args, context, info) => {
    const {
      user: {
        account: {
          verification: { verified }
        }
      }
    } = context

    if (verified) {
      return Promise.reject(new Error('You have already verified.'))
    }

    return resolve(source, args, context, info)
  }
}

export { authMiddleware }
