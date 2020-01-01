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

class ChatFeedSocket extends React.Component {
    constructor(props) {
        super(props)
        this.list_ref = React.createRef()
        this.state = {
            messages: props.message_history.reverse(),
            socket: socket(),
            sortBy: 0,
            t: '',
        }
    }

    newMessage = msg => {
        const messages = [...this.state.messages, msg]
        this.setState({ messages }, () => {
            this.list_ref.current.scrollToRow(messages.length)
        })
    }

    newReaction = msg => {
        const msg_idx = this.state.messages.findIndex(m => m._id === msg._id)
        cache.clear(msg_idx)

        const new_data = [...this.state.messages]
        new_data[msg_idx] = msg

        this.setState({ messages: new_data, sortBy: this.state.sortBy + 1 })
    }

    componentDidMount() {
        this.state.socket.on('message', this.newMessage)
        this.state.socket.on('added reaction', this.newReaction)
        this.setState({ t: 'now' })
    }

    render() {
        return (
            <section style={{ height: '100%' }}>
                <VirtualizedList
                    t={this.state.t}
                    sortBy={this.state.sortBy}
                    items={this.state.messages}
                    cache={cache}
                    list_ref={this.list_ref}
                />
            </section>
        )
    }
}
