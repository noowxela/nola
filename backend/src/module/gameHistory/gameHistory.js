import {mongoose} from '../../mongoose.js';

const { Schema } = mongoose

const gameHistorySchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    game_type: {
      type: String,
      required: true
    },
    pusher_channel_name: {
      type: String,
      required: true
    },
    QR_base64: {
      type: String
    },
    playerId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    winnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rankingIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    archive: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

const GameHistory = mongoose.model('GameHistory', gameHistorySchema)
export { GameHistory }