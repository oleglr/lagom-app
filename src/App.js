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
    NO_GROUP: 'no_group',
    ADDING_USER_TO_GROUP: 'adding_user_to_group',
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
    const { loading, isAuthenticated, user, getTokenSilently } = useAuth0()
    const [socket_status, setSocketStatus] = React.useState(APP_STATUS.LOADING)
    const [token, setToken] = React.useState(APP_STATUS.LOADING)
    const [activeGroup, setActiveGroup] = React.useState()
    const [groupMembers, setGroupMembers] = React.useState()

    React.useEffect(() => {
        async function getLoginAndInitSocket() {
            try {
                const is_invited_and_just_signed_up =
                    localStorage.getItem('signup_group_id') &&
                    localStorage.getItem('signup_inviter_id')

                const user_metadata =
                    user['http://localhost:3001/user_metadata']
                const has_group = user_metadata.group && user_metadata.group.id

                if (is_invited_and_just_signed_up && !has_group) {
                    const temp_token = await getTokenSilently()
                    setToken(temp_token)
                    setSocketStatus(APP_STATUS.ADDING_USER_TO_GROUP)
                    return
                }

                if (!user_metadata || !has_group) {
                    setSocketStatus(APP_STATUS.NO_GROUP)
                    return
                }

                setActiveGroup({
                    name: user_metadata.group.name,
                    id: user_metadata.group.id,
                })
                // 1. get group
                const res_group = await initSocket({
                    group_id: user_metadata.group.id,
                    user_id: user.sub,
                })
                setGroupMembers(res_group.users)
                setSocketStatus('')
            } catch (e) {
                console.error(e)
                setSocketStatus(APP_STATUS.SOCKET_CONNECTION_ERROR)
                return
            }
        }
        if (isAuthenticated) {
            if (!user) return
            getLoginAndInitSocket()
        } else {
            if (loading) return
            setSocketStatus('')
        }
        // TODO: fix getTokenSilently
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated])

    if (loading || socket_status === 'loading') return <Loader />

    if (socket_status === APP_STATUS.SOCKET_CONNECTION_ERROR) {
        return <Error text="Please refresh couldn't establish a connection" />
    }

    if (socket_status === APP_STATUS.ADDING_USER_TO_GROUP) {
        fetch(`http://localhost:3000/new-group-member`, {
            method: 'POST',
            body: JSON.stringify({
                group_id: localStorage.getItem('signup_group_id'),
                user_id: user.sub,
                inviter_id: localStorage.getItem('signup_inviter_id'),
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(data => data.json())
            .then(res => {
                console.log('res: ', res)
                if (res.error) {
                    return
                }
                // TODO ==:
                // added to group ---> update user + active id
                // for now:
                localStorage.removeItem('signup_group_id')
                localStorage.removeItem('signup_inviter_id')
                window.location.replace('http://localhost:3001/')
            })
        return <Loader />
    }

    //  not coming from invite link
    if (
        socket_status === APP_STATUS.NO_GROUP &&
        !/external-invite/.test(window.location.pathname)
    ) {
        history.push('/new-group')
    }

    return (
        <ThemeProvider>
            <CSSReset />
            <main className="App">
                <GlobalContextProvider
                    activeGroup={activeGroup}
                    groupMembers={groupMembers}
                >
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
