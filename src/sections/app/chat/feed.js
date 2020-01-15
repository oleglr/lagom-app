import React from 'react'
import { CellMeasurerCache } from 'react-virtualized'
import { VirtualizedList } from './virtualized-list'
import { useFetch } from '../../../components/hooks/fetch-data'
import { getSocket as socket } from '../../../api/socket'
import { useGlobal } from '../../../context/global-context'
import { Loader } from '../../../components/elements'
import moment from 'moment'

const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 60,
})

export const ChatFeed = () => {
    const { active_group } = useGlobal()
    const [data, loading] = useFetch(`${process.env.REACT_APP_API}/chat-history?groupId=${active_group.id}`)

    if (loading) return <Loader />

    // const new_data = []
    // if (data && data.chat && data.chat.length) {
    //     const data_reverse = data.chat.reverse()
    //     let day

    //     data_reverse.forEach((m, idx) => {
    //         const createdAt_moment = moment(m.createdAt)
    //         const day_moment = moment(day)

    //         if (createdAt_moment.isSame(day_moment, 'day')) {
    //             new_data.push(m)
    //         } else {
    //             new_data.push({
    //                 date: day_moment.format('ll'),
    //             })
    //             new_data.push(m)
    //             day = m.createdAt
    //         }
    //     })
    // }

    return <ChatFeedSocket message_history={data.chat.reverse()} />
}

export class ChatFeedSocket extends React.Component {
    constructor(props) {
        super(props)
        this.list_ref = React.createRef()
        this.state = {
            messages: props.message_history,
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

    removeReaction = msg => {
        const msg_idx = this.state.messages.findIndex(m => m._id === msg._id)
        cache.clear(msg_idx)

        const new_data = [...this.state.messages]
        new_data[msg_idx] = msg
        this.setState({ messages: new_data, sortBy: this.state.sortBy + 1 })
    }

    componentDidMount() {
        socket().on('message', this.newMessage)
        socket().on('added reaction', this.newReaction)
        socket().on('removed reaction', this.removeReaction)
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
