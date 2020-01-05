import React from 'react'
import styled from '@emotion/styled'
import Popover from 'react-tiny-popover'
import { Icon, Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { EmojiPicker } from './emoji-picker'
import { PopoverBubble } from '../../../components/general/popover-bubble'
import { ChatContext } from './chat-context'
import { addReaction, addThreadReaction } from './socket-methods'
import { useGlobal } from '../../../context/global-context'

const ReactionWrapper = styled(Flex)`
    padding-top: 3px;
    max-width: ${props => (props.is_thread ? '200px' : '')}
    &:hover {
        cursor: pointer;
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

    &:hover {
        cursor: pointer;
    }
`

function sortEmojis(emoji_arr) {
    const new_arr = []
    emoji_arr.forEach(e => {
        const idx = new_arr.findIndex(new_e => new_e.emoji === e.emoji)
        if (idx >= 0) new_arr[idx].users.push(e.user)
        else new_arr.push({ ...e, users: [e.user] })
    })
    return new_arr
}

export const Reaction = React.memo(function({
    reactions,
    message_idx,
    message_ref,
    is_thread,
}) {
    const [showPicker, setShowPicker] = React.useState(false)
    const { thread_message } = React.useContext(ChatContext)
    const { active_group } = useGlobal()

    const sorted_reactions = sortEmojis(reactions)

    const onAddReaction = ({ native: emoji }) => {
        if (is_thread) {
            let thread_ref = thread_message._id
            addThreadReaction({
                emoji,
                thread_ref,
                ref: message_ref,
                group_id: active_group.id,
            })
        } else {
            addReaction({ emoji, ref: message_ref, group_id: active_group.id })
        }
        togglePicker(false)
    }

    const togglePicker = show => {
        setShowPicker(show)
    }
    return (
        <ReactionWrapper
            justify="flex-start"
            align="center"
            is_thread={is_thread}
        >
            {sorted_reactions.map((r, idx) => (
                <PopoverBubble
                    key={r._id}
                    text={
                        <Text>
                            {r.users[0]} <span>reacted with :smile:</span>
                        </Text>
                    }
                >
                    <ReactionsBox>
                        {r.emoji}{' '}
                        <span style={{ fontSize: '12px' }}>
                            {r.users.length}
                        </span>
                    </ReactionsBox>
                </PopoverBubble>
            ))}
            <Popover
                isOpen={showPicker}
                position={'top'} // preferred position
                content={
                    <EmojiPicker
                        onSelectEmoji={onAddReaction}
                        closePicker={() => togglePicker(false)}
                        showPicker={showPicker}
                    />
                }
            >
                <PopoverBubble text={<Text>Add reaction</Text>}>
                    <Icon
                        onClick={() => togglePicker(!showPicker)}
                        name="add"
                        size="16px"
                    />
                </PopoverBubble>
            </Popover>
        </ReactionWrapper>
    )
})
