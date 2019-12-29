import React from 'react'
import styled from '@emotion/styled'
import { PopoverBubble } from '../../../components/general/popover-bubble'
import Popover from 'react-tiny-popover'
import { Icon, Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { ChatContext } from './chat-context'
import { EmojiPicker } from './emoji-picker'
import { getSocket as socket } from '../../../api/socket'

const Menu = styled(Flex)`
    border: 1px solid var(--grey-2);
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

export const HoverMenu = ({ message_idx, message }) => {
    const [showPicker, setShowPicker] = React.useState(false)
    const { setActiveMessage, setQuotedMessage } = React.useContext(ChatContext)

    const onAddReaction = emoji => {
        const { _id: ref } = message
        socket().emit(
            'add reaction',
            {
                emoji: emoji.native,
                ref,
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
            <PopoverBubble text={<Text>Reply</Text>}>
                <Icon
                    onClick={() => setQuotedMessage(message)}
                    name="repeat"
                    size="30px"
                />
            </PopoverBubble>
            <PopoverBubble text={<Text>Start a thread</Text>}>
                <Icon name="chat" size="30px" />
            </PopoverBubble>
        </Menu>
    )
}
