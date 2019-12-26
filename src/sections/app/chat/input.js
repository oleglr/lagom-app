import React from 'react'
import styled from '@emotion/styled'
import {
  Heading,
  Button,
  Text,
  FormControl,
  Icon,
  Input,
} from '@chakra-ui/core'

const InputContainer = styled.div`
  padding-right: 20px;
  margin: 20px; 0;
    position: relative;
`
const EmojiWrapper = styled.span`
  position: absolute;
  right: 27px;
  top: 11px;
  font-size: 18px;
  transition: all 0.2s ease-in-out;
  opacity: 0.8;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
    opacity: 1;
  }
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
const emoji_array = ['😈', '😇', '😉', '😎', '😓', '😱', '🤢', '🤪', '🧐', '🙄']

export const ChatInput = () => {
  const [emoji, setEmoji] = React.useState('😀')

  return (
    <FormControl>
      <InputContainer>
        <IconWrapper>
          <Icon name="attachment" size="14px" />
        </IconWrapper>
        <Input
          placeholder="Message SJ friends"
          type="text"
          borderColor="black"
          paddingLeft="43px"
          paddingRight="43px"
          height="3rem"
        />
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <EmojiWrapper
          onMouseEnter={() =>
            setEmoji(
              emoji_array[Math.floor(Math.random() * emoji_array.length)]
            )
          }
          onMouseLeave={() => setEmoji('😀')}
          aria-label="emoji"
          role="img"
        >
          {emoji}
        </EmojiWrapper>
      </InputContainer>
    </FormControl>
  )
}
