import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { Stack, Heading, Text, Button } from '@chakra-ui/core'
import { ReactComponent as HomeIcon } from '../../assets/svgs/home-icon.svg'
import { ReactComponent as GroupMembersIcon } from '../../assets/svgs/group-members-icon.svg'
import { ReactComponent as MediaIcon } from '../../assets/svgs/media-icon.svg'
import { ReactComponent as ExpensesIcon } from '../../assets/svgs/expenses-icon.svg'
import { ReactComponent as UserProfileIcon } from '../../assets/svgs/user-profile-icon.svg'
import { ReactComponent as GroupsIcon } from '../../assets/svgs/groups-icon.svg'

const Aside = styled.aside`
    min-width: 275px;
    height: 100%;
    background-color: #161930;
`
const Nav = styled.nav`
    height: 100%;
    width: 100%;
`
const SectionHeader = styled(Text)`
    text-transform: uppercase;
    font-weight: bold;
    color: #9ebdfb;
    font-size: 14px;
    margin-top: 16px;
`
const ItemWrapper = styled(Stack)`
    color: #fff;
    transition: all 0.2s;

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
`

export const SideMenu = () => {
    return (
        <Aside>
            <Nav>
                <GroupNameHeading size="md">Best Friends</GroupNameHeading>
                <Stack justify="center">
                    <Button
                        marginLeft="16px"
                        className="btn-primary"
                        width="150px"
                    >
                        Invite Friends
                    </Button>
                </Stack>
                <Stack spacing={2} paddingLeft="16px">
                    <SectionHeader>Group</SectionHeader>
                    <ItemWrapper>
                        <Link to="/">
                            <Stack isInline align="center">
                                <HomeIcon />
                                <Text>Feed</Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper isInline align="center">
                        <Link to="/members">
                            <Stack isInline align="center">
                                <GroupMembersIcon />
                                <Text>Members</Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper isInline align="center">
                        <Link to="/media">
                            <Stack isInline align="center">
                                <MediaIcon />
                                <Text>Media</Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper isInline align="center">
                        <Link to="/expenses">
                            <Stack isInline align="center">
                                <ExpensesIcon />
                                <Text>Expenses</Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    {/* Travel bucket list, new resolutions, new goals, restaurants to try this month, movies to watch */}
                    <SectionHeader>Personal</SectionHeader>
                    <ItemWrapper isInline align="center">
                        <Link to="/profile">
                            <Stack isInline align="center">
                                <UserProfileIcon />
                                <Text>Profile</Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                    <ItemWrapper isInline align="center">
                        <Link to="groups">
                            <Stack isInline align="center">
                                <GroupsIcon />
                                <Text>Groups</Text>
                            </Stack>
                        </Link>
                    </ItemWrapper>
                </Stack>
            </Nav>
        </Aside>
    )
}
