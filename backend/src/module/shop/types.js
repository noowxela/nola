import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { Shop as ShopModel } from './shop.js';
import { Event as EventModel } from '../event/event.js';

const ShopTC = composeWithMongoose(ShopModel)
const ShopEvent = composeWithMongoose(EventModel, {
  name: 'ShopEvent'
})

const PusherConfig = ShopTC.getFieldTC('pusherConfig')

schemaComposer.createObjectTC({
  name: 'PusherConfig',
  fields: {
    app_id: 'String!',
    app_key: 'String!',
    app_secret: 'String!',
    app_cluster: 'String!'
  }
})

ShopTC.addFields({
  event: {
    type: [ShopEvent],
    resolve: async shop => {
      return await EventModel.find({ _id: shop.eventId })
    }
  },
  next_event: {
    type: [ShopEvent],
    resolve: async shop => {
      return await EventModel.find({ _id: shop.next_event_id })
    }
  }
})

export { ShopTC }

