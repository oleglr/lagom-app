import React from 'react'
import styled from '@emotion/styled'
import Popover from 'react-tiny-popover'
import { Icon } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { ChatContext } from './chat-context'
import { EmojiPicker } from './emoji-picker'

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

export const HoverMenu = ({ message_idx }) => {
  const [showPicker, setShowPicker] = React.useState(false)
  const { setActiveMessage } = React.useContext(ChatContext)

  const togglePicker = show => {
    if (show) setActiveMessage(message_idx)
    else setActiveMessage('')

    setShowPicker(show)
  }

  return (
    <Menu>
      <Popover
        isOpen={showPicker}
        position={'top'} // preferred position
        content={<EmojiPicker closePicker={() => togglePicker(false)} />}
      >
        <Icon
          onClick={() => togglePicker(!showPicker)}
          name="add"
          size="30px"
        />
      </Popover>
      <Icon name="repeat" size="30px" />
      <Icon name="chat" size="30px" />
    </Menu>
  )
}
