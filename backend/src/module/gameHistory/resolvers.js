import QRCode from 'qrcode';

import { GameHistory as GameHistoryModel } from './gameHistory.js';
import { Shop as ShopModel } from '../shop/shop.js';

const gameHistoryDetail = {
  name: 'gameHistoryDetail',
  type: 'GameHistory!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const gameHistory = await GameHistoryModel.findOne({ ...args, archive: null }, {})
      if (!gameHistory) {
        return Promise.reject(new Error('Game History is currently empty'))
      }
      return gameHistory
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const getQRCodeByShopId = {
  name: 'getQRCodeByShopId',
  type: 'GameHistory!',
  args: {
    shopId: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const gameHistory = await GameHistoryModel.findOne({ ...args, archive: null }).sort(
        '-createdAt'
      )
      if (!gameHistory) {
        return Promise.reject(new Error('Game is not found'))
      }
      console.log('gamehistory', gameHistory)
      return gameHistory
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const listAllGameHistory = {
  name: 'listAllGameHistory',
  type: '[GameHistory]!',
  args: {
    shopId: 'String',
    startDate: 'Date',
    endDate: 'Date'
  },
  resolve: async ({ args }) => {
    const checkFilter = args => {
      if (args.shopId) {
        return { shopId: args.shopId, archive: null }
      }
      if (!args.shopId) {
        return { archive: null }
      }
    }

    const getDateRangeFilter = async (startDate, endDate) => {
      if (!startDate && endDate) {
        return {
          createdAt: { $lte: endDate }
        }
      }
      if (startDate && !endDate) {
        return {
          createdAt: { $gte: startDate }
        }
      }
      if (startDate && endDate) {
        return {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      }
      return {}
    }
    const dateRangeFilter = await getDateRangeFilter(args.startDate, args.endDate)
    const filter = checkFilter(args)
    const fullFilter = { ...dateRangeFilter, ...filter }
    try {
      // const gameHistory = await GameHistoryModel.find({ ...args, archive: null }).sort('-createdAt')
      const gameHistory = await GameHistoryModel.find(fullFilter).sort('-createdAt')
      if (!gameHistory) {
        return Promise.reject(new Error('Game History is currently empty'))
      }
      return gameHistory
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const createGameHistory = {
  name: 'createGameHistory',
  type: 'GameHistory!',
  args: {
    shopId: 'String!',
    game_type: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const shop = await ShopModel.findById(args.shopId)
      args.pusher_channel_name = shop.pusher_channel_name
      const gameHistory = await new GameHistoryModel(args).save()
      // QRCode.toDataURL(
      //   `game.jcb.com/player/${gameHistory._id}`,
      //   {
      //     text: `game.jcb.com/player/${gameHistory._id}`,
      //     width: 500,
      //     height: 500
      //   },
      //   async (err, src) => {
      //     if (err) Promise.reject(err)
      //     gameHistory.QR_base64 = src
      //     await gameHistory.save()
      //   }
      // )
      const gameQRUrl = await new QRCode.toDataURL(
        `${process.env.STAGE_URL}/${shop._id}/${args.game_type}-player?gameId=${gameHistory._id}`,
        {
          text: `${process.env.STAGE_URL}/${shop._id}/${args.game_type}-player?gameId=${gameHistory._id}`,
          width: 500,
          height: 500
        }
      )
      gameHistory.QR_base64 = gameQRUrl
      await gameHistory.save()
      return gameHistory
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const updateGameHistory = {
  name: 'updateGameHistory',
  type: 'GameHistory!',
  args: {
    _id: 'String!',
    shopId: 'String',
    game_type: 'String',
    pusher_channel_name: 'String',
    QR_base64: 'String',
    playerId: ['String'],
    winnerId: 'String',
    rankingIds: ['String']
  },
  resolve: async ({ args }) => {
    try {
      const gameHistory = await GameHistoryModel.findById(args._id)
      if (!gameHistory) {
        return Promise.reject(new Error('Game History is not found'))
      }
      Object.assign(gameHistory, args)
      await gameHistory.save()
      return gameHistory
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const archiveGameHistory = {
  name: 'archiveGameHistory',
  type: 'Succeed!',
  args: {
    _id: 'String!'
  },
  resolve: async ({ args }) => {
    try {
      const gameHistory = await GameHistoryModel.findById(args._id)
      if (!gameHistory) {
        return Promise.reject(new Error('Game History is not found'))
      }
      gameHistory.archive = Date.now()
      await gameHistory.save()
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const resolvers = {
  gameHistoryDetail,
  getQRCodeByShopId,
  listAllGameHistory,
  createGameHistory,
  updateGameHistory,
  archiveGameHistory
}