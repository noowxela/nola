import { ShopCustomer as ShopCustomerModel } from './shopCustomer.js';
import { User as UserModel } from '../auth/user.js';


import {
  getRecentShopCustomer,
  filterBlockedUsers,
  getShopCustomerList
} from './shopCustomer.service.js';
import { getShopById, userCheckInShowStagePopup } from '../shop/shop.service.js';

const shopCustomerDetail = {
  name: 'shopCustomerDetail',
  type: 'ShopCustomer!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const shopCustomer = await ShopCustomerModel.findOne({ ...args, archive: null }, {})
      if (!shopCustomer) {
        return Promise.reject(new Error('Shop Customer is not found'))
      }
      return shopCustomer
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const listAllShopCustomer = {
  name: 'listAllShopCustomer',
  type: '[ShopCustomer]!',
  resolve: async () => {
    try {
      const shopCustomer = await ShopCustomerModel.find({ archive: null })
      if (!shopCustomer) {
        return Promise.reject(new Error('Shop Customer list is currently empty'))
      }
      return shopCustomer
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const createShopCustomer = {
  name: 'createShopCustomer',
  type: 'ShopCustomer!',
  args: {
    shopId: 'String!'
  },
  resolve: async ({ args, context: { user } }) => {
    try {
      if (!user) {
        return Promise.reject(new Error('You are not logged in'))
      }
      const shop = await getShopById(args.shopId)
      if (!shop) {
        return Promise.reject(new Error('Shop not found.'))
      }
      const formData = {
        shopId: args.shopId,
        userId: user._id.toString()
      }
      await userCheckInShowStagePopup(user, shop)
      const shopCustomer = await new ShopCustomerModel(formData).save()
      return shopCustomer
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const getMyLatestCheckInDetail = {
  name: 'getMyLatestCheckInDetail',
  type: 'ShopCustomer!',
  resolve: async ({ context: { user } }) => {
    try {
      if (!user) {
        return Promise.reject(new Error('You are not logged in'))
      }

      const shopCustomer = await ShopCustomerModel.findOne({
        userId: user._id,
        createdAt: { $gte: new Date(Date.now() - 8 * 60 * 60 * 1000) },
        archive: null
      }).sort('-createdAt')

      if (!shopCustomer) {
        return Promise.reject(new Error('You are not checked in.'))
      }

      if (shopCustomer.isCheckedOut === true) {
        return Promise.reject(new Error('You are not checked in'))
      }

      return shopCustomer
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const userCheckOut = {
  name: 'userCheckOut',
  type: 'ShopCustomer!',
  resolve: async ({ context: { user } }) => {
    try {
      if (!user) {
        return Promise.reject(new Error('You are not logged in'))
      }

      const shopCustomer = await ShopCustomerModel.findOne({
        userId: user._id,
        archive: null
      }).sort('-createdAt')

      if (!shopCustomer) {
        return Promise.reject(new Error('Shop Customer is not found'))
      }

      if (shopCustomer.isCheckedOut === true) {
        return Promise.reject(new Error('You are not checked in'))
      }

      shopCustomer.isCheckedOut = true
      await shopCustomer.save()
      return shopCustomer
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const updateShopCustomer = {
  name: 'updateShopCustomer',
  type: 'ShopCustomer!',
  args: {
    _id: 'String!',
    shopId: 'String!',
    userId: 'String!',
    isCheckedOut: 'Boolean'
  },
  resolve: async ({ args }) => {
    try {
      const shopCustomer = await ShopCustomerModel.findById(args._id)
      if (!shopCustomer) {
        return Promise.reject(new Error('Shop Customer is not found'))
      }
      Object.assign(shopCustomer, args)
      await shopCustomer.save()
      return shopCustomer
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const archiveShopCustomer = {
  name: 'archiveShopCustomer',
  type: 'Succeed!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const shopCustomer = await ShopCustomerModel.findById(args._id)
      if (!shopCustomer) {
        return Promise.reject(new Error('Shop Customer is not found'))
      }
      shopCustomer.archive = Date.now()
      await shopCustomer.save()
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const listUserDiscover = {
  name: 'listUserDiscover',
  type: '[User]!',
  args: {
    shopId: 'String',
    username: 'String!'
  },
  resolve: async ({ args: { shopId, username }, context: { user } }) => {
    try {
      // if shopId is provided, return recent customer (no dups)
      if (!user) {
        return Promise.reject(new Error('You are not logged in.'))
      }
      if (shopId) {
        const recentShopCustomerIds = await getRecentShopCustomer(shopId, username)
        if (!recentShopCustomerIds) {
          return Promise.reject(new Error('Shop Customer is empty'))
        }
        const userIdArray = recentShopCustomerIds.map(e => {
          return e._id.toString()
        })

        const filteredBlockedUserIds = await filterBlockedUsers(userIdArray, user._id)
        const excludeSelf = filteredBlockedUserIds.filter(e => {
          return e.toString() !== user._id.toString()
        })

        const users = await UserModel.find({ _id: { $in: excludeSelf }, archive: null })
        if (!users) {
          return Promise.reject(new Error('Shop Customer is empty'))
        }
        return users
      }
      if (!shopId) {
        const userBeforeFilter = await UserModel.find({
          username: { $regex: username, $options: 'i' },
          role: 'customer',
          archive: null
        })
        if (!userBeforeFilter) {
          return Promise.reject(new Error('Shop Customer is empty'))
        }
        const userIdArray = userBeforeFilter.map(e => {
          return e._id.toString()
        })
        const filteredBlockedUserIds = await filterBlockedUsers(userIdArray, user._id)

        const excludeSelf = filteredBlockedUserIds.filter(e => {
          return e.toString() !== user._id.toString()
        })

        const users = await UserModel.find({ _id: { $in: excludeSelf }, archive: null })
        if (!users) {
          return Promise.reject(new Error('Shop Customer is empty'))
        }
        return users
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const listShopCustomer = {
  name: 'listShopCustomer',
  type: '[ShopCheckedInUserDetailTC]!',
  args: {
    shopId: 'String!',
    username: 'String!',
    startDate: 'Date',
    endDate: 'Date'
  },
  resolve: async ({ args: { shopId, username, startDate, endDate } }) => {
    try {
      const recentShopCustomers = await getShopCustomerList(shopId, username, startDate, endDate)
      if (!recentShopCustomers) {
        return Promise.reject(new Error('Shop Customer is empty'))
      }
      return recentShopCustomers
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const resolvers = {
  shopCustomerDetail,
  listAllShopCustomer,
  listUserDiscover,
  listShopCustomer,
  createShopCustomer,
  getMyLatestCheckInDetail,
  userCheckOut,
  updateShopCustomer,
  archiveShopCustomer
}
