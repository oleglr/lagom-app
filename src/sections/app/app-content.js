import React from 'react'
import styled from '@emotion/styled'
import { Chat } from './chat/chat'
import { SideMenu } from './side-menu'

const ChatSection = styled.section`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`
const MainContent = styled.div`
    height: 100%;
    display: flex;
`

export const AppContent = () => {
    return (
        <>
            <MainContent>
                <SideMenu />
                <ChatSection>
                    <Chat />
                </ChatSection>
            </MainContent>
        </>
    )
}
