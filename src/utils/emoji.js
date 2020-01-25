import React from 'react'
import Guinness from '../assets/images/g_emoticon.png'
import LagomRobot from '../assets/images/lagom_robot_emoticon.png'

export const customEmojis = [
    {
        name: 'Gdog',
        short_names: ['gdog'],
        text: '',
        emoticons: [],
        keywords: ['guinness'],
        imageUrl: Guinness,
    },
    {
        name: 'Lagom Robot',
        short_names: ['lagom_robot'],
        text: '',
        emoticons: [],
        keywords: ['lagom', 'robot'],
        imageUrl: LagomRobot,
    },
]

const emoji_map = {
    'custom_:gdog:': Guinness,
    'custom_:lagom_robot:': LagomRobot,
}

const getCustomEmojiLink = emoji => {
    return emoji_map[emoji]
}

export const showEmoji = emoji => {
    if (/custom_/.test(emoji)) {
        const emojilink = getCustomEmojiLink(emoji)

        return <img src={emojilink} alt={emoji} height="23px" width="23px" style={{ padding: '2px' }} />
    }
    return emoji
}
