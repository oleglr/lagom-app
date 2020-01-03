import React from 'react'
import styled from '@emotion/styled'
import { PopoverBubble } from '../../../components/general/popover-bubble'
import Popover from 'react-tiny-popover'
import { Icon, Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { ChatContext } from './chat-context'
import { EmojiPicker } from './emoji-picker'
import { addReaction, addThreadReaction } from './socket-methods'

const Menu = styled(Flex)`
    border: 1px solid var(--grey-2);
    width: fit-content;
    background-color: #fff;
    height: fit-content;
    position: absolute;
    right: 50px;
    top: -11px;
    border-radius: 10px;
    position: relative;

    svg {
        padding: 8px;
        border-radius: 10px;

        &:hover {
            cursor: pointer;
            background-color: var(--grey-hover);
        }
    }
`

export const HoverMenu = ({ message_idx, message, is_thread }) => {
    const [showPicker, setShowPicker] = React.useState(false)
    const {
        setQuotedMessage,
        quoted_message,
        thread_message,
    } = React.useContext(ChatContext)

    const onAddReaction = ({ native: emoji }) => {
        const { _id: ref } = message
        if (is_thread) {
            let thread_ref = thread_message._id
            addThreadReaction({ emoji, thread_ref, ref })
        } else {
            addReaction({ emoji, ref })
        }
        togglePicker(false)
    }

    const togglePicker = show => {
        setShowPicker(show)
    }

    return (
        <Menu>
            <Popover
                isOpen={showPicker}
                position={'top'} // preferred position
                content={
                    <EmojiPicker
                        showPicker={showPicker}
                        onSelectEmoji={onAddReaction}
                        closePicker={() => togglePicker(false)}
                    />
                }
            >
                <PopoverBubble text={<Text>Add reaction</Text>}>
                    <Icon
                        onClick={() => togglePicker(!showPicker)}
                        name="add"
                        size="30px"
                    />
                </PopoverBubble>
            </Popover>
            {!is_thread && (
                <>
                    {' '}
                    <PopoverBubble text={<Text>Reply</Text>}>
                        <Icon
                            onClick={() => {
                                if (quoted_message._id === message._id) {
                                    setQuotedMessage('')
                                } else setQuotedMessage(message)
                            }}
                            name="repeat-clock"
                            size="30px"
                        />
                    </PopoverBubble>
                    {/* <PopoverBubble text={<Text>Start a thread</Text>}>
                        <Icon
                            onClick={() => setThreadMessage(message)}
                            name="chat"
                            size="30px"
                        />
                    </PopoverBubble>{' '} */}
                </>
            )}
        </Menu>
    )
}
