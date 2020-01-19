import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import {
    Stack,
    Heading,
    Text,
    Button,
    Drawer,
    Icon,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Avatar,
    // AvatarBadge,
} from '@chakra-ui/core'
import { useHistory } from 'react-router-dom'
import { Swipeable } from 'react-swipeable'
import { useUI } from '../../main-content'
import { useGlobal } from '../../context/global-context'
import { useAuth0 } from '../../react-auth0-spa'
import { PopoverBubble } from '../../components/general/popover-bubble'

const Aside = styled.aside`
    min-width: 275px;
    height: 100%;
    background-color: var(--secondary);
`
const StyledDrawerContent = styled(DrawerContent)`
    min-width: 275px;
    height: 100%;
    background-color: var(--secondary);
    font-size: 22px;

    .group-name {
        font-size: 22px;
    }
`
const Nav = styled.nav`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`
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
const GroupAvatars = ({ onClose }) => {
    const { group_members } = useGlobal()
    const history = useHistory()

    let show_more, more_members
    if (group_members.length > 12) {
        show_more = true
        more_members = group_members.length - 12
    }

    return (
        <>
            <div>
                <Stack
                    align="center"
                    isInline
                    marginLeft="8px"
                    flexWrap="wrap"
                    maxWidth="250px"
                    maxHeight="250px"
                    overflow="scroll"
                >
                    {group_members.slice(0, 12).map(m => (
                        <PopoverBubble key={m.user_id} text={<Text>{m.nickname}</Text>}>
                            <Avatar margin="2px" src={m.picture} size="sm">
                                {/* <AvatarBadge border="0.1em solid" borderColor="papayawhip" bg="green.400" size="1em" /> */}
                            </Avatar>
                        </PopoverBubble>
                    ))}
                    {show_more && (
                        <Text fontSize="12px" margin="2px" color="#fff">
                            ...and {more_members} more
                        </Text>
                    )}
                </Stack>
            </div>
            <Button
                onClick={() => {
                    if (onClose) onClose()
                    history.push('/invite')
                }}
                size="xs"
                variantColor="teal"
                marginTop="16px"
                marginLeft="8px"
                width="100px"
            >
                Add members
            </Button>
        </>
    )
}

const SideContent = ({ onClose }) => {
    const history = useHistory()
    const { active_group, group_members } = useGlobal()
    const { logout } = useAuth0()

    const path_name = history.location.pathname
    const has_group = active_group && active_group.name

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
                            <Text>
                                <span aria-label="house" role="img">
                                    🏡
                                </span>{' '}
                                Home
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
                {/* <ItemWrapper
                    isInline
                    align="center"
                    isActive={path_name === '/my-groups'}
                >
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
                </ItemWrapper> */}
                {/* <ItemWrapper isInline align="center" isActive={path_name === '/expenses'}>
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
                {/* <ItemWrapper
                    isInline
                    align="center"
                    isActive={path_name === '/my-groups'}
                >
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
                </ItemWrapper> */}
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

export const SideMenu = () => {
    const btnRef = React.useRef()

    const { is_drawer_open, toggleDrawer, is_mobile } = useUI()
    const history = useHistory()
    const { active_group } = useGlobal()

    const closeDrawer = () => toggleDrawer(false)
    const openDrawer = () => toggleDrawer(true)

    const has_group = active_group && active_group.name

    if (is_mobile) {
        return (
            <>
                <Stack backgroundColor="var(--secondary)" height="60px" align="center" isInline>
                    <Button width="50px" ref={btnRef} backgroundColor="transparent" onClick={openDrawer}>
                        <Icon name="arrow-right" color="#fff" />
                    </Button>
                    {has_group && (
                        <Heading
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            color="white"
                            size="sm"
                            onClick={() => history.push('/')}
                        >
                            {active_group.name}
                        </Heading>
                    )}
                </Stack>
                <Drawer isOpen={is_drawer_open} placement="left" onClose={closeDrawer} finalFocusRef={btnRef}>
                    <Swipeable style={{ height: '100%' }} onSwipedLeft={closeDrawer}>
                        <DrawerOverlay />
                        <StyledDrawerContent>
                            <DrawerCloseButton color="#fff" />
                            <SideContent onClose={closeDrawer} />
                        </StyledDrawerContent>
                    </Swipeable>
                </Drawer>
            </>
        )
    }

    return (
        <Aside>
            <Nav>
                <SideContent />
            </Nav>
        </Aside>
    )
}
