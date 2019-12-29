import React from 'react'
import styled from '@emotion/styled'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import { Icon, Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { ChatContext } from './chat-context'
import { EmojiPicker } from './emoji-picker'
import { getSocket as socket } from '../../../api/socket'

const ReactionWrapper = styled(Flex)`
  padding-top: 3px;

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
const ReactionsBox = styled.div`
  border: 2px solid var(--moon-blue);
  border-radius: 12px;
  padding: 0px 5px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  background-color: #8569ff14;
  font-weight: bold;
`

const ReactionPopover = ({ users }) => {
  return (
    <ReactionPopoverBubble>
      <Text>
        {users[0]} <span>reacted with :smile:</span>
      </Text>
    </ReactionPopoverBubble>
  )
}

function sortEmojis(emoji_arr) {
  const new_arr = []
  emoji_arr.forEach(e => {
    const idx = new_arr.findIndex(new_e => new_e.emoji === e.emoji)
    if (idx >= 0) new_arr[idx].users.push(e.user)
    else new_arr.push({ ...e, users: [e.user] })
  })
  return new_arr
}

export const Reaction = ({ reactions, message_idx, message_ref }) => {
  const [showPicker, setShowPicker] = React.useState(false)
  const [showReactionBubble, setShowReactionBubble] = React.useState('')
  const { setActiveMessage } = React.useContext(ChatContext)

  const sorted_reactions = sortEmojis(reactions)

  const onAddReaction = emoji => {
    console.log('emoji: ', emoji)
    socket().emit(
      'add reaction',
      {
        emoji: emoji.native,
        ref: message_ref,
        is_thread: false,
        // thread_ref,
        group_id: '5df5c5b8aec1710635f037c4',
      },
      e => {
        console.log('e: ', e)
      }
    )
    togglePicker(false)
  }

  const togglePicker = show => {
    if (show) setActiveMessage(message_idx)
    else setActiveMessage('')

    setShowPicker(show)
  }
  return (
    <ReactionWrapper justify="flex-start" align="center">
      {sorted_reactions.map((r, idx) => (
        <Popover
          key={idx}
          isOpen={showReactionBubble === idx}
          position={'top'}
          content={({ position, targetRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              targetRect={targetRect}
              popoverRect={popoverRect}
              arrowColor={'black'}
              arrowSize={7}
            >
              <div>
                <ReactionPopover users={r.users} />
              </div>
            </ArrowContainer>
          )}
        >
          <ReactionsBox
            onMouseEnter={() => setShowReactionBubble(idx)}
            onMouseLeave={() => setShowReactionBubble('')}
          >
            {r.emoji} <span style={{ fontSize: '12px' }}>{r.users.length}</span>
          </ReactionsBox>
        </Popover>
      ))}
      <Popover
        isOpen={showPicker}
        position={'top'} // preferred position
        content={
          <EmojiPicker
            onSelectEmoji={onAddReaction}
            closePicker={() => togglePicker(false)}
          />
        }
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
