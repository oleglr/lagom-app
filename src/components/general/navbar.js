import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/core'
import { useAuth0 } from '../../react-auth0-spa'

const AppHeader = styled.nav`
  display: flex;
  width: 100%;
`

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth0()

  return (
    <>
      {!isAuthenticated && (
        <AppHeader>
          <div>Logo</div>
        </AppHeader>
      )}

      {isAuthenticated && (
        <AppHeader>
          <Link to="/">Home</Link>&nbsp;
          <div>
            <Link to="/profile">Profile</Link>
            <Button onClick={() => logout()}>Log out</Button>
          </div>
        </AppHeader>
      )}
    </>
  )
}

export default NavBar
