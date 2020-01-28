import React from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { Stack, Heading, Text, Button } from '@chakra-ui/core'
import { NotificationCircle } from '../../../components/elements'
import { useAuth0 } from '../../../react-auth0-spa'
import { useGlobal } from '../../../context/global-context'
import { getSocket as socket } from '../../../api/socket'
import { GroupAvatars } from './avatars'
import LogoImage from '../../../assets/images/logo192.png'

const SectionHeader = styled(Text)`
    text-transform: uppercase;
    font-weight: bold;
    color: var(--text-on-secondary);
    font-size: 14px;
    margin-top: 16px;
    margin-left: 16px;
`

const ItemWrapper = styled(Stack)`
    transition: all 0.2s;
    color: #fff;
    padding-left: ${props => (props.isActive ? '12px' : '16px')};
    border-left: ${props => (props.isActive ? '4px solid var(--primary)' : '')};
    font-weight: ${props => (props.isActive ? 'bold' : '')};
    opacity: 0.9;

    &:hover {
        opacity: 1;
        cursor: pointer;
    }
`

const GroupNameHeading = styled(Heading)`
    margin-bottom: 16px;
    padding-bottom: 16px;
    padding-left: 16px;
    padding-top: 16px;
    border-bottom: 1px solid var(--grey);
    color: #fff;
    max-width: 250px;

    &:hover {
        cursor: pointer;
    }
`

const { title: DOCUMENT_TITLE } = document

const addCountToTab = count => {
    let new_title
    if (count > 0) {
        new_title = `(${count}) ${DOCUMENT_TITLE}`
    } else {
        new_title = DOCUMENT_TITLE
    }
    document.title = new_title
}

