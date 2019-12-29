import React from 'react'
import styled from '@emotion/styled'
import { Chat } from './chat/chat'

const MainSection = styled.section`
    text-align: center;
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
`

export const AppContent = () => {
    return (
        <MainSection>
            <Chat />
        </MainSection>
    )
}
