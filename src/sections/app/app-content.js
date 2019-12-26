import React from 'react'
import styled from '@emotion/styled'
import {
  Heading,
  Button,
  Text,
  FormControl,
  FormLabel,
  Icon,
  Input,
} from '@chakra-ui/core'
import { ChatFeed } from './chat/feed'
import { ChatInput } from './chat/input'

const MainSection = styled.section`
  text-align: center;
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
`

export const AppContent = () => {
  return (
    <MainSection>
      <Heading size="lg">Best friends</Heading>
      <ChatFeed />
      <ChatInput />
    </MainSection>
  )
}
