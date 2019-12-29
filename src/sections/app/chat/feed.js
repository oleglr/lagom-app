import React from 'react'
import { VirtualizedList } from './virtualized-list'
import { useFetch } from '../../../components/hooks/fetch-data'
import { getSocket as socket } from '../../../api/socket'
import { CellMeasurerCache } from 'react-virtualized'

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 60,
})
export const ChatFeed = () => {
  const [data, loading] = useFetch(
    'http://localhost:3000/chat-history?groupId=5df5c5b8aec1710635f037c4'
  )

  if (loading) return <div>loading...</div>

  return <ChatFeedSocket message_history={data.chat} />
}

const ChatFeedSocket = ({ message_history }) => {
  const [messages, setMessage] = React.useState([...message_history.reverse()])
  const [last_item_idx, setLastItemIdx] = React.useState(messages.length)

  socket().on('message', function(msg) {
    // TODO: handle error
    setMessage([...messages, msg])
    setLastItemIdx(messages.length + 2)
  })

  socket().on('added reaction', function(msg) {
    // TODO: handle error
    const found_idx = messages.findIndex(x => x._id === msg._id)
    const new_data = messages
    new_data[found_idx] = msg
    setMessage([...new_data])
    cache.clear(found_idx)
  })

  return (
    <section style={{ marginTop: 'auto', height: '100%' }}>
      <VirtualizedList
        items={messages}
        scrollTo={last_item_idx}
        cache={cache}
      />
    </section>
  )
}
