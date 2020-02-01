import React from 'react'
import { ChatFeed } from './feed'
import { SendMessage } from './send-message'
import { ChatContextProvider } from './chat-context'

// TODO: enable thread
// import { ThreadDrawer } from './thread'

export const Chat = () => {
    return (
        <>
            <ChatContextProvider>
                <ChatFeed />
                <SendMessage />
                {/* <ThreadDrawer /> */}
            </ChatContextProvider>
        </>
    )
}