class SideContentController extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: 0,
        }
    }

    addNotification = msg => {
        if (msg.user === this.props.user.sub) {
            return
        }

        if (this.props.history.location.path_name === '/') {
            socket().emit('remove notification', { user: this.props.user.sub }, e => {
                console.log('error: ', e)
            })
            return
        }

        const { notifications: prev_notifications } = this.state
        const new_notification_count = prev_notifications + 1

        this.setState({ notifications: new_notification_count }, () => {
            addCountToTab(new_notification_count)

            const from = this.props.getUser(msg.user).name
            var notification = new Notification(this.props.active_group.name, {
                body: `${from}: ${msg.message}`,
                icon: LogoImage,
            })
            setTimeout(notification.close.bind(notification), 4000)
        })
    }

    removeNotification = () => {
        this.setState({ notifications: 0 }, () => {
            addCountToTab(0)
        })
    }

    getNotifications = res => {
        if (!res || !res.notifications || res.notifications.length === 0) return
        this.setState({ notifications: res.notifications.length }, () => {
            addCountToTab(res.notifications.length)
        })
    }

    componentDidMount() {
        if (this.props.active_group && this.props.active_group.name) {
            socket().on('notification', this.addNotification)
            socket().on('removed notification', this.removeNotification)
            socket().on('got notifications', this.getNotifications)

            socket().emit('get notifications', { user: this.props.user.sub }, e => {
                console.log('error: ', e)
            })
        }
    }

    componentWillUnmount() {
        socket().off('notification', this.addNotification)
        socket().off('removed notification', this.removeNotification)
        socket().off('got notifications', this.getNotifications)
    }

    render() {
        const { group_members, active_group, history, onClose, logout, user } = this.props
        const { notifications } = this.state

        const has_group = active_group && active_group.name
        const path_name = history.location.pathname

        if (path_name === '/' && notifications > 0) {
            socket().emit('remove notification', { user: user.sub }, e => {
                console.log('error: ', e)
            })
        }

        return (
            <>
                {has_group && (
                    <>
                        <GroupNameHeading className="group-name" size="md" onClick={() => history.push('/')}>
                            {active_group.name}
                        </GroupNameHeading>
                        {group_members.length === 1 && (
                            <Stack justify="center">
                                <Button
                                    marginLeft="16px"
                                    className="btn-primary"
                                    width="150px"
                                    onClick={() => {
                                        if (onClose) onClose()
                                        history.push('/invite')
                                    }}
                                >
                                    Invite Friends
                                </Button>
                                }
                            </Stack>
                        )}
                        {group_members.length > 1 && <GroupAvatars onClose={onClose} />}
                    </>
                )}
                {!has_group && (
                    <Stack justify="center">
                        <Button
                            marginTop="16px"
                            marginLeft="16px"
                            className="btn-primary"
                            width="150px"
                            onClick={() => {
                                if (onClose) onClose()
                                history.push('/new-group')
                            }}
                        >
                            Make a group
                        </Button>
                    </Stack>
                )}
                <Stack spacing={2}>
                    <SectionHeader>Group</SectionHeader>
                    <ItemWrapper isActive={path_name === '/'}>
                        <Link to="/">
                            <Stack isInline align="center">
                                <Text position="relative">
                                    <span aria-label="house" role="img">
                                        🏡
                                    </span>{' '}
                                    Chat
                                    {!!notifications && (
                                        <NotificationCircle top="-5%" right="-35%" left="">
                                            {notifications}
                                        </NotificationCircle>
                                    )}
                                </Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper isInline align="center" isActive={path_name === '/members'}>
                        <Link to="/members">
                            <Stack isInline align="center">
                                <Text>
                                    <span aria-label="group members" role="img">
                                        👨‍👨‍👧‍👦
                                    </span>{' '}
                                    Members
                                </Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper isInline align="center" isActive={path_name === '/media'}>
                        <Link to="/media">
                            <Stack isInline align="center">
                                <Text>
                                    <span aria-label="floppy disk" role="img">
                                        💾
                                    </span>{' '}
                                    Media
                                </Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper isInline align="center" isActive={path_name === '/bucket-list'}>
                        <Link to="/bucket-list">
                            <Stack isInline align="center">
                                <Text>
                                    <span aria-label="bucket list" role="img">
                                        📝
                                    </span>{' '}
                                    Lists
                                </Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    {/* 
                    <ItemWrapper isInline align="center" isActive={path_name === '/expenses'}>
                        <Link to="/expenses">
                            <Stack isInline align="center">
                                <Text>
                                    <span aria-label="money bag" role="img">
                                        💰
                                    </span>{' '}
                                    Expenses
                                </Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper isInline align="center" isActive={path_name === '/expenses'}>
                        <Link to="/expenses">
                            <Stack isInline align="center">
                                <Text>
                                    <span aria-label="travel plans" role="img">
                                        ✈️
                                    </span>{' '}
                                    Travel plans
                                </Text>
                            </Stack>
                        </Link>
                    </ItemWrapper> */}
                    {/* Travel bucket list, new resolutions, new goals, restaurants to try this month, movies to watch */}
                    <SectionHeader>Personal</SectionHeader>
                    <ItemWrapper isInline align="center" isActive={path_name === '/profile'}>
                        <Link to="/profile">
                            <Stack isInline align="center">
                                <Text>
                                    <span aria-label="unicorn" role="img">
                                        🦄
                                    </span>{' '}
                                    Profile
                                </Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper isInline align="center" isActive={path_name === '/my-groups'}>
                        <Link to="my-groups">
                            <Stack isInline align="center">
                                <Text>
                                    <span aria-label="balloon" role="img">
                                        🎈
                                    </span>{' '}
                                    Groups
                                </Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                </Stack>
                <Button
                    width="fit-content"
                    onClick={() => logout()}
                    variant="link"
                    color="white"
                    marginTop="32px"
                    marginBottom="16px"
                    marginLeft="16px"
                >
                    Logout
                </Button>
            </>
        )
    }
}

export const SideContent = ({ onClose }) => {
    const history = useHistory()
    const { active_group, group_members, getUser } = useGlobal()
    const { logout, user } = useAuth0()

    return (
        <SideContentController
            user={user}
            getUser={getUser}
            history={history}
            active_group={active_group}
            group_members={group_members}
            onClose={onClose}
            logout={logout}
        />
    )
}
