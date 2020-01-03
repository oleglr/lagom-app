import React from 'react'

export const ChatContext = React.createContext({
    quoted_message: null,
    setQuotedMessage: () => {},
    thread_message: null,
    setThreadMessage: () => {},
})

export const ChatContextProvider = props => {
    const [quoted_message, setQuote] = React.useState('')
    const [thread_message, setThread] = React.useState()

    const setQuotedMessage = m => {
        setQuote(m)
        document.getElementById('main-input').focus()
    }

    const setThreadMessage = m => {
        setQuote('')
        setThread(m)
    }

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
