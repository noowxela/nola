import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';

import { ShopCustomer as ShopCustomerModel } from './shopCustomer.js';
import { User as UserModel } from '../auth/user.js';
import { ShopModel as ShopModel } from '../shop/shop.js';

import { checkUserStatus } from '../auth/user.service.js';

const ShopCustomerTC = composeWithMongoose(ShopCustomerModel)
const ShopCustomerUserTC = composeWithMongoose(UserModel, {
  name: 'ShopCustomerUserDetail'
}).removeField([
  'wallet',
  'role',
  'locale',
  'account',
  'password',
  'updatedAt',
  'leaderboard_female_record',
  'leaderboard_male_record',
  'leaderboard_rich_record'
])

ShopCustomerUserTC.addFields({
  averageSpending: {
    type: 'Int',
    args: {
      filter: `
        input UsersFilterInput {
          startDate: Date
          endDate: Date
        }
      `
    },
    resolve: async (source, args) => {
      if (args.filter) {
        if (args.filter.startDate && args.filter.endDate) {
          return 0
        }
      }
      let today = new Date()
      return await 0
    }
  },
  status: {
    type: 'String',
    resolve: async source => {
      return await checkUserStatus(source)
    }
  }
})

const ShopCustomerShopDetail = composeWithMongoose(ShopModel, {
  name: 'ShopCustomerShopDetail'
}).removeField([
  'image_url',
  'mode',
  'game_type',
  'pusher_channel_name',
  'pusher_chat_channel_name',
  'rest_banner',
  'revenue',
  'punishment',
  'rest_image_url',
  'event_image_url',
  'eventId',
  'pusherConfig',
  'archive'
])

const ShopCheckedInUserDetailTC = schemaComposer.createObjectTC({
  name: 'ShopCheckedInUserDetailTC',
  fields: {
    createdAt: 'Date',
    user: ShopCustomerUserTC
  }
})

ShopCustomerTC.addFields({
  user: {
    type: ShopCustomerUserTC,
    resolve: async shopCustomer => {
      return await UserModel.findOne({ _id: shopCustomer.userId }).sort('-createdAt')
    }
  },
  shop: {
    type: ShopCustomerShopDetail,
    resolve: async shopCustomer => {
      return await ShopModel.findOne({ _id: shopCustomer.shopId }).sort('-createdAt')
    }
  }
})

module.exports = ShopCustomerTC
