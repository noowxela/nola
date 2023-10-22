import mongoose from 'mongoose';
import moment from 'mongoose';
import { ShopCustomer as ShopCustomerModel } from './shopCustomer.js';

const getShopCustomerByUserId = async userId => {
  return await ShopCustomerModel.findOne({
    userId: userId,
    createdAt: { $gte: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    isCheckedOut: false
  }).sort('-createdAt')
}

const getRecentShopCustomer = async (shopIdArgs, username) => {
  const shopId = mongoose.Types.ObjectId(`${shopIdArgs}`)
  let d = new Date(Date.now() - 12 * 60 * 60 * 1000)
  // d.setDate(d.getDate() - 1)
  const recentShopCustomer = await ShopCustomerModel.aggregate([
    {
      $match: {
        createdAt: { $gte: d }
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$userId',
        createdAt: { $first: '$createdAt' },
        shopId: { $first: '$shopId' }
      }
    },
    {
      $match: {
        shopId: shopId
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$user'
      }
    },
    {
      $project: {
        _id: 1,
        total: 1,
        'user._id': 1,
        'user.username': 1
      }
    },
    {
      $match: {
        'user.username': { $regex: username, $options: 'i' }
      }
    }
  ])
  return recentShopCustomer
}

const getShopCustomerList = async (shopIdArgs, username, startDate, endDate) => {
  const shopId = mongoose.Types.ObjectId(`${shopIdArgs}`)
  const getMatchProps = async (startDate, endDate) => {
    if (!startDate && endDate) {
      return {
        createdAt: { $lte: endDate },
        shopId: shopId
      }
    }
    if (startDate && !endDate) {
      return {
        createdAt: { $gte: startDate },
        shopId: shopId
      }
    }
    if (startDate && endDate) {
      return {
        $and: [{ createdAt: { $gte: startDate } }, { createdAt: { $lte: endDate } }],
        shopId: shopId
      }
    }
    return {
      shopId: shopId
    }
  }

  // let d = new Date()
  const matchProps = await getMatchProps(startDate, endDate)

  const recentShopCustomer = await ShopCustomerModel.aggregate([
    {
      $match: matchProps
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $group: {
        _id: '$userId',
        createdAt: { $first: '$createdAt' }
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$user'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $match: {
        'user.username': { $regex: username, $options: 'i' }
      }
    }
  ])
  return recentShopCustomer
}

const getTodayCustomerNumber = async shopIdArgs => {
  const today = moment().startOf('day').add(4, 'h').toDate()
  const tomorrow = moment().add(1, 'days').startOf('day').add(4, 'h').toDate()
  const getMatchProps = async shopId => {
    if (!shopId) {
      return {
        $match: {
          createdAt: { $gte: today, $lte: tomorrow }
        }
      }
    }
    if (shopId) {
      const shopId = mongoose.Types.ObjectId(`${shopIdArgs}`)
      return {
        $match: {
          createdAt: { $gte: today, $lte: tomorrow },
          shopId: shopId
        }
      }
    }
  }
  const matchProps = await getMatchProps(shopIdArgs)
  const recentShopCustomer = await ShopCustomerModel.aggregate([
    // {
    //   $match: {
    //     createdAt: { $gte: today, $lte: tomorrow }
    //   }
    // },
    matchProps,
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$userId',
        createdAt: { $first: '$createdAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$user'
      }
    },
    {
      $project: {
        _id: 1,
        total: 1,
        'user._id': 1,
        'user.username': 1
      }
    }
  ])
  return recentShopCustomer.length
}

const getTotalCustomerNumber = async shopIdArgs => {
  const tomorrow = moment().add(1, 'days').startOf('day').add(4, 'h').toDate()

  const getMatchProps = async shopId => {
    if (!shopId) {
      return {
        $match: {
          createdAt: { $lte: tomorrow }
        }
      }
    }
    if (shopId) {
      const shopId = mongoose.Types.ObjectId(`${shopIdArgs}`)
      return {
        $match: {
          createdAt: { $lte: tomorrow },
          shopId: shopId
        }
      }
    }
  }
  const matchProps = await getMatchProps(shopIdArgs)

  const recentShopCustomer = await ShopCustomerModel.aggregate([
    matchProps,
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$userId',
        createdAt: { $first: '$createdAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$user'
      }
    },
    {
      $project: {
        _id: 1,
        total: 1,
        'user._id': 1,
        'user.username': 1
      }
    }
  ])
  return recentShopCustomer.length
}

