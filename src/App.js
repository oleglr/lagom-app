import React from 'react'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { Router, Route, Switch } from 'react-router-dom'
// internal
import history from './utils/history'
import Profile from './components/general/profile'
import PrivateRoute from './components/general/private-route'
import { useAuth0 } from './react-auth0-spa'
import Navbar from './components/general/navbar'
import { UserContext } from './context/user-context'
import { AppContent } from './sections/app/app-content'
import { SignUp } from './sections/signUp/sign-up'
import { SignUpForm } from './sections/signUp/sign-up-form'
import { Loader, Error } from './components/elements'
import { initSocket } from './api/socket'
import './App.css'

const APP_STATUS = Object.freeze({
  LOADING: 'loading',
  SOCKET_CONNECTION_ERROR: 'socket_connection_error',
})

function MainApp() {
  const [status, setStatus] = React.useState('loading')
  const { isAuthenticated } = useAuth0()

  React.useEffect(() => {
    async function getLoginAndInitSocket() {
      // 1. await login
      // 2. await socket
      try {
        await initSocket({ token: '123', group_id: '456' })
      } catch (e) {
        console.error(e)
        setStatus(APP_STATUS.SOCKET_CONNECTION_ERROR)
        return
      }
      setStatus('')
    }
    if (isAuthenticated) getLoginAndInitSocket()
    else setStatus('')
  }, [isAuthenticated])

  if (status === APP_STATUS.LOADING) return <Loader />

  return (
    <>
      {isAuthenticated && (
        <UserContext.Provider value={{ name: 'oskar' }}>
          <AppContent />
        </UserContext.Provider>
      )}
      {!isAuthenticated && <SignUp />}
      {status === APP_STATUS.SOCKET_CONNECTION_ERROR && (
        <Error text="Please refresh couldn't establish a connection" />
      )}
    </>
  )
}

function App() {
  const { loading } = useAuth0()

  if (loading) return <Loader />

  return (
    <ThemeProvider>
      <CSSReset />
      <main className="App">
        <Router history={history}>
          <header>
            <Navbar />
          </header>
          <Switch>
            <Route path="/" exact component={MainApp} />
            <Route path="/sign-up" component={SignUpForm} />
            <PrivateRoute path="/profile" component={Profile} />
          </Switch>
        </Router>
      </main>
    </ThemeProvider>
  )
}

export default App
