import React from 'react'
import { Heading } from '@chakra-ui/core'
import { ChatFeed } from './feed'
import { ChatInput } from './input'
import { ChatContextProvider } from './chat-context'

export const Chat = () => {
  return (
    <>
      <Heading size="lg">Best friends</Heading>
      <ChatContextProvider>
        <ChatFeed />
        <ChatInput />
      </ChatContextProvider>
    </>
  )
}
