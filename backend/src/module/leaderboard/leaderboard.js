import {mongoose} from '../../mongoose.js';

const { Schema } = mongoose

const leaderboardSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['male', 'female', 'rich']
    },
    start_date: {
      type: Date
    },
    end_date: {
      type: Date
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      default: null
    },
    userId: [
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

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema)
export { Leaderboard }