import { schemaComposer } from 'graphql-compose';
import { authMiddleware as middleware } from '../middleware/index.js';
import { userValidator as validator } from '../validator/index.js';
import { 
  UserTC,
  ShopTC,
  GameHistoryTC,
  EventTC,
  LeaderboardTC,
  // ShopCustomerTC,
 } from '../module/index.js';
// const { schemaComposer } = require('graphql-compose')

// TODO need find a way to seperate import this into types file
import './types.js'

schemaComposer.Query.addFields({
  // User
  user: UserTC.getResolver('user', [middleware.isAuth]),
  listAllUser: UserTC.getResolver('listAllUser'),
  userDetail: UserTC.getResolver('userDetail'),
  // listShopCustomer: ShopCustomerTC.getResolver('listShopCustomer'),

  
  // Shop
  listAllShop: ShopTC.getResolver('listAllShop'),
  shopDetail: ShopTC.getResolver('shopDetail'),
  portalListShop: ShopTC.getResolver('portalListShop'),


  // Game History
  listAllGameHistory: GameHistoryTC.getResolver('listAllGameHistory'),
  
  // Event
  eventDetail: EventTC.getResolver('eventDetail'),
  listAllEvents: EventTC.getResolver('listAllEvents'),
  
  // // Package
  // listAllPackages: PackageTC.getResolver('listAllPackages'),

  // Dashboard
  getDashboardSummary: ShopTC.getResolver('getDashboardSummary'),
  getDashboardUpcomingEvents: ShopTC.getResolver('getDashboardUpcomingEvents'),
})

schemaComposer.Mutation.addFields({
  // User
  signInAdmin: UserTC.getResolver('signInAdmin', [middleware.isAdmin]),
  signIn: UserTC.getResolver('signIn', [middleware.isGuest, validator.signIn]),
  signUp: UserTC.getResolver('signUp', [middleware.isGuest, validator.signUp]),
  logout: UserTC.getResolver('logout', [middleware.isAuth]),
  verifyRequest: UserTC.getResolver('verifyRequest', [middleware.isAuth, middleware.isUnverfied]),
  verify: UserTC.getResolver('verify'),
  resetPassword: UserTC.getResolver('resetPassword', [middleware.isGuest, validator.resetPassword]),
  newPassword: UserTC.getResolver('newPassword', [middleware.isGuest, validator.newPassword]),
  changePassword: UserTC.getResolver('changePassword', [
    middleware.isAuth,
    validator.changePassword
  ]),
  updateUser: UserTC.getResolver('updateUser', [middleware.isAuth, validator.updateUser]),
  switchLocale: UserTC.getResolver('switchLocale', [middleware.isAuth]),
  updateUserByAdmin: UserTC.getResolver('updateUserByAdmin'),
  archiveUser: UserTC.getResolver('archiveUser'),
  
  // Shop
  createShop: ShopTC.getResolver('createShop'),
  updateShop: ShopTC.getResolver('updateShop'),
  archiveShop: ShopTC.getResolver('archiveShop'),
  triggerShopMode: ShopTC.getResolver('triggerShopMode'),
  stageTriggerPurchaseEffect: ShopTC.getResolver('stageTriggerPurchaseEffect'),

  // Leaderboard
  getLeaderboardRankings: LeaderboardTC.getResolver('getLeaderboardRankings'),
  
  // Event
  createEvent: EventTC.getResolver('createEvent'),
  updateEvent: EventTC.getResolver('updateEvent'),
  archiveEvent: EventTC.getResolver('archiveEvent'),
  
  // Game History
  createGameHistory: GameHistoryTC.getResolver('createGameHistory'),

  // Event
  createEvent: EventTC.getResolver('createEvent'),
  updateEvent: EventTC.getResolver('updateEvent'),

})

export const schema = schemaComposer.buildSchema();

