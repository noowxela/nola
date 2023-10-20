import { gql } from "@apollo/client";

export const listAllUser = gql`
  query ListAllUser($isAdmin: Boolean, $filter: UsersFilterInput) {
    listAllUser(isAdmin: $isAdmin) {
      _id
      username
      phone_number
      gender
      date_of_birth
      createdAt
      averageSpending(filter: $filter)
      status
    }
  }
`;

export const LISTSHOPCUSTOMERQUERY = gql`
  query ListShopCustomer(
    $shopId: String!
    $username: String!
    $startDate: Date
    $endDate: Date
  ) {
    listShopCustomer(
      shopId: $shopId
      username: $username
      startDate: $startDate
      endDate: $endDate
    ) {
      createdAt
      user {
        _id
        username
        phone_number
        gender
        createdAt
        date_of_birth
        isWelcomeGiftRedeemed
        status
        averageSpending
      }
    }
  }
`;

export const userDetail = gql`
  query UserDetail($id: String!) {
    userDetail(_id: $id) {
      _id
      phone_number
      avatar_url
      gender
      wallet
      role
      tier
      spending_tier
      freeze_tier
      username
      date_of_birth
      updatedAt
      createdAt
      followers
      followings
      gifts
      gallery
      totalSpending
      spendingPerMonth {
        total_spending
        period
      }
    }
  }
`;
export const CURRENTUSER = gql`
  query User {
    user {
      _id
      role
      phone_number
      username
    }
  }
`;

export const listAllShop = gql`
  query listAllShop($_id: String, $isAdmin: Boolean) {
    listAllShop(_id: $_id, isAdmin: $isAdmin) {
      _id
      name
      image_url
      mode
      game_type
      rest_banner
      location
      phone_number
      revenue
      coins
      createdAt
    }
  }
`;

export const portalListShop = gql`
  query portalListShop {
    portalListShop {
      _id
      name
      image_url
      mode
      game_type
      rest_banner
      location
      phone_number
      revenue
      coins
      createdAt
    }
  }
`;

export const GETDASHBOARDSUMMARY = gql`
  query GetDashboardSummary($shopId: String) {
    getDashboardSummary(shopId: $shopId) {
      todayRevenue
      totalRevenue
      todayCustomer
      totalCustomer
    }
  }
`;

export const GETDASHBOARDUPCOMINGEVENTS = gql`
  query GetDashboardUpcomingEvents($shopId: String) {
    getDashboardUpcomingEvents(shopId: $shopId) {
      event_description
      start_time
      end_time
      giftReceivedAmount {
        user {
          username
        }
      }
      shop {
        name
      }
    }
  }
`;

export const GETDASHBOARDREVENUECHART = gql`
  query GetDashboardRevenueChart($shopId: String) {
    getDashboardRevenueChart(shopId: $shopId) {
      name
      period
      revenue
    }
  }
`;

export const GETDASHBOARDCUSTOMERCHART = gql`
  query GetDashboardCustomerChart($shopId: String) {
    getDashboardCustomerChart(shopId: $shopId) {
      period
      total
      type
    }
  }
`;

export const GETDASHBOARDSURVEYCHART = gql`
  query GetDashboardSurveyChart($type: String!, $shopId: String) {
    getDashboardSurveyChart(type: $type, shopId: $shopId) {
      type
      total
    }
  }
`;

/** GET_TRACK gql query to retrieve a specific track by its ID */
export const shopDetail = gql`
  query shopDetail($_id: String!) {
    shopDetail(_id: $_id) {
      _id
      name
      image_url
      mode
      game_type
      rest_banner
      location
      phone_number
      revenue
      createdAt
    }
  }
`;

export const listAllCommissions = gql`
  query ListAllCommissions($shopId: String) {
    listAllCommissions(shopId: $shopId) {
      _id
      invoiceId
      coin_amount
      transactionId
      createdAt
      source {
        senderName
        receiverName
        senderAmount
        receiverAmount
        shopAmount
        marketingAmount
        commissionRate {
          userRate
          shopRate
          marketingRate
        }
      }
    }
  }
`;

export const USERTRANSACTIONQUERY = gql`
  query ListAllTransaction($userId: String) {
    listAllTransaction(userId: $userId) {
      _id
      invoiceId
      customer {
        username
      }
      coin_amount
      description
      status
      type
      createdAt
    }
  }
`;

export const listAllGameHistory = gql`
  query ListAllGameHistory($shopId: String, $endDate: Date, $startDate: Date) {
    listAllGameHistory(
      shopId: $shopId
      endDate: $endDate
      startDate: $startDate
    ) {
      _id
      game_type
      playerId
      winnerId
      winner {
        username
      }
      createdAt
    }
  }
`;

export const listShopEvents = gql`
  query ListAllEvents($shopId: String) {
    listAllEvents(shopId: $shopId) {
      image_url
      event_description
      start_time
      end_time
      shopId
      event_performer
      _id
      giftReceivedAmount {
        _id
        total
        user {
          username
        }
      }
    }
  }
`;

export const EVENTDETAILQUERY = gql`
  query EventDetail($id: String!) {
    eventDetail(_id: $id) {
      image_url
      event_description
      start_time
      end_time
      shopId
      _id
      event_performer
    }
  }
`;

export const getShopDetail = gql`
  query ShopDetail($id: String!) {
    shopDetail(_id: $id) {
      _id
      name
      mode
      pusher_channel_name
      rest_image_url
      game_type
      eventId
      event_image_url
      next_event_id
      next_event_mode
      next_event_game_type
      event {
        event_description
      }
      next_event {
        event_description
      }
      coins
      revenue
    }
  }
`;

export const CREATETRANSACTIONSEARCHUSER = gql`
  query ListAllUser($username: String) {
    listAllUser(username: $username) {
      _id
      wallet
      username
    }
  }
`;

export const LISTALLPACKAGES = gql`
  query ListAllPackages {
    listAllPackages {
      _id
      name
      price
      coin
    }
  }
`;
