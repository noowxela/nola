import { Leaderboard as LeaderboardModel } from './leaderboard.js';
// const {
//   getLeaderboardRankingFromTransaction
// } = require('@app/module/transaction/transaction.service.js')

const leaderboardDetail = {
  name: 'leaderboardDetail',
  type: 'Leaderboard!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const leaderboard = await LeaderboardModel.findOne({ ...args, archive: null }, {})
      if (!leaderboard) {
        return Promise.reject(new Error('Leaderboard is currently empty'))
      }
      return leaderboard
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const getLeaderboardRankings = {
  name: 'getLeaderboardRankings',
  type: 'Leaderboard!',
  args: {
    shopId: 'String',
    type: 'EnumLeaderboardType!',
    period: 'EnumLeaderboardPeriod!'
  },
  resolve: async ({ args }) => {
    try {
      const checkFilter = args => {
        if (!args.shopId) {
          return { shopId: null, type: args.type, period: args.period, archive: null }
        }
        return { ...args, archive: null }
      }
      const filter = checkFilter(args)
      const leaderboard = await LeaderboardModel.findOne(filter)
      if (!leaderboard) {
        return Promise.reject(new Error('Leaderboard is currently empty'))
      }
      // const transaction = await getLeaderboardRankingFromTransaction(args)
      // const rankings = transaction.map(ranking => {
      //   return ranking._id
      // })
      // leaderboard.userId = rankings
      // await leaderboard.save()
      // leaderboard.rankingDetail = transaction

      return leaderboard
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const listAllLeaderboard = {
  name: 'listAllLeaderboard',
  type: '[Leaderboard]!',
  args: {
    _id: 'String',
    shopId: 'String'
  },
  resolve: async ({ args }) => {
    try {
      const leaderboard = await LeaderboardModel.find({ ...args, archive: null }, {})
      if (!leaderboard) {
        return Promise.reject(new Error('Leaderboard is currently empty'))
      }
      return leaderboard
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const createLeaderboard = {
  name: 'createLeaderboard',
  type: 'Leaderboard!',
  args: {
    type: 'String!',
    start_date: 'Date!',
    end_date: 'Date!',
    period: 'String!',
    shopId: 'String'
  },
  resolve: async ({ args }) => {
    try {
      const leaderboard = await new LeaderboardModel(args).save()

      return leaderboard
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const updateLeaderboard = {
  name: 'updateLeaderboard',
  type: 'Leaderboard!',
  args: {
    _id: 'String!',
    type: 'String',
    start_date: 'Date',
    end_date: 'Date',
    period: 'String',
    shopId: 'String',
    userId: '[String]'
  },
  resolve: async ({ args }) => {
    try {
      const leaderboard = await LeaderboardModel.findById(args._id)
      if (!leaderboard) {
        return Promise.reject(new Error('Leaderboard is not found'))
      }
      Object.assign(leaderboard, args)
      await leaderboard.save()
      return leaderboard
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const archiveLeaderboard = {
  name: 'archiveLeaderboard',
  type: 'Succeed!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const leaderboard = await LeaderboardModel.findById(args._id)
      if (!leaderboard) {
        return Promise.reject(new Error('Leaderboard is not found'))
      }
      leaderboard.archive = Date.now()
      await leaderboard.save()
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const resolvers = {
  getLeaderboardRankings,
  leaderboardDetail,
  listAllLeaderboard,
  createLeaderboard,
  updateLeaderboard,
  archiveLeaderboard
}
