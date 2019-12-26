import React from 'react'
import styled from '@emotion/styled'
import { Heading, Button, Text, Icon } from '@chakra-ui/core'
import { Flex } from '../../../components/container'

const Menu = styled(Flex)`
  border: 1px solid #dedbdb;
  width: fit-content;
  background-color: #fff;
  height: fit-content;
  position: absolute;
  right: 50px;
  top: -11px;
  border-radius: 5px;
  position: relative;

  svg {
    padding: 8px;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background-color: var(--grey-hover);
    }
  }
`

export const HoverMenu = ({ setShowEmojiBox, show_emoji_box }) => {
  return (
    <Menu>
      <Icon
        onClick={() => setShowEmojiBox(!show_emoji_box)}
        name="add"
        size="30px"
      />
      <Icon name="repeat" size="30px" />
      <Icon name="chat" size="30px" />
    </Menu>
  )
}
