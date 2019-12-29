import React from 'react'
import styled from '@emotion/styled'
import { FormControl, Icon, Input } from '@chakra-ui/core'
import { EmojiPicker } from './emoji-picker'
import { ChatContext } from './chat-context'
import { getSocket as socket } from '../../../api/socket'

const InputContainer = styled.div`
  padding-right: 20px;
  margin: 10px 20px 30px 20px;
  position: relative;
`
const EmojiWrapper = styled.span`
  position: absolute;
  right: 27px;
  top: 11px;
  font-size: 18px;
  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
    opacity: 1;
  }
  transform: ${props => (props.is_active ? 'scale(1.1)' : '')};
  opacity: ${props => (props.is_active ? '1' : '0.8')};
`

const IconWrapper = styled.span`
  position: absolute;
  left: 7px;
  top: 5px;
  height: 80%;
  width: 30px;
  z-index: 1;
  padding-top: 5px;
  border-radius: 5px;
  transition: 0.2s;

  &:hover {
    background-color: #aa1945;
    cursor: pointer;

    svg {
      color: #fff;
    }
  }
`
const EmojiBoxWrapper = styled.div`
  position: absolute;
  top: -359px;
  right: 20px;
`
const emoji_array = ['😈', '😇', '😉', '😎', '😓', '😱', '🤢', '🤪', '🧐', '🙄']

export const ChatInput = () => {
  const [emoji, setEmoji] = React.useState('😀')
  const [showEmojiBox, setShowEmojiBox] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const { setActiveMessage, active_message } = React.useContext(ChatContext)

  const onWriteMessage = e => {
    setMessage(e.target.value)
  }

  const onSubmit = e => {
    e.preventDefault()

    if (!message) return
    console.log('send: ', message)
    socket().emit(
      'message',
      {
        message,
        action: 'message',
        // ref: ,
        group_id: '5df5c5b8aec1710635f037c4',
      },
      e => {
        console.log('e: ', e)
      }
    )
    setMessage('')
  }
  const setShowEmojiPicker = show => {
    setShowEmojiBox(show)
    setActiveMessage(show)
  }

  return (
    <FormControl>
      <form onSubmit={onSubmit}>
        <InputContainer>
          <IconWrapper>
            <Icon name="attachment" size="14px" />
          </IconWrapper>
          <Input
            data-lpignore="true"
            value={message}
            onChange={onWriteMessage}
            placeholder="Message SJ friends"
            type="text"
            borderColor="black"
            paddingLeft="43px"
            paddingRight="43px"
            height="3rem"
          />
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <EmojiWrapper
            onMouseEnter={() => {
              if (showEmojiBox || active_message) return
              setEmoji(
                emoji_array[Math.floor(Math.random() * emoji_array.length)]
              )
            }}
            is_active={showEmojiBox}
            onClick={() => {
              if (active_message) return
              setShowEmojiPicker(!showEmojiBox)
            }}
            aria-label="emoji"
            role="img"
          >
            {emoji}
          </EmojiWrapper>
          {showEmojiBox && (
            <EmojiBoxWrapper>
              <EmojiPicker closePicker={() => setShowEmojiPicker(false)} />
            </EmojiBoxWrapper>
          )}
        </InputContainer>
      </form>
    </FormControl>
  )
}
