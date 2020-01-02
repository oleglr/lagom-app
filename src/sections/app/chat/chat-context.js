import React from 'react'

export const ChatContext = React.createContext({
    quoted_message: null,
    setQuotedMessage: () => {},
    thread_message: null,
    setThreadMessage: () => {},
})

export const ChatContextProvider = props => {
    const [quoted_message, setQuotedMessage] = React.useState('')
    const [thread_message, setThreadMessage] = React.useState()

    return (
        <ChatContext.Provider
            value={{
                quoted_message,
                setQuotedMessage,
                thread_message,
                setThreadMessage,
            }}
        >
            {props.children}
        </ChatContext.Provider>
    )
}
