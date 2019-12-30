import React from 'react'
import { VirtualizedList } from './virtualized-list'
import { useFetch } from '../../../components/hooks/fetch-data'
import { getSocket as socket } from '../../../api/socket'
import { CellMeasurerCache } from 'react-virtualized'

const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 60,
})

function getAllQuotes(messages) {
    messages.forEach(msg => {
        if (msg.action === 'quote') {
            socket().emit(
                'get message',
                {
                    message_id: msg.ref,
                    group_id: '5df5c5b8aec1710635f037c4',
                },
                e => {
                    console.log('e: ', e)
                }
            )
        }
    })
}

export const ChatFeed = () => {
    const [data, loading] = useFetch(
        'http://localhost:3000/chat-history?groupId=5df5c5b8aec1710635f037c4'
    )

    if (loading) return <div>loading...</div>

    getAllQuotes(data.chat)

    return <ChatFeedSocket message_history={data.chat} />
}

const ChatFeedSocket = ({ message_history }) => {
    const [messages, setMessage] = React.useState([
        ...message_history.reverse(),
    ])
    // Dirty hack to scroll to bottom of list at beginning
    const [t, setT] = React.useState()
    const list_ref = React.useRef()

    React.useEffect(() => {
        list_ref.current.scrollToRow(messages.length)
        if (t !== 'now') setT('now')
    }, [messages, t])

    socket().on('message', function(msg) {
        setMessage([...messages, msg])
    })

    socket().on('added reaction', function(msg) {
        // TODO: handle error
        const found_idx = messages.findIndex(x => x._id === msg._id)
        const new_data = messages
        new_data[found_idx] = msg
        setMessage([...new_data])
        cache.clear(found_idx)
    })

    socket().on('get message', function(msg) {
        const found_idx = messages.findIndex(x => x.ref === msg._id)
        const new_data = messages
        new_data[found_idx].quote_text = msg.message
        new_data[found_idx].quote_user = msg.user
        new_data[found_idx].quote_created = msg.createdAt
        new_data[found_idx].quote_action = msg.action

        setMessage([...new_data])
        cache.clear(found_idx)
    })

    return (
        <section style={{ height: '100%' }}>
            <VirtualizedList
                t={t}
                items={messages}
                cache={cache}
                list_ref={list_ref}
            />
        </section>
    )
}
