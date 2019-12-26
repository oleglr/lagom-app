import React from 'react'
import { Heading } from '@chakra-ui/core'
import { ChatFeed } from './feed'
import { ChatInput } from './input'

export const Chat = () => {
  const [has_box_open, setHasBoxOpen] = React.useState(false)

  return (
    <>
      <Heading size="lg">Best friends</Heading>
      <ChatFeed has_box_open={has_box_open} setHasBoxOpen={setHasBoxOpen} />
      <ChatInput has_box_open={has_box_open} setHasBoxOpen={setHasBoxOpen} />
    </>
  )
}
