import React from 'react'
import styled from '@emotion/styled'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import { Icon, Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { ChatContext } from './chat-context'
import { EmojiPicker } from './emoji-picker'

const ReactionWrapper = styled(Flex)`
  &:hover {
    cursor: pointer;
  }
`
const ReactionPopoverBubble = styled.div`
  background-color: black;
  color: white;
  padding: 5px 0px;
  border-radius: 5px;
  font-size: 13px;
  max-width: 150px;
  text-align: center;
  font-weight: bold;

  span {
    color: #b1b4b9;
    font-weight: normal;
  }
`
const ReactionPopover = ({ user }) => {
  return (
    <ReactionPopoverBubble>
      <Text>
        {user} <span>reacted with :smile:</span>
      </Text>
    </ReactionPopoverBubble>
  )
}
export const Reaction = ({ reactions, message_idx }) => {
  const [showPicker, setShowPicker] = React.useState(false)
  const [showReactionBubble, setShowReactionBubble] = React.useState('')

  const { setActiveMessage } = React.useContext(ChatContext)

  const togglePicker = show => {
    if (show) setActiveMessage(message_idx)
    else setActiveMessage('')

    setShowPicker(show)
  }
  return (
    <ReactionWrapper justify="flex-start" align="center">
      {reactions.map((r, idx) => (
        <Popover
          key={idx}
          isOpen={showReactionBubble === idx}
          position={'top'}
          content={({ position, targetRect, popoverRect }) => (
            <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
              position={position}
              targetRect={targetRect}
              popoverRect={popoverRect}
              arrowColor={'black'}
              arrowSize={7}
            >
              <div>
                <ReactionPopover user={r.user} />
              </div>
            </ArrowContainer>
          )}
        >
          <div
            onMouseEnter={() => setShowReactionBubble(idx)}
            onMouseLeave={() => setShowReactionBubble('')}
          >
            {'😉'}
          </div>
        </Popover>
      ))}
      <Popover
        isOpen={showPicker}
        position={'top'} // preferred position
        content={<EmojiPicker closePicker={() => togglePicker(false)} />}
      >
        <Icon
          onClick={() => togglePicker(!showPicker)}
          name="add"
          size="16px"
        />
      </Popover>
    </ReactionWrapper>
  )
}
