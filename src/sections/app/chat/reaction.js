import React from 'react'
import styled from '@emotion/styled'
import Popover from 'react-tiny-popover'
import { Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { EmojiPicker } from './emoji-picker'
import { PopoverBubble } from '../../../components/general/popover-bubble'
import { addReaction, removeReaction } from './socket-methods'
import { useGlobal } from '../../../context/global-context'
import { useAuth0 } from '../../../react-auth0-spa'
import { useUI } from '../../../main-content'
import { ReactComponent as SmilePlus } from '../../../assets/svgs/smile-plus.svg'

const ReactionWrapper = styled(Flex)`
    padding-top: 3px;
    max-width: ${props => (props.is_thread ? '200px' : '')}
    &:hover {
        cursor: pointer;
    }
`

const ReactionsBox = styled.div`
    border-radius: 12px;
    padding: 0px 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    font-weight: bold;

    background-color: ${props => (props.has_user ? 'var(light-purple)' : 'var(--grey-3)')};
    border: ${props => (props.has_user ? '2px solid var(--moon-blue)' : '2px solid var(--grey-3)')};

    transition: border 0.2s;
    &:hover {
        cursor: pointer;
        border: ${props => (props.has_user ? '2px solid var(--moon-blue)' : '2px solid var(--grey-2)')};
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

// TODO: improve this one day
const makeReactionText = (reaction_users, user_id, group_members) => {
    let text
    let has_user
    let other_users = ''
    let count = 0
    reaction_users.forEach(react_user => {
        count += 1
        if (react_user === user_id) has_user = true
        else {
            if (count >= 4) return
            const other_user = group_members.find(m => m.user_id === react_user)
            if (other_user) {
                other_users = other_users ? (other_users += `, ${other_user.nickname}`) : other_user.nickname
            }
        }
    })
    if (has_user) {
        const nr_of_user_reactions = reaction_users.length

        if (nr_of_user_reactions === 1) {
            text = 'You'
        } else {
            text = `You, ${other_users}`
        }
    }
    if (!has_user) {
        text = other_users
    }
    if (count >= 5) {
        const other_reactions = count - 4
        text = `${text} and ${other_reactions} other${count > 0 ? 's' : ''}`
    }
    return [text, has_user]
}

export const Reaction = React.memo(function({ reactions, message_idx, message_ref }) {
    const [showPicker, setShowPicker] = React.useState(false)
    const { active_group, group_members } = useGlobal()
    const { showMobileMenu, setSelectedMobileMessage, is_mobile } = useUI()
    const { user } = useAuth0()

    const sorted_reactions = sortEmojis(reactions)

    const onAddReaction = ({ native: emoji, colons: emoji_code }) => {
        addReaction({ emoji, emoji_code, ref: message_ref, group_id: active_group.id, user_id: user.sub })
        setShowPicker(false)
    }

    const handleClickReaction = (has_user, emoji, emoji_code) => {
        if (has_user) {
            const found_reaction = reactions.find(r => r.user === user.sub && r.emoji === emoji)
            if (found_reaction) {
                removeReaction({ message_id: message_ref, group_id: active_group.id, reaction_id: found_reaction._id })
            }
        } else {
            onAddReaction({ native: emoji, colons: emoji_code })
        }
    }

    const openEmojiSelector = () => {
        if (is_mobile) {
            showMobileMenu(true)
            setSelectedMobileMessage({ onAddReaction })
        } else {
            setShowPicker(!showPicker)
        }
    }

    return (
        <ReactionWrapper justify="flex-start" align="center">
            {sorted_reactions.map((r, idx) => {
                const [text, has_user] = makeReactionText(r.users, user.sub, group_members)
                return (
                    <PopoverBubble
                        key={r._id}
                        text={
                            <Text>
                                {text} <span>reacted with {r.emoji_code}</span>
                            </Text>
                        }
                    >
                        <ReactionsBox
                            has_user={has_user}
                            onClick={() => handleClickReaction(has_user, r.emoji, r.emoji_code)}
                        >
                            {r.emoji} <span style={{ fontSize: '12px' }}>{r.users.length}</span>
                        </ReactionsBox>
                    </PopoverBubble>
                )
            })}
            {!!reactions.length && (
                <Popover
                    isOpen={showPicker}
                    position={'top'} // preferred position
                    content={
                        <EmojiPicker
                            onSelectEmoji={onAddReaction}
                            closePicker={() => setShowPicker(false)}
                            showPicker={showPicker}
                        />
                    }
                >
                    <PopoverBubble text={<Text>Add reaction</Text>}>
                        <ReactionsBox style={{ width: is_mobile ? '40px' : '35px', height: '28px' }}>
                            <SmilePlus style={{ height: '29px', marginTop: '-3px' }} onClick={openEmojiSelector} />
                        </ReactionsBox>
                    </PopoverBubble>
                </Popover>
            )}
        </ReactionWrapper>
    )
})
