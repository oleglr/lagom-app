import React from 'react'
import styled from '@emotion/styled'
import { Chat } from './chat/chat'
import { useGlobal } from '../../context/global-context'
import { CreateGroup } from '../../components/general/create-group'

const ChatSection = styled.section`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

export const AppContent = () => {
    const { active_group } = useGlobal()

    if (!active_group || !active_group.id) {
        return <CreateGroup />
    }
    return (
        <ChatSection>
            <Chat />
        </ChatSection>
    )
}
