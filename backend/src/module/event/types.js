import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';

import { Event as EventModel } from './event.js';
import { Shop as ShopModel } from '../shop/shop.js';
import { User as UserModel } from '../auth/user.js';

const EventShop = composeWithMongoose(ShopModel, {
  name: 'EventShop'
})

// const { getEventPerformerGiftTotal } = require('@app/module/transaction/transaction.service.js')
const EventTC = composeWithMongoose(EventModel)

const EventPerformerModel = composeWithMongoose(UserModel, { name: 'EventPerformers' }).removeField(
  [
    'phone_number',
    'onboarding_reason',
    'interest',
    'wallet',
    'role',
    'date_of_birth',
    'locale',
    'account',
    'password',
    'updatedAt',
    'leaderboard_female_record',
    'leaderboard_male_record',
    'leaderboard_rich_record'
  ]
)

const EventPerformerGiftReceivedAmount = schemaComposer.createObjectTC({
  name: 'EventPerformerGiftReceivedAmount',
  fields: {
    _id: 'String',
    total: 'Float',
    user: EventPerformerModel
  }
})

EventTC.addFields({
  giftReceivedAmount: {
    type: [EventPerformerGiftReceivedAmount],
    resolve: async event => {
      let filterArgs = {}
      filterArgs.eventPerformer = event.event_performer
      filterArgs.shopId = event.shopId
      filterArgs.startTime = event.start_time
      filterArgs.endTime = event.end_time
      // let giftAmount = await getEventPerformerGiftTotal(filterArgs)
      event.giftReceivedAmount = 0
      return event.giftReceivedAmount
    }
  },
  shop: {
    type: EventShop,
    resolve: async event => {
      return await ShopModel.findOne({ _id: event.shopId })
    }
  }
})

export { EventTC }
