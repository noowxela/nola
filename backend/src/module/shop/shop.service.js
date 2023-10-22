import Pusher from 'pusher';
import { Shop as ShopModel } from './shop.js';
import { Event as EventModel } from '../event/event.js';
import { ShopCustomer as ShopCustomerModel } from '../shopCustomer/shopCustomer.js';

const pusher = new Pusher({
  appId: '1348905',
  key: 'a8310060d9de1974943c',
  secret: 'a28e82dac29c4664bd52',
  cluster: 'ap1'
})

const getShopById = async id => {
  return ShopModel.findById(id)
}

const userCheckInShowStagePopup = async (user, shop) => {
  // todo interval for live
  // const time_interval = 10 * 1000
  const time_interval = process.env.NODE_ENV === 'development' ? 10 * 1000 : 60 * 60 * 1000
  const last1HourCheckinInstance = await ShopCustomer.find({
    userId: user._id,
    createdAt: { $gte: new Date(Date.now() - time_interval) }, //1 hour *10sec for dev purpose
    archive: null
  }).sort('-createdAt')
  if (shop.mode === 'event' && shop.eventId && last1HourCheckinInstance.length <= 2) {
    const event = await EventModel.findOne({ _id: shop.eventId, archive: null })
    if (!event) {
      return
    }
    if (user.spending_tier === 'tier4' && user.gender === 'male') {
      pusher.trigger(event.pusher_chat_channel_name, event.pusher_chat_event_name, {
        type: 'checkin',
        effect_type: 'checkin-spending-male-tier4',
        effect_name: '皇帝',
        user_mongoId: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
        tier: user.tier,
        spending_tier: user.spending_tier
      })
      return
    }
    if (user.spending_tier === 'tier4' && user.gender === 'female') {
      pusher.trigger(event.pusher_chat_channel_name, event.pusher_chat_event_name, {
        type: 'checkin',
        effect_type: 'checkin-spending-female-tier4',
        effect_name: '皇后',
        user_mongoId: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
        tier: user.tier,
        spending_tier: user.spending_tier
      })
      return
    }
    if (user.tier === 'tier4') {
      pusher.trigger(event.pusher_chat_channel_name, event.pusher_chat_event_name, {
        type: 'checkin',
        effect_type: 'checkin-receiving-tier4',
        effect_name: '钻石',
        user_mongoId: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
        tier: user.tier,
        spending_tier: user.spending_tier
      })
      return
    }
    if (user.spending_tier === 'tier3' && user.gender === 'male') {
      pusher.trigger(event.pusher_chat_channel_name, event.pusher_chat_event_name, {
        type: 'checkin',
        effect_type: 'checkin-spending-male-tier3',
        effect_name: '皇子',
        user_mongoId: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
        tier: user.tier,
        spending_tier: user.spending_tier
      })
      return
    }
    if (user.spending_tier === 'tier3' && user.gender === 'female') {
      pusher.trigger(event.pusher_chat_channel_name, event.pusher_chat_event_name, {
        type: 'checkin',
        effect_type: 'checkin-spending-female-tier3',
        effect_name: '皇妃',
        user_mongoId: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
        tier: user.tier,
        spending_tier: user.spending_tier
      })
      return
    }
    if (user.tier === 'tier3') {
      pusher.trigger(event.pusher_chat_channel_name, event.pusher_chat_event_name, {
        type: 'checkin',
        effect_type: 'checkin-receiving-tier3',
        effect_name: '黄金',
        user_mongoId: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
        tier: user.tier,
        spending_tier: user.spending_tier
      })
      return
    }
  }
}

const triggerStageScreenEffect = async (shop, user, type, effect_type) => {
  if (shop.mode === 'event' && shop.eventId) {
    const event = await EventModel.findOne({ _id: shop.eventId, archive: null })
    if (!event) {
      return
    }
    pusher.trigger(event.pusher_chat_channel_name, event.pusher_chat_event_name, {
      type: type,
      user_mongoId: user._id,
      username: user.username,
      avatar_url: user.avatar_url,
      effect_type: effect_type
    })
  }
}

export { getShopById, userCheckInShowStagePopup, triggerStageScreenEffect }
