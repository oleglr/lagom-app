import React from 'react'

export const ChatContext = React.createContext({
    active_message: '',
    setActiveMessage: () => {},
    quoted_message: null,
    setQuotedMessage: () => {},
})

export const ChatContextProvider = props => {
    const [active_message, setActiveMessage] = React.useState('')
    const [quoted_message, setQuotedMessage] = React.useState('')

    return (
        <ChatContext.Provider
            value={{
                active_message,
                setActiveMessage,
                quoted_message,
                setQuotedMessage,
            }}
        >
            {props.children}
        </ChatContext.Provider>
    )
}
