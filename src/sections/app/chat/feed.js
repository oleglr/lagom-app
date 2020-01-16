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

const formatDate = date => {
    const is_today = moment().isSame(date, 'day')
    if (is_today) return 'Today'

    const is_yesterday = moment()
        .subtract(1, 'days')
        .isSame(date, 'day')
    if (is_yesterday) return 'Yesterday'
    else return date.format('ll')
}

export const ChatFeed = () => {
    const { active_group } = useGlobal()
    const [data, loading] = useFetch(`${process.env.REACT_APP_API}/chat-history?groupId=${active_group.id}`)

    if (loading) return <Loader />

    const new_data = []
    if (data && data.chat && data.chat.length) {
        // data[0] = most recent
        let day = data.chat[0].createdAt

        data.chat.forEach((m, idx) => {
            const createdAt_moment = moment(m.createdAt)
            const day_moment = moment(day)

            // if same day as most recent add to array
            if (createdAt_moment.isSame(day_moment, 'day')) {
                new_data.push(m)
            } else {
                // different day --> add day label
                new_data.push({
                    date: formatDate(day_moment),
                })
                new_data.push(m)
                day = m.createdAt
            }
            // add first label
            if (idx === data.chat.length - 1) {
                new_data.push({
                    date: formatDate(day_moment),
                })
            }
        })
    }

    return <ChatFeedSocket message_history={new_data.reverse()} />
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
