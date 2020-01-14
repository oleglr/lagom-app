import React from 'react'
import styled from '@emotion/styled'
import { PopoverBubble } from '../../../components/general/popover-bubble'
import Popover from 'react-tiny-popover'
import { Icon, Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { ChatContext } from './chat-context'
import { EmojiPicker } from './emoji-picker'
import { addReaction, addThreadReaction } from './socket-methods'
import { useGlobal } from '../../../context/global-context'
import { useAuth0 } from '../../../react-auth0-spa'
import { ReactComponent as SmilePlus } from '../../../assets/svgs/smile-plus.svg'

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

    div.icon-container {
        padding: 5px;
        border-radius: 10px;
        height: 100%;

        &:hover {
            cursor: pointer;
            background-color: var(--grey-hover);
        }
    }
`

export const HoverMenu = ({ message_idx, message, is_thread }) => {
    const [showPicker, setShowPicker] = React.useState(false)
    const { setQuotedMessage, quoted_message, thread_message } = React.useContext(ChatContext)
    const { user } = useAuth0()
    const { active_group } = useGlobal()

    const onAddReaction = ({ native: emoji }) => {
        const { _id: ref } = message
        if (is_thread) {
            let thread_ref = thread_message._id
            addThreadReaction({
                user_id: user.sub,
                emoji,
                thread_ref,
                ref,
                group_id: active_group.id,
            })
        } else {
            addReaction({ emoji, ref, group_id: active_group.id, user_id: user.sub })
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
                    <div
                        onClick={() => togglePicker(!showPicker)}
                        className="icon-container"
                        style={{ width: '33px', borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
                    >
                        <SmilePlus name="add" style={{ marginTop: '4px', marginLeft: '4px' }} />
                    </div>
                </PopoverBubble>
            </Popover>
            {!is_thread && (
                <>
                    {' '}
                    <PopoverBubble text={<Text>Reply</Text>}>
                        <div
                            onClick={() => {
                                if (quoted_message._id === message._id) {
                                    setQuotedMessage('')
                                } else setQuotedMessage(message)
                            }}
                            className="icon-container"
                            style={{ borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }}
                        >
                            <Icon name="repeat-clock" size="15px" style={{ marginTop: '-2px', marginRight: '2px' }} />
                        </div>
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
