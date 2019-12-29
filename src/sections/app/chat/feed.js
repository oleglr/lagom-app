import React from 'react'
import { VirtualizedList } from './virtualized-list'
import { useFetch } from '../../../components/hooks/fetch-data'
import { getSocket as socket } from '../../../api/socket'

export const ChatFeed = () => {
  const [data, loading] = useFetch(
    'http://localhost:3000/chat-history?groupId=5df5c5b8aec1710635f037c4'
  )

  if (loading) return <div>loading...</div>

  return <ChatFeedSocket message_history={data.chat} />
}

const ChatFeedSocket = ({ message_history }) => {
  const [data, setData] = React.useState([...message_history.reverse()])
  const [last_item_idx, setLastItemIdx] = React.useState(data.length)

  socket().on('message', function(msg) {
    // TODO: handle error
    setData([...data, msg])
    setLastItemIdx(data.length + 2)
  })

  console.log('data: ', last_item_idx)
  return (
    <section style={{ marginTop: 'auto', height: '100%' }}>
      <VirtualizedList items={data} scrollTo={last_item_idx} />
    </section>
  )
}
