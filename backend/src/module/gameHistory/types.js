import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';

import { GameHistory as GameHistoryModel } from './gameHistory.js';
import { User as UserModel } from '../auth/user.js';

const GameHistoryTC = composeWithMongoose(GameHistoryModel)
const GameUserModel = composeWithMongoose(UserModel, { name: 'GameRankings' }).removeField([
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
])

GameHistoryTC.addFields({
  rankings: {
    type: [GameUserModel],
    resolve: async gameHistory => {
      return await UserModel.find({ _id: gameHistory.rankingIds })
    }
  },
  winner: {
    type: GameUserModel,
    resolve: async gameHistory => {
      return await UserModel.findOne({ _id: gameHistory.winnerId })
    }
  }
})

export { GameHistoryTC }
