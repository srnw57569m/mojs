const BaseAwaiter = require('../Base/BaseAwaiter')

class ChatAwaiter extends BaseAwaiter {}
class DirectAwaiter extends BaseAwaiter {}
class TipAwaiter extends BaseAwaiter {}
class MovementAwaiter extends BaseAwaiter {}

module.exports = {
    ChatAwaiter,
    DirectAwaiter,
    TipAwaiter,
    MovementAwaiter
}