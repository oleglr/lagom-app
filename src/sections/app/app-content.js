import React from 'react'
import styled from '@emotion/styled'
import { Chat } from './chat/chat'

const ChatSection = styled.section`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

export const AppContent = () => {
    return (
        <ChatSection>
            <Chat />
        </ChatSection>
    )
}
