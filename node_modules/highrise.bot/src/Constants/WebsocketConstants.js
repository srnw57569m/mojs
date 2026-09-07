const WebsocketEvents = [
    'SessionMetadata', 'ChatEvent', 'UserMovedEvent', 
    'UserJoinedEvent', 'UserLeftEvent','MessageEvent', 
    'TipReactionEvent', 'RoomModeratedEvent', 'ChannelEvent',
    'EmoteEvent', 'VoiceEvent', 'ReactionEvent'
]

const EventToListener = {
    Ready: 'SessionMetadata',
    Chat: 'ChatEvent',
    Whisper: 'ChatEvent',
    Movement: 'UserMovedEvent',
    UserJoined: 'UserJoinedEvent',
    UserLeft: 'UserLeftEvent',
    Direct: 'MessageEvent',
    Tip: 'TipReactionEvent',
    Moderation: 'RoomModeratedEvent',
    Channel: 'ChannelEvent',
    Emote: 'EmoteEvent'
}

module.exports = {
    WebsocketEvents,
    EventToListener
}