import { gql } from "@apollo/client";

export const DASHBOARDLOGINMUTATION = gql`
  mutation SignInAdmin($username: String!, $password: String!) {
    signInAdmin(username: $username, password: $password) {
      accessToken
    }
  }
`;

export const GetLeaderboardRankings = gql`
  mutation GetLeaderboardRankings(
    $shopId: String!
    $type: EnumLeaderboardType!
    $period: EnumLeaderboardPeriod!
  ) {
    getLeaderboardRankings(shopId: $shopId, type: $type, period: $period) {
      rankingDetail {
        user {
          _id
          username
        }
        total
      }
    }
  }
`;

export const EditShop = gql`
  mutation updateShop(
    $_id: String!
    $mode: String!
    $image_url: String
    $game_type: String!
  ) {
    updateShop(
      _id: $_id
      mode: $mode
      location: $image_url
      game_type: $game_type
    ) {
      name
      location
      phone_number
      revenue
      createdAt
      mode
      game_type
    }
  }
`;

export const createShop = gql`
  mutation createShop(
    $name: String!
    $location: String!
    $phone_number: String!
    $addressLine1: String!
    $state: String!
    $postcode: Int!
    $district: String!
  ) {
    createShop(name: $name, location: $location, phone_number: $phone_number, addressLine1: $addressLine1, postcode: $postcode, state: $state, district: $district) {
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

export const ArchiveShop = gql`
  mutation archiveShop($_id: String!) {
    archiveShop(_id: $_id) {
      succeed
    }
  }
`;

export const ArchiveUser = gql`
  mutation ArchiveUser($id: String!) {
    archiveUser(_id: $id) {
      succeed
    }
  }
`;

export const ARCHIVEEVENTMUTATION = gql`
  mutation ArchiveEvent($id: String!) {
    archiveEvent(_id: $id) {
      succeed
    }
  }
`;

export const REDEEMFIRSTTIMEGIFTMUTATION = gql`
  mutation UpdateUserByAdmin($id: String!, $isWelcomeGiftRedeemed: Boolean) {
    updateUserByAdmin(_id: $id, isWelcomeGiftRedeemed: $isWelcomeGiftRedeemed) {
      isWelcomeGiftRedeemed
    }
  }
`;

export const CHANGEUSERTIERMUTATION = gql`
  mutation UpdateUserByAdmin(
    $id: String!
    $tier: String
    $spendingTier: String
    $freezeTier: Boolean
    $role: String
    $gallery: [String]
    $avatarUrl: String
  ) {
    updateUserByAdmin(
      _id: $id
      tier: $tier
      spending_tier: $spendingTier
      freeze_tier: $freezeTier
      role: $role
      gallery: $gallery
      avatar_url: $avatarUrl
    ) {
      _id
      phone_number
      avatar_url
      gender
      wallet
      role
      tier
      freeze_tier
      spending_tier
      isWelcomeGiftRedeemed
      username
      date_of_birth
      updatedAt
      createdAt
      followers
      followings
    }
  }
`;

export const UpdateShopMode = gql`
  mutation UpdateShop(
    $_id: String!
    $eventImageUrl: String
    $eventId: String
    $mode: String
    $gameType: String
    $restBanner: String
    $restImageUrl: String
    $next_event_id: String
    $next_event_mode: String
    $next_event_game_type: String
  ) {
    updateShop(
      _id: $_id
      event_image_url: $eventImageUrl
      mode: $mode
      game_type: $gameType
      rest_banner: $restBanner
      rest_image_url: $restImageUrl
      eventId: $eventId
      next_event_id: $next_event_id
      next_event_mode: $next_event_mode
      next_event_game_type: $next_event_game_type
    ) {
      _id
      name
      mode
      pusher_channel_name
      rest_image_url
      game_type
      event {
        event_description
      }
      eventId
      event_image_url
      next_event_id
      next_event_mode
      next_event_game_type
      next_event {
        event_description
      }
    }
  }
`;

export const TriggerShopMode = gql`
  mutation TriggerShopMode(
    $id: String!
    $mode: String
    $gameType: String
    $eventId: String
    $eventImageUrl: String
    $restImageUrl: String
    $nextEventId: String
    $nextEventMode: String
    $nextEventGameType: String
  ) {
    triggerShopMode(
      _id: $id
      mode: $mode
      game_type: $gameType
      eventId: $eventId
      event_image_url: $eventImageUrl
      rest_image_url: $restImageUrl
      next_event_id: $nextEventId
      next_event_mode: $nextEventMode
      next_event_game_type: $nextEventGameType
    ) {
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
    }
  }
`;

export const CreateGameSession = gql`
  mutation CreateGameHistory($shopId: String!, $gameType: String!) {
    createGameHistory(shopId: $shopId, game_type: $gameType) {
      shopId
      game_type
      QR_base64
    }
  }
`;

export const CREATEEVENTMUTATION = gql`
  mutation CreateEvent(
    $eventDescription: String!
    $startTime: Date!
    $endTime: Date!
    $shopId: String!
    $eventPerformer: [String]!
    $eventImage: Upload!
  ) {
    createEvent(
      event_description: $eventDescription
      start_time: $startTime
      end_time: $endTime
      shopId: $shopId
      event_performer: $eventPerformer
      eventImage: $eventImage
    ) {
      image_url
      event_description
      start_time
      end_time
      shopId
      _id
      event_performer
      pusher_chat_channel_name
      pusher_chat_event_name
    }
  }
`;

export const UPDATEEVENTMUTATION = gql`
  mutation UpdateEvent(
    $id: String!
    $eventDescription: String
    $startTime: Date
    $endTime: Date
    $eventPerformer: [String]
    $imageUrl: String
    $eventImage: Upload
    $shopId: String
  ) {
    updateEvent(
      _id: $id
      event_description: $eventDescription
      start_time: $startTime
      end_time: $endTime
      event_performer: $eventPerformer
      image_url: $imageUrl
      eventImage: $eventImage
      shopId: $shopId
    ) {
      image_url
      event_description
      start_time
      end_time
      shopId
      _id
      event_performer
      pusher_chat_channel_name
      pusher_chat_event_name
    }
  }
`;

export const TRIGGERSTAGEEFFECTMUTATION = gql`
  mutation StageTriggerPurchaseEffect(
    $id: String!
    $userId: String!
    $type: String!
    $effectType: String!
  ) {
    stageTriggerPurchaseEffect(
      _id: $id
      userId: $userId
      type: $type
      effect_type: $effectType
    ) {
      succeed
    }
  }
`;

export const ADMINCREATETRANSACTION = gql`
  mutation AdminCreateTransaction(
    $userId: String!
    $shopId: String!
    $type: String!
    $amount: Int
    $packageId: String
  ) {
    adminCreateTransaction(
      userId: $userId
      shopId: $shopId
      type: $type
      amount: $amount
      packageId: $packageId
    ) {
      _id
      userId
      type
      coin_before
      coin_after
      coin_amount
      invoiceId
      description
      status
      shopId
    }
  }
`;
