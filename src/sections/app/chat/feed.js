import React from 'react'
import styled from '@emotion/styled'
import { Box, Icon } from '@chakra-ui/core'
import { CellMeasurerCache } from 'react-virtualized'
import { VirtualizedList } from './virtualized-list'
import { getSocket as socket } from '../../../api/socket'
import { useGlobal } from '../../../context/global-context'
import { Loader, NotificationCircle } from '../../../components/elements'
import { useAuth0 } from '../../../react-auth0-spa'

const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 60,
})

export const ChatFeed = () => {
    const { active_group } = useGlobal()
    const { user } = useAuth0()

    return <ChatFeedSocket group_id={active_group.id} user={user} />
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
            notifications: 0,
            go_down_btn_visible: false,
        }
    }

    newMessage = msg => {
        const messages = [...this.state.messages, msg]
        const { notifications: old_notifications, go_down_btn_visible: has_scrolled_up } = this.state
        let is_own_message = msg.user === this.props.user.sub

        let new_notification_count = old_notifications
        if (has_scrolled_up && !is_own_message) {
            new_notification_count = old_notifications + 1
        }

        this.setState({ messages, notifications: new_notification_count }, () => {
            // at bottom of list
            const should_scroll_down = !has_scrolled_up || is_own_message
            if (should_scroll_down) {
                this.list_ref.current.scrollToRow(messages.length - 1)
            }
        })
    }

    setGoDownBtnVisibility = visibility => {
        if (visibility === this.state.go_down_btn_visible) return
        this.setState({ go_down_btn_visible: visibility })
    }

    setNotifications = notifications => this.setState({ notifications })

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
                    setGoDownBtnVisibility={this.setGoDownBtnVisibility}
                />
                <GoDownBtn
                    setNotifications={this.setNotifications}
                    notifications={this.state.notifications}
                    list_ref={this.list_ref}
                    messages={this.state.messages}
                    is_visible={this.state.go_down_btn_visible}
                />
            </section>
        )
    }
}

const GoDownBtn = ({ list_ref, messages, notifications, setNotifications, is_visible }) => {
    return (
        <Box
            role="button"
            id="go-down-btn"
            onClick={() => {
                list_ref.current.scrollToRow(messages.length - 1)
                setNotifications(0)
            }}
            position="fixed"
            zIndex={50}
            right="4%"
            bottom="15%"
            visibility={is_visible ? 'visible' : 'hidden'}
            backgroundColor="var(--secondary)"
            width="42px"
            height="42px"
            borderRadius="50%"
            boxShadow="0 1px 1px 0 rgba(0,0,0,.06), 0 2px 5px 0 rgba(0,0,0,0.3)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all .2s cubic-bezier(0.1, 0.25, 0.25, 1) 0s"
            transform={is_visible ? 'scale(1)' : 'scale(0)'}
        >
            <Icon color="white" aria-label="Scroll to new message" size="32px" name="chevron-down" />
            <span style={{ position: 'relative' }}>
                <NotificationCircle top="-28px" left="-10px" p="0 5px" fontSize="12px">
                    {notifications > 0 ? notifications : null}
                </NotificationCircle>
            </span>
        </Box>
    )
}
