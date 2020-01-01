import React from 'react'
import styled from '@emotion/styled'
import { FormControl, Icon, Input } from '@chakra-ui/core'
import { EmojiPicker } from './emoji-picker'
import { ChatContext } from './chat-context'
import { Quote } from './quote'
import { Upload } from './upload-file'
import { Flex } from '../../../components/container'
import { getSocket as socket } from '../../../api/socket'
import { useAuth0 } from '../../../react-auth0-spa'

const InputContainer = styled.div`
    padding-right: 20px;
    margin: 10px 20px 30px 20px;
    position: relative;
`
const EmojiWrapper = styled.span`
    position: absolute;
    right: 27px;
    top: 11px;
    font-size: 18px;
    transition: all 0.2s ease-in-out;

    &:hover {
        cursor: pointer;
        transform: scale(1.1);
        opacity: 1;
    }
    transform: ${props => (props.is_active ? 'scale(1.1)' : '')};
    opacity: ${props => (props.is_active ? '1' : '0.8')};
`

const EmojiBoxWrapper = styled.div`
    position: absolute;
    top: -359px;
    right: 20px;
`
const emoji_array = ['😈', '😇', '😉', '😎', '😓', '😱', '🤢', '🤪', '🧐', '🙄']

const QuoteContainer = styled(Flex)`
    margin: 5px 30px 0 20px;
`
const QuoteIcon = styled.div`
    margin-left: 10px;

    &:hover {
        cursor: pointer;
    }
`

export const ChatInput = () => {
    const [emoji, setEmoji] = React.useState('😀')
    const [showEmojiBox, setShowEmojiBox] = React.useState(false)
    const [message, setMessage] = React.useState('')
    const { user } = useAuth0()

    const { quoted_message, setQuotedMessage } = React.useContext(ChatContext)

    const onWriteMessage = e => {
        setMessage(e.target.value)
    }

    const addEmojiToText = emoji => {
        setMessage(message + '' + emoji.native)
    }

    const onSubmit = e => {
        e.preventDefault()
        if (!message) return

        let action = 'message'
        let ref = null

        const is_quote = !!quoted_message
        if (is_quote) {
            action = 'quote'
            ref = quoted_message._id
        }

        socket().emit(
            'message',
            {
                message,
                action,
                ref,
                group_id: '5df5c5b8aec1710635f037c4',
                user: user.name,
            },
            e => {
                console.log('e: ', e)
            }
        )
        setMessage('')
        setQuotedMessage('')
    }
    const setShowEmojiPicker = show => {
        setShowEmojiBox(show)
    }

    return (
        <FormControl>
            {quoted_message && (
                <QuoteContainer justify="unset" height="unset" align="center">
                    <Quote
                        w="89%"
                        action={quoted_message.action}
                        text={quoted_message.message}
                        user={quoted_message.user}
                    />
                    <QuoteIcon onClick={() => setQuotedMessage('')}>
                        <Icon name="close" size="14px" />
                    </QuoteIcon>
                </QuoteContainer>
            )}
            <InputContainer>
                <Upload />
                <form onSubmit={onSubmit}>
                    <Input
                        data-lpignore="true"
                        value={message}
                        onChange={onWriteMessage}
                        aria-label="Message input"
                        placeholder="Message SJ friends"
                        type="text"
                        borderColor="black"
                        paddingLeft="43px"
                        paddingRight="43px"
                        height="3rem"
                    />
                    {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
                    <EmojiWrapper
                        onMouseEnter={() => {
                            if (showEmojiBox) return
                            setEmoji(
                                emoji_array[
                                    Math.floor(
                                        Math.random() * emoji_array.length
                                    )
                                ]
                            )
                        }}
                        is_active={showEmojiBox}
                        onClick={() => {
                            setShowEmojiPicker(!showEmojiBox)
                        }}
                        aria-label="emoji"
                        role="img"
                    >
                        {emoji}
                    </EmojiWrapper>
                    {showEmojiBox && (
                        <EmojiBoxWrapper>
                            <EmojiPicker
                                showPicker={showEmojiBox}
                                onSelectEmoji={addEmojiToText}
                                closePicker={() => setShowEmojiPicker(false)}
                            />
                        </EmojiBoxWrapper>
                    )}
                </form>
            </InputContainer>
        </FormControl>
    )
}
