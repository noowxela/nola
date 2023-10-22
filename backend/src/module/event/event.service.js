const Pusher = require('pusher')
const pusher = new Pusher({
  appId: '1348905',
  key: 'a8310060d9de1974943c',
  secret: 'a28e82dac29c4664bd52',
  cluster: 'ap1'
})

const sendChat = async (user, event, messageBody) => {
  pusher.trigger(event.pusher_chat_channel_name, event.pusher_chat_event_name, {
    type: 'chat',
    user_mongoId: user._id,
    username: user.username,
    avatar_url: user.avatar_url,
    msg: messageBody
  })
}

module.exports = { sendChat }
