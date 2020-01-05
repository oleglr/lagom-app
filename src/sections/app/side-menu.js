import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import {
    Stack,
    Heading,
    Text,
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/core'
import { useHistory } from 'react-router-dom'

const Aside = styled.aside`
    min-width: 275px;
    height: 100%;
    background-color: var(--secondary);
`
const Nav = styled.nav`
    height: 100%;
    width: 100%;
`
const SectionHeader = styled(Text)`
    text-transform: uppercase;
    font-weight: bold;
    color: var(--text-on-secondary);
    font-size: 14px;
    margin-top: 16px;
`
const ItemWrapper = styled(Stack)`
    transition: all 0.2s;
    color: ${props => (props.isActive ? 'var(--primary)' : '#fff')};

    svg {
        height: 16px;
        padding-right: 5px;
    }
    &:hover {
        cursor: pointer;
        color: var(--primary);

        svg {
            g {
                fill: var(--primary);
            }
        }
    }
`

const GroupNameHeading = styled(Heading)`
    margin-bottom: 16px;
    padding-bottom: 16px;
    padding-left: 16px;
    padding-top: 16px;
    border-bottom: 1px solid var(--grey);
    color: #fff;

    &:hover {
        cursor: pointer;
    }
`

export const SideMenu = () => {
    const history = useHistory()
    const path_name = history.location.pathname
    // if is mobile / tablet --> open and close
    // else always stay open

    return (
        <Aside>
            <Nav>
                <GroupNameHeading size="md" onClick={() => history.push('/')}>
                    Best Friends
                </GroupNameHeading>
                <Stack justify="center">
                    <Button
                        marginLeft="16px"
                        className="btn-primary"
                        width="150px"
                        onClick={() => history.push('/invite')}
                    >
                        Invite Friends
                    </Button>
                </Stack>
                <Stack spacing={2} paddingLeft="16px">
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
                    <ItemWrapper
                        isInline
                        align="center"
                        isActive={path_name === '/members'}
                    >
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
                    <ItemWrapper
                        isInline
                        align="center"
                        isActive={path_name === '/media'}
                    >
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
                    <ItemWrapper
                        isInline
                        align="center"
                        isActive={path_name === '/expenses'}
                    >
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
                    {/* Travel bucket list, new resolutions, new goals, restaurants to try this month, movies to watch */}
                    <SectionHeader>Personal</SectionHeader>
                    <ItemWrapper
                        isInline
                        align="center"
                        isActive={path_name === '/profile'}
                    >
                        <Link to="/profile">
                            <Stack isInline align="center">
                                <Text>
                                    <span aria-label="balloon" role="img">
                                        😄
                                    </span>{' '}
                                    Profile
                                </Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper
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
                    </ItemWrapper>
                </Stack>
            </Nav>
        </Aside>
    )
}
