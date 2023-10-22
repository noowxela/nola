import moment from 'moment';

import { Event as EventModel } from './event.js';
import { User as UserModel } from '../auth/user.js';

// const { sendChat } = require('@app/module/event/event.service.js')
// const { eventImageUploader } = require('../../uploaders')

const eventDetail = {
  name: 'eventDetail',
  type: 'Event!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const event = await EventModel.findOne({ ...args, archive: null }, {})
      if (!event) {
        return Promise.reject(new Error('Event does not exist'))
      }

      return event
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const listAllEvents = {
  name: 'listAllEvents',
  type: '[Event]!',
  args: {
    _id: 'String',
    shopId: 'String'
  },
  resolve: async ({ args }) => {
    try {
      if (!args.shopId) {
        const event = await EventModel.find({ archive: null }, {})
          .populate('shop_id')
          .sort('-createdAt')
        if (!event) {
          return Promise.reject(new Error('Event is currently empty'))
        }

        return event
      }

      const event = await EventModel.find({ ...args, archive: null }, {})
        .populate('shop_id')
        .sort('-createdAt')
      if (!event) {
        return Promise.reject(new Error('Event is currently empty'))
      }

      return event
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const listTodaysPerformers = {
  name: 'listTodaysPerformers',
  type: '[User]!',
  args: {
    _id: 'String',
    shopId: 'String'
  },
  resolve: async ({ args }) => {
    try {
      const combineList = arr => {
        var flat = []
        for (var i = 0; i < arr.length; i++) {
          flat = flat.concat(arr[i])
        }
        return flat
      }

      if (!args.shopId) {
        const today = moment()
        console.log('no shop id', today)
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
        }).populate('shop_id')
        if (!event) {
          return Promise.reject(new Error('Event is currently empty'))
        }

        event.map(e => {
          console.log('ename', e.event_description)
          // console.log('estart', e.start_time)
          // console.log('eend', e.end_time)
        })
        let eventPerformer = await Promise.all(event.map(async e => e.event_performer))

        const eventPerformerIdList = combineList(eventPerformer)
        // console.log(eventPerformerIdList)
        const user = await UserModel.find({ _id: { $in: eventPerformerIdList }, archive: null })
        if (!user) {
          return Promise.reject(new Error('User list is currently empty'))
        }
        return user
      }

      const today = moment()
      console.log('with shop id', today)
      const event = await EventModel.find({
        ...args,
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
      event.map(e => {
        console.log('ename', e.event_description)
        // console.log('estart', e.start_time)
        // console.log('eend', e.end_time)
      })
      let eventPerformer = await Promise.all(event.map(async e => e.event_performer))

      const eventPerformerIdList = combineList(eventPerformer)

      const user = await UserModel.find({ _id: { $in: eventPerformerIdList }, archive: null })
      if (!user) {
        return Promise.reject(new Error('User list is currently empty'))
      }
      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const createEvent = {
  name: 'createEvent',
  type: 'Event!',
  args: {
    image_url: 'String',
    event_description: 'String!',
    start_time: 'Date!',
    end_time: 'Date!',
    shopId: 'String!',
    event_performer: '[String]!'
    // eventImage: 'Upload!'
  },
  resolve: async ({ args }) => {
    try {
      // const event = await new EventModel(args).save()
      // const { createReadStream, filename, mimetype } = await args.eventImage
      // const uri = await eventImageUploader.upload(createReadStream(), {
      //   filename,
      //   mimetype
      // })
      delete args.eventImage
      const event = await new EventModel(args)
      // event.image_url = uri
      event.image_url = "abc123"
      event.pusher_chat_channel_name = `event${args.event_description}`
      event.pusher_chat_event_name = 'chatroom'
      // xyg
      if (args.shopId.toString() === '620cdb750d51ac5054f45272') {
        event.video_thumbnail =
          'https://jcb-storage.s3.ap-southeast-1.amazonaws.com/StageImages/all-in-one-video.mp4'
      }
      // zlx
      if (args.shopId.toString() === '6254f6952032aeda1492d607') {
        event.video_thumbnail =
          'https://jcb-storage.s3.ap-southeast-1.amazonaws.com/StageImages/zlx+video-new.mp4'
      }
      await event.save()
      event.pusher_chat_channel_name = `event-${event._id}`
      await event.save()
      return event
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const updateEvent = {
  name: 'updateEvent',
  type: 'Event!',
  args: {
    _id: 'String!',
    image_url: 'String',
    event_description: 'String',
    start_time: 'Date',
    end_time: 'Date',
    shopId: 'String',
    event_performer: '[String]',
    // eventImage: 'Upload'
  },
  resolve: async ({ args }) => {
    try {
      if (args.eventImage) {
        console.log('uploaded EventImage')
        const { createReadStream, filename, mimetype } = await args.eventImage
        // const uri = await eventImageUploader.upload(createReadStream(), {
        //   filename,
        //   mimetype
        // })
        // delete args.eventImage
        // const event = await new EventModel(args)
        // event.image_url = uri
        // await event.save()
        return event
      }
      const event = await EventModel.findById(args._id)
      if (!event) {
        return Promise.reject(new Error('Event is not found'))
      }
      Object.assign(event, args)
      await event.save()
      return event
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const archiveEvent = {
  name: 'archiveEvent',
  type: 'Succeed!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const event = await EventModel.findById(args._id)
      if (!event) {
        return Promise.reject(new Error('Event is not found'))
      }
      event.archive = Date.now()
      await event.save()
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const eventSendChat = {
  name: 'eventSendChat',
  type: 'Succeed!',
  args: {
    _id: 'String!',
    message: 'String!'
  },
  resolve: async ({ args, context: { user } }) => {
    try {
      if (!user) {
        return Promise.reject(new Error('You are not logged in'))
      }
      const event = await EventModel.findOne({ _id: args._id, archive: null })
      if (!event) {
        return Promise.reject(new Error('Event does not exist'))
      }
      // await sendChat(user, event, args.message)
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const resolvers = {
  eventDetail,
  listAllEvents,
  listTodaysPerformers,
  createEvent,
  updateEvent,
  archiveEvent,
  eventSendChat
}