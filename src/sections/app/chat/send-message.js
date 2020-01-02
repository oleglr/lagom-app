import React from 'react'
import { ChatInput } from './input'
import { getSocket as socket } from '../../../api/socket'
import { useAuth0 } from '../../../react-auth0-spa'
import { ChatContext } from './chat-context'

export const SendMessage = () => {
    const { user } = useAuth0()
    const { setQuotedMessage } = React.useContext(ChatContext)

    const onSend = ({ message, action, ref }) => {
        socket().emit(
            'message',
            {
                message,
                action,
                ref,
                group_id: '5df5c5b8aec1710635f037c4',
                user: user.name,
            },
            e => {
                console.log('e: ', e)
            }
        )
        setQuotedMessage('')
    }
    return <ChatInput onSend={onSend} />
}
