import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto-random-string';
import moment from 'moment';

import { userMail } from './mail/index.js';
import { userService } from './service/index.js';
import { User as UserModel } from './user.js';


const user = {
  name: 'user',
  type: 'User!',
  resolve: ({ context: { user } }) => user
}

const signInAdmin = {
  name: 'signInAdmin',
  type: 'AccessToken!',
  args: {
    username: 'String!',
    password: 'String!'
  },
  resolve: async ({ args: { username, password } }) => {
    console.log("SignInAdmin gogogo")
    try {
      const user = await UserModel.managementLogin(username)
      if (!user) {
        return Promise.reject(new Error('You dont have permission.'))
      }
      const comparePassword = await user.comparePassword(password)
      if (!comparePassword) {
        return Promise.reject(new Error('Password is incorrect.'))
      }

      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      })

      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const signIn = {
  name: 'signIn',
  type: 'AccessToken!',
  args: {
    email: 'String!',
    password: 'String!'
  },
  resolve: async ({ args: { email, password } }) => {
    try {
      const user = await UserModel.emailExist(email)
      if (!user) {
        return Promise.reject(new Error('User not found.'))
      }

      const comparePassword = await user.comparePassword(password)
      if (!comparePassword) {
        return Promise.reject(new Error('Password is incorrect.'))
      }

      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      })

      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const signUp = {
  name: 'signUp',
  type: 'AccessToken!',
  args: {
    email: 'String!',
    password: 'String!'
  },
  resolve: async ({ args: { email, password }, context: { i18n } }) => {
    try {
      let user = await UserModel.emailExist(email)
      if (user) {
        return Promise.reject(new Error('Email has already been taken.'))
      }

      const hash = bcrypt.hashSync(password, 10)

      user = await new UserModel({
        email,
        password: hash,
        locale: i18n.language
      }).save()

      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      })

      const token = await userService.verifyRequest(user)

      // userMail.verifyRequest(user, token)

      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const logout = {
  name: 'logout',
  type: 'Succeed!',
  resolve: async ({ context: { user, accessToken } }) => {
    try {
      // await redis.set(`expiredToken:${accessToken}`, user._id, 'EX', process.env.REDIS_TOKEN_EXPIRY)

      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const verifyRequest = {
  name: 'verifyRequest',
  type: 'Succeed!',
  resolve: async ({ context: { user } }) => {
    try {
      const token = await userService.verifyRequest(user)

      // userMail.verifyRequest(user, token)

      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const verify = {
  name: 'verify',
  type: 'AccessToken!',
  args: { token: 'String!' },
  resolve: async ({ args: { token } }) => {
    try {
      const user = await UserModel.findOne({
        'account.verification.token': token
      })
      if (!user) {
        return Promise.reject(new Error('Access Token is not valid or has expired.'))
      }

      user.set({
        account: {
          verification: {
            verified: true,
            token: null,
            expiresIn: null
          }
        }
      })

      await user.save()

      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      })

      // userMail.verify(user)

      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const resetPassword = {
  name: 'resetPassword',
  type: 'Succeed!',
  args: { email: 'String!' },
  resolve: async ({ args: { email } }) => {
    try {
      const user = await UserModel.findOne({ email })
      if (!user) {
        return Promise.reject(new Error('User not found.'))
      }

      const token = crypto({ length: 48, type: 'url-safe' })
      const expiresIn = moment().add(7, 'days')

      user.set({
        account: {
          resetPassword: {
            token,
            expiresIn
          }
        }
      })

      await user.save()

      // userMail.resetPassword(user, token)

      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const newPassword = {
  name: 'newPassword',
  type: 'AccessToken!',
  args: { token: 'String!', newPassword: 'String!' },
  resolve: async ({ args: { token, newPassword } }) => {
    try {
      const user = await UserModel.findOne({
        'account.resetPassword.token': token
      })
      if (!user) {
        return Promise.reject(new Error('Access Token is not valid or has expired.'))
      }

      const hash = bcrypt.hashSync(newPassword, 10)

      user.set({
        password: hash,
        account: {
          resetPassword: {
            token: null,
            expiresIn: null
          }
        }
      })

      await user.save()

      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      })

      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const changePassword = {
  name: 'changePassword',
  type: 'Succeed!',
  args: { currentPassword: 'String!', newPassword: 'String!' },
  resolve: async ({ args: { currentPassword, newPassword }, context: { user } }) => {
    try {
      const comparePassword = await user.comparePassword(currentPassword)
      if (!comparePassword) {
        return Promise.reject(new Error('Current password is incorrect.'))
      }

      const hash = bcrypt.hashSync(newPassword, 10)

      user.set({ password: hash })

      await user.save()

      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const updateUser = {
  name: 'updateUser',
  type: 'User!',
  args: { email: 'String!', firstName: 'String!', lastName: 'String!' },
  resolve: async ({ args: { email, firstName, lastName }, context: { user } }) => {
    try {
      let {
          account: {
            verification: { verified }
          }
        } = user,
        verifyRequest = false

      if (user.email !== email) {
        const userExist = await UserModel.findOne({ email })
        if (userExist) {
          return Promise.reject(new Error('Email has already been taken.'))
        }
        verified = false
        verifyRequest = true
      }

      user.set({
        email,
        firstName,
        lastName,
        account: {
          verification: {
            verified
          }
        }
      })

      await user.save()

      if (verifyRequest) {
        const token = await userService.verifyRequest(user)

        // userMail.verifyRequest(user, token)
      }

      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const switchLocale = {
  name: 'switchLocale',
  type: 'User!',
  args: { locale: 'Locale!' },
  resolve: async ({ args: { locale }, context: { user } }) => {
    try {
      user.set({ locale })

      await user.save()

      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const listAllUser = {
  name: 'listAllUser',
  type: '[User]!',
  args: {
    _id: 'String',
    username: 'String',
    isAdmin: 'Boolean'
  },
  resolve: async ({ args }) => {
    try {
      const checkFilter = args => {
        if (args._id && args.username) {
          return { ...args, archive: null }
        }
        if (args._id && !args.username) {
          return { _id: args._id, archive: null }
        }
        if (!args._id && args.username) {
          return { username: { $regex: args.username, $options: 'i' }, archive: null }
        }
        if (!args._id && !args.username) {
          return { archive: null }
        }
      }
      const filter = checkFilter(args)
      const users = await UserModel.find(filter)
      if (!users) {
        return Promise.reject(new Error('User list is currently empty'))
      }

      if (args) {
        if (args.isAdmin === true) {
          return users
        }
      }

      let filteredUsers = []
      filteredUsers = users.filter(e => {
        return e.role.toString() === 'customer'
      })
      return filteredUsers
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const userDetail = {
  name: 'userDetail',
  type: 'User!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const user = await UserModel.findOne({ ...args, archive: null }, {})
      if (!user) {
        return Promise.reject(new Error('User is not found'))
      }
      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const updateUserByAdmin = {
  name: 'updateUserByAdmin',
  type: 'User!',
  args: {
    _id: 'String!',
    phone_number: 'String',
    avatar_url: 'String',
    gender: 'String',
    onboarding_reason: 'String',
    interest: '[String]',
    wallet: 'Int',
    role: 'String',
    isWelcomeGiftRedeemed: 'Boolean',
    food_interest: '[String]',
    drink_interest: '[String]',
    event_interest: '[String]',
    performance_interest: '[String]',
    username: 'String',
    gallery: '[String]',
    date_of_birth: 'Date',
    email: 'String',
    tier: 'String',
    spending_tier: 'String',
    freeze_tier: 'Boolean',
    current_location: 'String',
    FB_Url: 'String',
    IG_Url: 'String',
    WeChat: 'String',
    firstCheckIn: 'String'
  },
  resolve: async ({ args }) => {
    try {
      const user = await UserModel.findById(args._id)
      if (!user) {
        return Promise.reject(new Error('User is not found'))
      }
      Object.assign(user, args)
      // user.firstCheckIn = args.firstCheckIn
      await user.save()
      // console.log(user)
      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const archiveUser = {
  name: 'archiveUser',
  type: 'Succeed!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const user = await UserModel.findById(args._id)
      if (!user) {
        return Promise.reject(new Error('User is not found'))
      }
      user.archive = Date.now()
      await user.save()
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const resolvers = {
  user,
  signInAdmin,
  signIn,
  signUp,
  logout,
  verifyRequest,
  verify,
  resetPassword,
  newPassword,
  changePassword,
  updateUser,
  switchLocale,
  listAllUser,
  userDetail,
  updateUserByAdmin,
  archiveUser,
}