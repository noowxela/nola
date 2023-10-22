import { User as UserModel } from './user.js';
import { ShopCustomer as ShopCustomerModel } from '../shopCustomer/shopCustomer.js';

const getUserById = async id => {
  return UserModel.findById(id)
}

const checkUserStatus = async user => {
  if (user.archive) {
    return 'deactivated'
  }
  const diffTime = Math.abs(new Date() - user.createdAt)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  if (diffDays <= 7) {
    return 'new'
  }
  const shopCustomer = await ShopCustomerModel.findOne({
    userId: user._id,
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    archive: null
  }).sort('-createdAt')

  if (!shopCustomer) {
    return 'inactive'
  }

  return 'active'
}


export {
  getUserById,
  checkUserStatus,
}
