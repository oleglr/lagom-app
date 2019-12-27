import React from 'react'
import { Message } from './message'
import { InfiniteLoaderList } from './infinite-loader-list'

const items = [
  'Hey',
  'Yo',
  'Sup',
  'Eyyy',
  'Maan',
  'you',
  'me',
  'him',
  'all',
  'this',
  'is',
  'hello Oskar',
  'well hello Jared',
  'Sup gilfoyle',
  'son of anton',
]

const RowComponent = ({ data, num, style }) => {
  // use has_thread to change height here
  return (
    <div style={style}>
      <Message text={data} idx={num} />
    </div>
  )
}

export const ChatFeed = () => {
  return (
    <section style={{ marginTop: 'auto' }}>
      <InfiniteLoaderList items={items} RenderComponent={RowComponent} />
    </section>
  )
}
