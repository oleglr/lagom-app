import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { Heading } from '@chakra-ui/core'
import { Flex } from '../container'

const AppHeader = styled(Flex)``

const NavBar = () => {
    return (
        <>
            <AppHeader>
                <Link style={{ marginRight: 'auto' }}>
                    <Heading size="md">Best friends</Heading>
                </Link>
                <Link to="/profile">Profile</Link>&nbsp;
            </AppHeader>
        </>
    )
}

export default NavBar
