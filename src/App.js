import React from 'react'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { initSocket } from './api/socket'
import './App.css'

const APP_STATUS = Object.freeze({
  AUTHORIZED: 'authorized',
  UNAUTHORIZED: 'unauthorized',
  LOADING: 'loading',
  SOCKET_CONNECTION_ERROR: 'socket_connection_error',
})

function renderApp(status) {
  switch (status) {
    case APP_STATUS.AUTHORIZED:
      return <div>Here we go</div>
    case APP_STATUS.UNAUTHORIZED:
      return <div>Login</div>
    case APP_STATUS.LOADING:
      return <div>Loading..</div>
    case APP_STATUS.SOCKET_CONNECTION_ERROR:
      return <div>Please refresh couldn't establish a connection</div>
    default:
      break
  }
}

function App() {
  const [status, setStatus] = React.useState('loading')

  React.useEffect(() => {
    async function getLoginAndInitSocket() {
      // 1. await login
      // 2. await socket
      await initSocket({
        token: '123',
        group_id: '456',
      })
        .then(data => {
          setStatus(APP_STATUS.AUTHORIZED)
        })
        .catch(err => {
          setStatus(APP_STATUS.SOCKET_CONNECTION_ERROR)
        })
    }
    getLoginAndInitSocket()
  }, [])

  return (
    <ThemeProvider>
      <CSSReset />
      <main className="App">{renderApp(status)}</main>
    </ThemeProvider>
  )
}

export default App
