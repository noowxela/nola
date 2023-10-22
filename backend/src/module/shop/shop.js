import {mongoose} from '../../mongoose.js';

const { Schema } = mongoose

const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    image_url: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      enum: ['rest', 'event', 'game'],
      default: 'rest'
    },
    game_type: {
      type: String
    },
    pusher_channel_name: {
      type: String,
      required: true
    },
    pusher_chat_channel_name: {
      type: String,
      required: true
    },
    rest_banner: {
      type: String
    },
    location: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String
    },
    state: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    postcode: {
      type: Number,
      required: true
    },
    phone_number: {
      type: String,
      required: true
    },
    revenue: {
      type: Number,
      default: 0.0
    },
    coins: { type: Number, default: 0.0 },
    punishment: [
      {
        type: Number,
        default: 0
      }
    ],
    rest_image_url: { type: String, default: '' },
    event_image_url: { type: String, default: '' },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      default: null
    },
    pusherConfig: {
      app_id: { type: String, default: null },
      app_key: { type: String, default: null },
      app_secret: { type: String, default: null },
      app_cluster: { type: String, default: null }
    },
    coordination: {
      longitude: { type: String, default: null },
      latitude: { type: String, default: null }
    },
    current_event: { type: String, default: null },
    next_event_id: { type: String, default: null },
    next_event_mode: { type: String, default: null },
    next_event_game_type: { type: String, default: null },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    archive: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const Shop = mongoose.model('Shop', shopSchema)
export { Shop }
