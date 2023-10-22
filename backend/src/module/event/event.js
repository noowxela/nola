import {mongoose} from '../../mongoose.js';

const { Schema } = mongoose

const eventSchema = new Schema(
  {
    image_url: {
      type: String
    },
    video_thumbnail: {
      type: String
    },
    event_description: {
      type: String
    },
    start_time: {
      type: Date
    },
    end_time: {
      type: Date
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    event_performer: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    pusher_chat_channel_name: {
      type: String,
      default: ''
    },
    pusher_chat_event_name: {
      type: String,
      default: ''
    },
    archive: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

const Event = mongoose.model('Event', eventSchema)
export { Event }
