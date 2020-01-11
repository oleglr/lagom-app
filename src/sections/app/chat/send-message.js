import React from 'react'
import { ChatInput } from './input'
import { useGlobal } from '../../../context/global-context'
import { getSocket as socket } from '../../../api/socket'
import { useAuth0 } from '../../../react-auth0-spa'
import { ChatContext } from './chat-context'

export const SendMessage = () => {
    const { user } = useAuth0()
    const { setQuotedMessage } = React.useContext(ChatContext)
    const { active_group } = useGlobal()

    const onSend = ({ message, action, ref }) => {
        socket().emit(
            'message',
            {
                message,
                action,
                ref,
                group_id: active_group.id,
                user: user.sub,
            },
            e => {
                console.log('e: ', e)
            }
        )
        setQuotedMessage('')
    }
    return <ChatInput onSend={onSend} />
}
