import React from 'react'
import { VirtualizedList } from './virtualized-list'
import { getSocket as socket } from '../../../api/socket'
import { CellMeasurerCache } from 'react-virtualized'

const cache_thread = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 60,
})

export class ThreadFeed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            thread_data: null,
            status: 'loading',
            socket: socket(),
        }
    }

    onThread = res => {
        // handle error
        console.log('onThread: ', res)
        let thread_data = []
        if (res && res.messages) thread_data = res.messages

        this.setState({ status: 'done', thread_data })
    }

    componentDidMount() {
        // fetch thread data
        // add listener to when getting thread data
        this.state.socket.on('get thread', this.onThread)
        this.state.socket.emit(
            'get thread',
            {
                thread_id: this.props.message_id,
                group_id: '5df5c5b8aec1710635f037c4',
            },
            e => {
                console.log('e: ', e)
            }
        )
        console.log('did mount')
    }

    render() {
        if (this.state.status === 'loading') return <div>loading...</div>
        return <ThreadFeedSocket message_history={this.state.thread_data} />
    }
}

class ThreadFeedSocket extends React.Component {
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
        const messages = [...msg.messages]
        this.setState({ messages }, () => {
            this.list_ref.current.scrollToRow(messages.length)
        })
    }

    newReaction = msg => {
        const msg_idx = this.state.messages.findIndex(m => m._id === msg._id)
        cache_thread.clear(msg_idx)

        const new_data = [...this.state.messages]
        new_data[msg_idx] = msg

        this.setState({ messages: new_data, sortBy: this.state.sortBy + 1 })
    }

    componentDidMount() {
        this.state.socket.on('thread message', this.newMessage)
        this.state.socket.on('added thread reaction', this.newReaction)
        cache_thread.clearAll()
        this.setState({ t: 'now' })
    }

    componentWillUnmount() {
        this.state.socket.off('thread message', this.newMessage)
        this.state.socket.off('added thread reaction', this.newReaction)
    }

    render() {
        return (
            <VirtualizedList
                t={this.state.t}
                sortBy={this.state.sortBy}
                items={this.state.messages}
                cache={cache_thread}
                list_ref={this.list_ref}
                is_thread={true}
            />
        )
    }
}
