import React from 'react'
import { Message } from './message'

export const ChatFeed = ({ setHasBoxOpen, has_box_open }) => {
  return (
    <section style={{ marginTop: 'auto' }}>
      <Message setHasBoxOpen={setHasBoxOpen} has_box_open={has_box_open} />
      <Message setHasBoxOpen={setHasBoxOpen} has_box_open={has_box_open} />
      <Message setHasBoxOpen={setHasBoxOpen} has_box_open={has_box_open} />
      <Message setHasBoxOpen={setHasBoxOpen} has_box_open={has_box_open} />
      <Message setHasBoxOpen={setHasBoxOpen} has_box_open={has_box_open} />
    </section>
  )
}
