import React from 'react'

export const ChatContext = React.createContext({
  active_message: 5,
  setActiveMessage: () => {},
})

export const ChatContextProvider = props => {
  const setActiveMessage = active_message => {
    setState({ ...state, active_message })
  }

  const initState = {
    active_message: '',
    setActiveMessage: setActiveMessage,
  }

  const [state, setState] = React.useState(initState)

  return (
    <ChatContext.Provider value={state}>{props.children}</ChatContext.Provider>
  )
}
