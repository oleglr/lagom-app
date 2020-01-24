import React from 'react'
import { CellMeasurerCache } from 'react-virtualized'
import { VirtualizedList } from './virtualized-list'
import { getSocket as socket } from '../../../api/socket'
import { useGlobal } from '../../../context/global-context'
import { Loader } from '../../../components/elements'

const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 60,
})

export const ChatFeed = () => {
    const { active_group } = useGlobal()

    return <ChatFeedSocket group_id={active_group.id} />
}

export class ChatFeedSocket extends React.Component {
    constructor(props) {
        super(props)
        this.list_ref = React.createRef()
        this.state = {
            messages: [],
            sortBy: 0,
            is_next_page_loading: false,
            all_rows_loaded: false,
            is_inital_loading: true,
        }
    }

    newMessage = msg => {
        const messages = [...this.state.messages, msg]

        this.setState({ messages }, () => {
            this.list_ref.current.scrollToRow(messages.length - 1)
        })
    }

    newReaction = msg => {
        const msg_idx = this.state.messages.findIndex(m => m._id === msg._id)
        cache.clear(msg_idx)

        const new_data = [...this.state.messages]
        new_data[msg_idx] = msg
        this.setState({ messages: new_data, sortBy: this.state.sortBy + 1 })
    }

    removeReaction = msg => {
        const msg_idx = this.state.messages.findIndex(m => m._id === msg._id)
        cache.clear(msg_idx)

        const new_data = [...this.state.messages]
        new_data[msg_idx] = msg
        this.setState({ messages: new_data, sortBy: this.state.sortBy + 1 })
    }

    addChatHistory = messages => {
        const new_data = [...messages.chat, ...this.state.messages]

        this.setState({
            messages: new_data,
            is_next_page_loading: false,
            is_inital_loading: false,
            all_messages_loaded: messages.all_messages_loaded,
        })
    }

    loadMoreChatHistory = () => {
        console.log('load more')
        if (this.state.all_messages_loaded) return

        this.setState({ is_next_page_loading: true })

        socket().emit(
            'get_chat_history',
            {
                message_id: this.state.messages[0]._id,
                group_id: this.props.group_id,
            },
            e => {
                console.log('e: ', e)
            }
        )
    }

    componentWillUnmount() {
        socket().off('message', this.newMessage)
        socket().off('added reaction', this.newReaction)
        socket().off('removed reaction', this.removeReaction)
        socket().off('get_chat_history', this.addChatHistory)
    }

    componentDidMount() {
        socket().on('message', this.newMessage)
        socket().on('added reaction', this.newReaction)
        socket().on('removed reaction', this.removeReaction)
        socket().on('get_chat_history', this.addChatHistory)

        socket().emit(
            'get_chat_history',
            {
                message_id: null,
                group_id: this.props.group_id,
            },
            e => {
                console.log(e)
            }
        )
        // // Hack to reset ScrollToIndex - else when scrolling down list scrolls instantly to bottom
        setTimeout(() => {
            this.setState({ scrollToIdx: -1 })
        }, 1000)
    }

    render() {
        if (this.state.is_inital_loading) return <Loader />

        // TODO: prevent scrolling down if scrolled up and new message arrives

        return (
            <section style={{ height: '100%' }}>
                <VirtualizedList
                    all_messages_loaded={this.state.all_messages_loaded}
                    isNextPageLoading={this.state.is_next_page_loading}
                    loadMoreChatHistory={this.loadMoreChatHistory}
                    sortBy={this.state.sortBy}
                    items={this.state.messages}
                    cache={cache}
                    list_ref={this.list_ref}
                />
            </section>
        )
    }
}
