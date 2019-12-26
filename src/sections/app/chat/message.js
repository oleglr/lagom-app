import React from 'react'
import styled from '@emotion/styled'
import { Heading, Button, Text, Icon } from '@chakra-ui/core'
import { Flex, Lottie } from '../../../components/container'
import { useAuth0 } from '../../../react-auth0-spa'

const ChatContainer = styled(Flex)`
  margin-bottom: 7px;
  margin-left: 15px;
  position: relative;
  padding: 5px 15px 5px 5px;
  transition: 0.1s;

  &:hover {
    background-color: var(--grey-hover);
  }
`

const Name = styled.span`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const Menu = styled(Flex)`
  border: 1px solid #dedbdb;
  width: fit-content;
  background-color: #fff;
  height: fit-content;
  position: absolute;
  right: 50px;
  top: -11px;
  border-radius: 5px;

  svg {
    padding: 8px;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background-color: var(--grey-hover);
    }
  }
`

const HoverMenu = () => {
  return (
    <Menu>
      <Icon name="add" size="30px" />
      <Icon name="repeat" size="30px" />
      <Icon name="chat" size="30px" />
    </Menu>
  )
}

export const Message = () => {
  const { user } = useAuth0()
  const [showMessageOption, setShowMessageOption] = React.useState(false)

  console.log('user: ', user)
  return (
    <ChatContainer
      justify="start"
      height="auto-fit"
      onMouseEnter={() => setShowMessageOption(true)}
      onMouseLeave={() => setShowMessageOption(false)}
    >
      <img
        src={user.picture}
        alt="Profile"
        style={{ borderRadius: '5px', maxHeight: '45px' }}
      />
      <Flex column align="flex-start" pl="5px">
        <Text>
          <Name className="bold">{user.name}</Name>{' '}
          <span style={{ fontSize: '12px', color: 'var(--grey)' }}>
            12:30 PM
          </span>
        </Text>
        <Text textAlign="left">Hey man</Text>
      </Flex>
      {showMessageOption && <HoverMenu />}
    </ChatContainer>
  )
}
