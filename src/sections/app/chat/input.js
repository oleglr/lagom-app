import React from 'react'
import styled from '@emotion/styled'
import { FormControl, Icon, Input } from '@chakra-ui/core'
import { EmojiPicker } from './emoji-picker'
import { ChatContext } from './chat-context'
import { Quote } from './quote'
import { Upload } from './upload-file'
import { Flex } from '../../../components/container'

const InputContainer = styled.div`
    padding-right: ${props => (props.is_thread ? '' : '20px')};
    margin: ${props => (props.is_thread ? '' : '10px 20px 30px 20px')};
    position: relative;
`

const EmojiWrapper = styled.span`
    position: absolute;
    right: ${props => (props.is_thread ? '13px' : '27px')};
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

export const ChatInput = ({ onSend, is_thread, thread_message_id }) => {
    const [emoji, setEmoji] = React.useState('😀')
    const [showEmojiBox, setShowEmojiBox] = React.useState(false)
    const [message, setMessage] = React.useState('')

    const { quoted_message, setQuotedMessage } = React.useContext(ChatContext)

    React.useEffect(() => {
        const handleUserKeyPress = e => {
            if (e.keyCode === 27) {
                setQuotedMessage('')
            }
        }
        window.addEventListener('keydown', handleUserKeyPress)
        document.getElementById('main-input').focus()

        return () => {
            window.removeEventListener('keydown', handleUserKeyPress)
        }
    }, [setQuotedMessage])

    const onWriteMessage = e => {
        setMessage(e.target.value)
    }

    const addEmojiToText = emoji => {
        setMessage(message + '' + emoji.native)
        setShowEmojiBox(false)
        document.getElementById('main-input').focus()
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
        onSend({ message, action, ref })
        setMessage('')
    }
    const setShowEmojiPicker = show => {
        setShowEmojiBox(show)
    }

    return (
        <>
            <FormControl width="100%" mr="10px">
                {quoted_message && (
                    <QuoteContainer justify="unset" height="unset" align="center">
                        <Quote
                            w="89%"
                            action={quoted_message.action}
                            text={quoted_message.message}
                            user={quoted_message.user}
                            image_url={quoted_message.image_url}
                        />
                        <QuoteIcon onClick={() => setQuotedMessage('')}>
                            <Icon name="close" size="14px" />
                        </QuoteIcon>
                    </QuoteContainer>
                )}
                <InputContainer is_thread={is_thread}>
                    <Upload is_thread={is_thread} thread_message_id={thread_message_id} />
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
                            id="main-input"
                        />
                        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
                        <EmojiWrapper
                            onMouseEnter={() => {
                                if (showEmojiBox) return
                                setEmoji(emoji_array[Math.floor(Math.random() * emoji_array.length)])
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
                                    closePicker={() => {
                                        setShowEmojiPicker(false)
                                        document.getElementById('main-input').focus()
                                    }}
                                />
                            </EmojiBoxWrapper>
                        )}
                    </form>
                </InputContainer>
            </FormControl>
        </>
    )
}
