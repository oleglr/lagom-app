import React from 'react'
import { Heading } from '@chakra-ui/core'
import { ChatFeed } from './feed'
import { SendMessage } from './send-message'
import { ChatContextProvider } from './chat-context'
// TODO: enable thread
// import { ThreadDrawer } from './thread'

export const Chat = () => {
    return (
        <>
            {/* <Heading size="lg">Best friends</Heading> */}
            <ChatContextProvider>
                <ChatFeed />
                <SendMessage />
                {/* <ThreadDrawer /> */}
            </ChatContextProvider>
        </>
    )
}