const getDashboardCustomerStatus = async shopIdArgs => {
  const getMatchProps = async shopId => {
    if (!shopId) {
      return {
        $match: {
          archive: null
        }
      }
    }
    if (shopId) {
      const shopId = mongoose.Types.ObjectId(`${shopIdArgs}`)
      return {
        $match: {
          archive: null,
          shopId: shopId
        }
      }
    }
  }
  const matchProps = await getMatchProps(shopIdArgs)

  const activeCustomerData = await ShopCustomerModel.aggregate([
    matchProps,
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          period: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt'
            }
          },
          userId: '$userId'
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id.userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$user'
      }
    },
    {
      $project: {
        period: '$_id.period',
        userId: '$_id.userId',
        username: '$user.username',
        count: 1,
        _id: 0
      }
    },
    {
      $group: {
        _id: {
          period: '$period',
          type: 'activeCustomer'
        },
        total: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        period: '$_id.period',
        type: '$_id.type',
        total: 1,
        _id: 0
      }
    },
    { $sort: { period: 1 } }
  ])

  const getFirstLastMonth = async activeCustomerDataArray => {
    if (activeCustomerDataArray.length > 0) {
      const firstMonth = moment(activeCustomerDataArray[0].period)
      const currentEndMonth = moment(activeCustomerDataArray[0].period)
      const lastMonth = moment(activeCustomerDataArray[activeCustomerDataArray.length - 1].period)
      const monthDiff = lastMonth.diff(firstMonth, 'months')

      return {
        firstMonth,
        currentEndMonth,
        lastMonth,
        monthDiff
      }
    }
  }
  const firstLastMonth = await getFirstLastMonth(activeCustomerData)
  let inactiveCustomerData = []
  for (let i = 0; i <= firstLastMonth.monthDiff; i++) {
    const getCustomerMatchProps = async shopIdArgs => {
      const startDate = firstLastMonth.firstMonth.toDate()
      const endDate = firstLastMonth.currentEndMonth
        .add(i === 0 ? 0 : 1, 'M')
        .endOf('month')
        .toDate()
      if (!shopIdArgs) {
        return {
          $match: {
            $and: [{ createdAt: { $gte: startDate } }, { createdAt: { $lte: endDate } }]
          }
        }
      }
      if (shopIdArgs) {
        const shopId = mongoose.Types.ObjectId(`${shopIdArgs}`)
        return {
          $match: {
            $and: [{ createdAt: { $gte: startDate } }, { createdAt: { $lte: endDate } }],
            shopId: shopId
          }
        }
      }
    }
    const customerMatchProps = await getCustomerMatchProps(shopIdArgs)
    const shopCustomerByMonth = await ShopCustomerModel.aggregate([
      customerMatchProps,
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: '$userId',
          createdAt: { $first: '$createdAt' }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user'
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ])
    const formattedInactiveCustomer = {
      total: shopCustomerByMonth.length - activeCustomerData[i].total,
      period: firstLastMonth.currentEndMonth.format('YYYY-MM'),
      type: 'inactiveCustomer'
    }
    inactiveCustomerData.push(formattedInactiveCustomer)
  }

  const newCustomerData = await ShopCustomerModel.aggregate([
    matchProps,
    {
      $group: {
        _id: '$userId',
        createdAt: {
          $first: '$createdAt'
        }
      }
    },
    {
      $sort: {
        createdAt: 1
      }
    },
    {
      $group: {
        _id: {
          period: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt'
            }
          },
          userId: '$userId',
          type: 'newCustomer'
        },
        total: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        period: '$_id.period',
        type: '$_id.type',
        total: 1,
        _id: 0
      }
    },
    {
      $sort: {
        period: 1
      }
    }
  ])

  const customerDashboardData = [...newCustomerData, ...inactiveCustomerData, ...activeCustomerData]
  // const abc = []
  // newCustomerData.map(e => {
  //   abc.push({
  //     type: 'activeCustomer',
  //     period: e.period,
  //     total: e.activeCustomer
  //   })
  // })

  return customerDashboardData
}

export {
  getShopCustomerByUserId,
  getRecentShopCustomer,
  getShopCustomerList,
  getTodayCustomerNumber,
  getTotalCustomerNumber,
  getDashboardCustomerStatus
}
