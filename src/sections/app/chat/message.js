import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { useAuth0 } from '../../../react-auth0-spa'
import { HoverMenu } from './hover-menu'
import { ChatContext } from './chat-context'

const ChatContainer = styled(Flex)`
  margin-bottom: 7px;
  margin-left: 15px;
  position: relative;
  padding: 5px 15px 5px 5px;
  transition: 0.1s;
  background-color: ${props =>
    props.this_menu_is_open ? 'var(--grey-hover)' : ''};

  &:hover {
    background-color: ${props =>
      props.a_menu_is_open ? '' : 'var(--grey-hover)'};
  }
`

const Name = styled.span`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

export const Message = ({ text, idx }) => {
  const { user } = useAuth0()
  const [show_menu, setShowMenu] = React.useState(false)
  const { active_message } = React.useContext(ChatContext)

  const a_menu_is_open = typeof active_message === 'number'
  const this_menu_is_open = a_menu_is_open && active_message === idx

  let should_show_menu = show_menu || this_menu_is_open
  if (a_menu_is_open && !this_menu_is_open) {
    should_show_menu = false
  }

  return (
    <ChatContainer
      justify="start"
      this_menu_is_open={this_menu_is_open}
      a_menu_is_open={a_menu_is_open}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
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
        <Text textAlign="left">{text}</Text>
      </Flex>
      {should_show_menu && <HoverMenu message_idx={idx} />}
    </ChatContainer>
  )
}
