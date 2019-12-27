import React from 'react'
import { VirtualizedList } from './virtualized-list'
import { useFetch } from '../../../components/hooks/fetch-data'

export const ChatFeed = () => {
  const [data, loading] = useFetch(
    'http://localhost:3000/chat-history?groupId=5df5c5b8aec1710635f037c4'
  )

  if (loading) return <div>loading...</div>

  return (
    <section style={{ marginTop: 'auto', height: '100%' }}>
      <VirtualizedList items={data.chat} />
    </section>
  )
}
