import React from 'react'
import styled from '@emotion/styled'
import { Heading, Button, Text, Icon } from '@chakra-ui/core'
import { Picker } from 'emoji-mart'
import { Flex, Lottie } from '../../../components/container'
import { useAuth0 } from '../../../react-auth0-spa'
import { HoverMenu } from './hover-menu'
import { EmojiPicker } from './emoji-picker'

const ChatContainer = styled(Flex)`
  margin-bottom: 7px;
  margin-left: 15px;
  position: relative;
  padding: 5px 15px 5px 5px;
  transition: 0.1s;
  background-color: ${props =>
    props.show_emoji_box ? 'var(--grey-hover)' : ''};

  &:hover {
    background-color: ${props =>
      !props.has_box_open ? 'var(--grey-hover)' : ''};
  }
`

const Name = styled.span`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const EmojiBoxWrapper = styled.div`
  position: absolute;
  top: -359px;
  right: 20px;
  z-index: 10;
`

export const Message = ({ setHasBoxOpen, has_box_open }) => {
  const { user } = useAuth0()
  const [showMessageOption, setShowMessageOption] = React.useState(false)
  const [show_emoji_box, setShowEmojiBox] = React.useState(false)

  const setShowEmojiPicker = show => {
    setHasBoxOpen(show)
    setShowEmojiBox(show)
  }

  return (
    <ChatContainer
      justify="start"
      height="auto-fit"
      has_box_open={has_box_open}
      show_emoji_box={show_emoji_box}
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
      {showMessageOption && !has_box_open && (
        <HoverMenu
          show_emoji_box={show_emoji_box}
          setShowEmojiBox={setShowEmojiPicker}
        />
      )}
      {show_emoji_box && (
        <EmojiBoxWrapper>
          <EmojiPicker closePicker={() => setShowEmojiPicker(false)} />
        </EmojiBoxWrapper>
      )}
    </ChatContainer>
  )
}
