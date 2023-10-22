
import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';

import { Leaderboard as LeaderboardModel } from './leaderboard.js';
import { User as UserModel } from '../auth/user.js';

const LeaderboardTC = composeWithMongoose(LeaderboardModel)
const LeaderboardUserTC = composeWithMongoose(UserModel, { name: 'LeaderboardUser' }).removeField([
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
  'leaderboard_rich_record',
  'gallery',
  'createdAt'
])

const LeaderboardRankingDetailTC = schemaComposer.createObjectTC({
  name: 'LeaderboardRankingDetail',
  fields: {
    _id: 'String',
    total: 'Int',
    user: LeaderboardUserTC
  }
})

LeaderboardTC.addFields({
  // users: {
  //   type: [LeaderboardUserTC],
  //   resolve: async leaderboard => {
  //     return await UserModel.find({ _id: leaderboard.userId }).limit(10)
  //   }
  // },
  rankingDetail: {
    type: [LeaderboardRankingDetailTC]
  }
})

export { LeaderboardTC }
