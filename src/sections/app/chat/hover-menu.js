import React from 'react'
import styled from '@emotion/styled'
import { PopoverBubble } from '../../../components/general/popover-bubble'
import Popover from 'react-tiny-popover'
import { Icon, Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { ChatContext } from './chat-context'
import { EmojiPicker } from './emoji-picker'
import { addReaction } from './socket-methods'
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

export const HoverMenu = ({ message_idx, message }) => {
    const [showPicker, setShowPicker] = React.useState(false)
    const { setQuotedMessage, quoted_message } = React.useContext(ChatContext)
    const { user } = useAuth0()
    const { active_group } = useGlobal()

    const onAddReaction = ({ native: emoji, colons: emoji_code }) => {
        const { _id: ref } = message
        addReaction({ emoji, emoji_code, ref, group_id: active_group.id, user_id: user.sub })
        setShowPicker(false)
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
                        closePicker={() => setShowPicker(false)}
                    />
                }
            >
                <PopoverBubble text={<Text>Add reaction</Text>}>
                    <div
                        onClick={() => setShowPicker(!showPicker)}
                        className="icon-container"
                        style={{ width: '38px', borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
                    >
                        <SmilePlus name="add" style={{ marginTop: '2px', marginLeft: '4px' }} />
                    </div>
                </PopoverBubble>
            </Popover>
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
                    <Icon name="repeat-clock" size="18px" style={{ marginTop: '-2px', marginRight: '2px' }} />
                </div>
            </PopoverBubble>
        </Menu>
    )
}
