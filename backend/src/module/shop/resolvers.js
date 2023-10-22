import moment from 'moment';
import mongoose from 'mongoose';
import QRCode from 'qrcode';

import { Shop as ShopModel } from './shop.js';
import { Event as EventModel } from '../event/event.js';
import { GameHistory as GameHistoryModel } from '../gameHistory/gameHistory.js';

import { triggerStageScreenEffect } from './shop.service.js';
import { getUserById } from '../auth/user.service.js';

import { 
  getTodayCustomerNumber,
  getTotalCustomerNumber,
  getDashboardCustomerStatus
} from '../shopCustomer/shopCustomer.service.js';

const shopDetail = {
  name: 'shopDetail',
  type: 'Shop!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const shop = await ShopModel.findOne({ ...args, archive: null }, {})
      if (!shop) {
        return Promise.reject(new Error('Shop is currently empty'))
      }
      return shop
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const listAllShop = {
  name: 'listAllShop',
  type: '[Shop]!',
  args: {
    _id: 'String',
    isAdmin: 'Boolean'
  },
  resolve: async ({ args }) => {
    try {
      const checkFilter = args => {
        if (args._id) {
          return { _id: args._id, archive: null }
        }
        if (!args._id) {
          return { archive: null }
        }
      }
      const filter = checkFilter(args)
      // const shop = await ShopModel.find({ ...args, archive: null }, {})
      const shop = await ShopModel.find(filter)
      if (!shop) {
        return Promise.reject(new Error('Shop is currently empty'))
      }

      if (args) {
        if (args.isAdmin === true) {
          return shop
        }
      }
      // console.log('shop,', shop)
      let filteredShops = []
      filteredShops = shop.filter(e => {
        return (
          e._id.toString() !== '628d1fc1b0dcf55520c00304' &&
          e._id.toString() !== '628d20b0b0dcf55520c00306'
          // && e._id.toString() !== '6254f6952032aeda1492d607'
        )
      })

      return filteredShops
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const portalListShop = {
  name: 'portalListShop',
  type: '[Shop]!',
  resolve: async ({ context: { user } }) => {
    try {
      if (!user) {
        return Promise.reject(new Error('You are not logged in.'))
      }
      if (user.role !== 'admin' && user.role !== 'manager') {
        return Promise.reject(new Error(`You don't have access.`))
      }
      if (user.role === 'admin') {
        const shop = await ShopModel.find({ archive: null })
        if (!shop) {
          return Promise.reject(new Error('Shop is currently empty'))
        }
        return shop
      }
      if (user.role === 'manager') {
        const shop = await ShopModel.find({ managerId: user._id, archive: null })
        if (!shop) {
          return Promise.reject(new Error('Shop is currently empty'))
        }
        return shop
      }

      const shop = await ShopModel.find({ archive: null })
      if (!shop) {
        return Promise.reject(new Error('Shop is currently empty'))
      }
      return shop
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
// TODO: Deprecated
const getPusherConfig = {
  name: 'getPusherConfig',
  type: 'PusherConfig!',
  resolve: async () => {
    try {
      const shop = await ShopModel.findOne({
        _id: mongoose.Types.ObjectId('620cdb750d51ac5054f45272'),
        archive: null
      })
      if (!shop) {
        return Promise.reject(new Error('Shop is currently empty'))
      }
      return shop.pusherConfig
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const stageTriggerPurchaseEffect = {
  name: 'stageTriggerPurchaseEffect',
  type: 'Succeed!',
  args: {
    _id: 'String!',
    userId: 'String!',
    type: 'String!',
    effect_type: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const shop = await ShopModel.findOne({
        _id: args._id,
        archive: null
      })
      if (!shop) {
        return Promise.reject(new Error('Shop is not found'))
      }
      const user = await getUserById(args.userId)
      if (!user) {
        return Promise.reject(new Error('User is not found'))
      }
      await triggerStageScreenEffect(shop, user, args.type, args.effect_type)
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const createShop = {
  name: 'createShop',
  type: 'Shop!',
  args: {
    name: 'String!',
    location: 'String!',
    phone_number: 'String!',
    addressLine1: 'String!',
    state: 'String!',
    district: 'String!',
    postcode: 'Int',
    image_url: 'String',
    punishment: '[Int]',
    managerId: 'String'
  },
  resolve: async ({ args }) => {
    console.log("args : ",args)
    args = {...args,
      pusher_channel_name : `presence-${args.name.split(' ').join('-')}`,
      pusher_chat_channel_name : `presence-chat-${args.name.split(' ').join('-')}`,
    }
    console.log("args : ",args)

    try {
      // const shop = await new ShopModel(args).save()
      const shop = await new ShopModel(args)
      shop.pusher_channel_name = `presence-${shop.name.split(' ').join('-')}`
      shop.pusher_chat_channel_name = `presence-chat-${shop.name.split(' ').join('-')}`
      return await shop.save()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const updateShop = {
  name: 'updateShop',
  type: 'Shop!',
  args: {
    _id: 'String!',
    name: 'String',
    image_url: 'String',
    mode: 'String',
    game_type: 'String',
    pusher_channel_name: 'String',
    rest_banner: 'String',
    location: 'String',
    city: 'String',
    phone_number: 'String',
    revenue: 'Float',
    punishment: '[Int]',
    rest_image_url: 'String',
    event_image_url: 'String',
    eventId: 'String',
    next_event_id: 'String',
    next_event_mode: 'String',
    next_event_game_type: 'String',
    managerId: 'String'
  },
  resolve: async ({ args }) => {
    try {
      const shop = await ShopModel.findById(args._id)
      if (!shop) {
        return Promise.reject(new Error('Shop is not found'))
      }
      Object.assign(shop, args)
      await shop.save()
      return shop
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const triggerShopMode = {
  name: 'triggerShopMode',
  type: 'Shop!',
  args: {
    _id: 'String!',
    mode: 'String',
    game_type: 'String',
    eventId: 'String',
    event_image_url: 'String',
    rest_image_url: 'String',
    current_event: 'String',
    next_event_id: 'String',
    next_event_mode: 'String',
    next_event_game_type: 'String'
  },
  resolve: async ({ args }) => {
    try {
      const shop = await ShopModel.findById(args._id)
      if (!shop) {
        return Promise.reject(new Error('Shop is not found'))
      }

      if (shop.mode === 'rest' && args.mode === 'rest') {
        return Promise.reject(new Error('Shop is already in Rest Mode.'))
      }

      if (shop.mode === 'rest' && args.mode === 'game') {
        shop.mode = args.mode
        shop.game_type = args.game_type
        shop.next_event_id = null
        shop.next_event_game_type = null
        shop.next_event_mode = null
        await shop.save()
        return shop
      }

      if (shop.mode === 'rest' && args.mode === 'event') {
        Object.assign(shop, args)
        shop.next_event_id = null
        shop.next_event_game_type = null
        shop.next_event_mode = null
        await shop.save()
        return shop
      }

      if (shop.mode === 'game' && args.mode === 'game') {
        if (shop.game_type === args.game_type) {
          return Promise.reject(new Error('There is game on-going right now.'))
        }
        shop.next_event_id = null
        shop.next_event_mode = args.mode
        shop.next_event_game_type = args.game_type
        await shop.save()
        return shop
      }

      if (shop.mode === 'game' && args.mode === 'event') {
        const event = await EventModel.findById(args.eventId)
        if (!event) {
          return Promise.reject(new Error('Invalid Event Selected'))
        }
        shop.next_event_id = event._id
        shop.next_event_mode = args.mode
        shop.event_image_url = event.image_url
        await shop.save()
        return shop
      }

      if (shop.mode === 'game' && args.mode === 'rest') {
        shop.next_event_id = null
        shop.next_event_mode = args.mode
        await shop.save()
        return shop
      }

      if (shop.mode === 'event' && args.mode === 'event') {
        Object.assign(shop, args)
        shop.next_event_id = null
        shop.next_event_game_type = null
        shop.next_event_mode = null
        await shop.save()
        return shop
      }

      if (shop.mode === 'event' && args.mode === 'rest') {
        Object.assign(shop, args)
        shop.next_event_id = null
        shop.next_event_game_type = null
        shop.next_event_mode = null
        await shop.save()
        return shop
      }

      if (shop.mode === 'event' && args.mode === 'game') {
        Object.assign(shop, args)
        shop.next_event_id = null
        shop.next_event_game_type = null
        shop.next_event_mode = null
        await shop.save()
        return shop
      }

      await shop.save()
      return shop
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const gameEndScreenChecking = {
  name: 'gameEndScreenChecking',
  type: 'Shop!',
  args: {
    _id: 'String!',
    game_type: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const shop = await ShopModel.findOne({ _id: args._id, archive: null })
      if (!shop) {
        return Promise.reject(new Error('Shop is not found'))
      }

      if (shop.next_event_mode !== null) {
        if (shop.next_event_mode === 'event') {
          const event = await EventModel.findById(shop.next_event_id)
          if (!event) {
            return Promise.reject(new Error('Invalid Event Selected'))
          }
          shop.mode = shop.next_event_mode
          shop.eventId = event._id
          shop.event_image_url = event.image_url
          shop.next_event_id = null
          shop.next_event_game_type = null
          shop.next_event_mode = null
          await shop.save()
        }

        if (shop.next_event_mode === 'rest') {
          shop.mode = shop.next_event_mode
          shop.next_event_id = null
          shop.next_event_game_type = null
          shop.next_event_mode = null
          await shop.save()
        }

        if (shop.next_event_mode === 'game' && shop.game_type !== shop.next_event_game_type) {
          shop.mode = shop.next_event_mode
          shop.game_type = shop.next_event_game_type
          shop.next_event_id = null
          shop.next_event_game_type = null
          shop.next_event_mode = null

          const gameHistory = await new GameHistoryModel({
            shopId: shop._id,
            game_type: shop.game_type,
            pusher_channel_name: shop.pusher_channel_name
          }).save()
          const gameQRUrl = await new QRCode.toDataURL(
            `${process.env.STAGE_URL}/${shop._id}/${shop.game_type}-player?gameId=${gameHistory._id}`,
            {
              text: `${process.env.STAGE_URL}/${shop._id}/${shop.game_type}-player?gameId=${gameHistory._id}`,
              width: 500,
              height: 500
            }
          )
          gameHistory.QR_base64 = gameQRUrl
          await gameHistory.save()
          await shop.save()
        }
        return shop
      }

      if (shop.next_event_mode === null) {
        const gameHistory = await new GameHistoryModel({
          shopId: shop._id,
          game_type: shop.game_type,
          pusher_channel_name: shop.pusher_channel_name
        }).save()
        const gameQRUrl = await new QRCode.toDataURL(
          `${process.env.STAGE_URL}/${shop._id}/${shop.game_type}-player?gameId=${gameHistory._id}`,
          {
            text: `${process.env.STAGE_URL}/${shop._id}/${shop.game_type}-player?gameId=${gameHistory._id}`,
            width: 500,
            height: 500
          }
        )
        gameHistory.QR_base64 = gameQRUrl
        await gameHistory.save()
      }

      return shop
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const archiveShop = {
  name: 'archiveShop',
  type: 'Succeed!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const shop = await ShopModel.findById(args._id)
      if (!shop) {
        return Promise.reject(new Error('Shop is not found'))
      }
      shop.archive = Date.now()
      await shop.save()
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const getDashboardSummary = {
  name: 'getDashboardSummary',
  type: 'DashboardSummary!',
  args: {
    shopId: 'String'
  },
  resolve: async ({ args: { shopId }, context: { user } }) => {
    try {
      if (!user) {
        return Promise.reject(new Error('You are not logged in.'))
      }
      if (user.role !== 'admin' && user.role !== 'manager') {
        return Promise.reject(new Error(`You don't have access.`))
      }
      if (user.role === 'admin') {
        if (!shopId) {
          let dashboardSummary = {}
          dashboardSummary.todayGuest = 101
          dashboardSummary.totalGuest = 909
          dashboardSummary.todayCustomer = await getTodayCustomerNumber()
          dashboardSummary.totalCustomer = await getTotalCustomerNumber()
          return dashboardSummary
        }
        if (shopId) {
          const shop = await ShopModel.findById(shopId)
          if (!shop) {
            return Promise.reject(new Error('Shop is not found'))
          }
          let dashboardSummary = {}
          dashboardSummary.todayGuest = 101
          dashboardSummary.totalGuest = 909
          dashboardSummary.todayCustomer = await getTodayCustomerNumber(shopId)
          dashboardSummary.totalCustomer = await getTotalCustomerNumber(shopId)
          return dashboardSummary
        }
      }
      if (user.role === 'manager') {
        const shop = await ShopModel.findOne({ managerId: user._id, archive: null })
        if (!shop) {
          return Promise.reject(new Error('You are not assigned to any shop yet.'))
        }
        let dashboardSummary = {}
        dashboardSummary.todayGuest = 101
        dashboardSummary.totalGuest = 909
        dashboardSummary.todayCustomer = await getTodayCustomerNumber(shop._id)
        dashboardSummary.totalCustomer = await getTotalCustomerNumber(shop._id)
        return dashboardSummary
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const getDashboardUpcomingEvents = {
  name: 'getDashboardUpcomingEvents',
  type: '[Event]',
  args: {
    shopId: 'String'
  },
  resolve: async ({ args: { shopId }, context: { user } }) => {
    try {
      if (!user) {
        return Promise.reject(new Error('You are not logged in.'))
      }
      if (user.role !== 'admin' && user.role !== 'manager') {
        return Promise.reject(new Error(`You don't have access.`))
      }
      if (user.role === 'admin') {
        if (!shopId) {
          const today = moment()
          const event = await EventModel.find({
            archive: null,
            $or: [
              { start_time: { $gte: new Date(Date.now() - 12 * 60 * 60 * 1000) } },
              {
                $and: [
                  {
                    start_time: {
                      $lte: today
                    }
                  },
                  {
                    end_time: {
                      $gte: today
                    }
                  }
                ]
              }
            ]
          })
          if (!event) {
            return Promise.reject(new Error('Event is currently empty'))
          }
          return event
        }
        if (shopId) {
          const today = moment()
          const event = await EventModel.find({
            shopId: shopId,
            archive: null,
            $or: [
              { start_time: { $gte: new Date(Date.now() - 12 * 60 * 60 * 1000) } },
              {
                $and: [
                  {
                    start_time: {
                      $lte: today
                    }
                  },
                  {
                    end_time: {
                      $gte: today
                    }
                  }
                ]
              }
            ]
          })
          if (!event) {
            return Promise.reject(new Error('Event is currently empty'))
          }
          return event
        }
      }
      if (user.role === 'manager') {
        const shop = await ShopModel.findOne({ managerId: user._id, archive: null })
        if (!shop) {
          return Promise.reject(new Error('You are not assigned to any shop yet.'))
        }
        const today = moment()
        const event = await EventModel.find({
          shopId: shop._id,
          archive: null,
          $or: [
            { start_time: { $gte: new Date(Date.now() - 12 * 60 * 60 * 1000) } },
            {
              $and: [
                {
                  start_time: {
                    $lte: today
                  }
                },
                {
                  end_time: {
                    $gte: today
                  }
                }
              ]
            }
          ]
        })
        if (!event) {
          return Promise.reject(new Error('Event is currently empty'))
        }
        return event
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const getDashboardCustomerChart = {
  name: 'getDashboardCustomerChart',
  type: '[DashboardCustomerChart]',
  args: {
    shopId: 'String'
  },
  resolve: async ({ args: { shopId }, context: { user } }) => {
    try {
      if (!user) {
        return Promise.reject(new Error('You are not logged in.'))
      }
      if (user.role !== 'admin' && user.role !== 'manager') {
        return Promise.reject(new Error(`You don't have access.`))
      }
      if (user.role === 'admin') {
        if (!shopId) {
          const customerChartData = await getDashboardCustomerStatus()
          return customerChartData
        }
        if (shopId) {
          const customerChartData = await getDashboardCustomerStatus(shopId)
          return customerChartData
        }
      }
      if (user.role === 'manager') {
        const shop = await ShopModel.findOne({ managerId: user._id, archive: null })
        if (!shop) {
          return Promise.reject(new Error('You are not assigned to any shop yet.'))
        }
        const customerChartData = await getDashboardCustomerStatus(shop.id)
        return customerChartData
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const resolvers = {
  shopDetail,
  portalListShop,
  listAllShop,
  getPusherConfig,
  createShop,
  updateShop,
  triggerShopMode,
  gameEndScreenChecking,
  archiveShop,
  stageTriggerPurchaseEffect,
  getDashboardSummary,
  getDashboardUpcomingEvents,
  getDashboardCustomerChart,
}