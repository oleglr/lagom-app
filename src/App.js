import React from 'react'
import styled from '@emotion/styled'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { Router, Route, Switch } from 'react-router-dom'
// internal
import history from './utils/history'
import Profile from './components/general/profile'
import PrivateRoute from './components/general/private-route'
import { useAuth0 } from './react-auth0-spa'
import { GlobalContextProvider } from './context/global-context'
import { AppContent } from './sections/app/app-content'
import { SignUp } from './sections/signUp/sign-up'
import { SignUpForm } from './sections/signUp/sign-up-form'
import { ExternalInvite } from './sections/invite/external_invite'
import { NewGroup } from './sections/app/new-group/new-group'
import { Loader, Error } from './components/elements'
import { initSocket } from './api/socket'
import { SideMenu } from './sections/app/side-menu'
import { Invite } from './sections/app/new-group/invite'
import './App.css'

const APP_STATUS = Object.freeze({
    LOADING: 'loading',
    SOCKET_CONNECTION_ERROR: 'socket_connection_error',
})

function MainApp() {
    const { isAuthenticated } = useAuth0()
    return (
        <>
            {isAuthenticated && <AppContent />}
            {!isAuthenticated && <SignUp />}
        </>
    )
}

const MainContent = styled.div`
    height: 100%;
    display: flex;
`

function App() {
    const { loading, isAuthenticated, user } = useAuth0()
    const [socket_status, setSocketStatus] = React.useState(APP_STATUS.LOADING)
    const [activeGroup, setActiveGroup] = React.useState()

    React.useEffect(() => {
        async function getLoginAndInitSocket() {
            try {
                if (!user['http://localhost:3001/user_metadata']) {
                    setSocketStatus(APP_STATUS.NO_GROUP)
                    return
                }
                const all_groups = Object.keys(
                    user['http://localhost:3001/user_metadata']
                )

                // if doesn't have group set State to create group
                if (!all_groups || !all_groups.length) {
                    setSocketStatus(APP_STATUS.NO_GROUP)
                    return
                }

                const first_group = all_groups[0]
                const group_id =
                    user['http://localhost:3001/user_metadata'][first_group]
                setActiveGroup({ name: first_group, id: group_id })
                // 1. get group
                const res_group = await initSocket({
                    group_id,
                    user_id: user.sub,
                })
                // 2. get group_members from auth0
                console.log('res_group: ', res_group)
                // await fetchGroupMembers()
                // 3. set pictures in home
            } catch (e) {
                console.error(e)
                setSocketStatus(APP_STATUS.SOCKET_CONNECTION_ERROR)
                return
            }
            setSocketStatus('')
        }
        if (isAuthenticated) {
            if (!user) return
            getLoginAndInitSocket()
        } else setSocketStatus('')
    }, [user, isAuthenticated])

    if (loading || socket_status === 'loading') return <Loader />

    if (socket_status === APP_STATUS.SOCKET_CONNECTION_ERROR) {
        return <Error text="Please refresh couldn't establish a connection" />
    }

    // TODO: + not coming from invite link
    if (socket_status === APP_STATUS.NO_GROUP) {
        // history.push('/profile')
    }

    return (
        <ThemeProvider>
            <CSSReset />
            <main className="App">
                <GlobalContextProvider activeGroup={activeGroup}>
                    <Router history={history}>
                        <MainContent>
                            {isAuthenticated && <SideMenu />}
                            <Switch>
                                <Route path="/" exact component={MainApp} />
                                <Route path="/sign-up" component={SignUpForm} />
                                <Route
                                    path="/external-invite"
                                    component={ExternalInvite}
                                />

                                <PrivateRoute
                                    path="/profile"
                                    component={Profile}
                                />
                                <PrivateRoute
                                    path="/my-groups"
                                    component={Profile}
                                />
                                <PrivateRoute
                                    path="/media"
                                    component={Profile}
                                />
                                <PrivateRoute
                                    path="/members"
                                    component={Profile}
                                />
                                <PrivateRoute
                                    path="/invite"
                                    component={Invite}
                                />
                                <PrivateRoute
                                    path="/expenses"
                                    component={Profile}
                                />
                                <PrivateRoute
                                    path="/new-group"
                                    component={NewGroup}
                                />
                            </Switch>
                        </MainContent>
                    </Router>
                </GlobalContextProvider>
            </main>
        </ThemeProvider>
    )
}

export default App
