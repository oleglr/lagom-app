import React from 'react'

export const ChatContext = React.createContext({
    quoted_message: null,
    setQuotedMessage: () => {},
})

export const ChatContextProvider = props => {
    const [quoted_message, setQuotedMessage] = React.useState('')

    return (
        <ChatContext.Provider
            value={{
                quoted_message,
                setQuotedMessage,
            }}
        >
            {props.children}
        </ChatContext.Provider>
    )
}
