import React from 'react'
import styled from '@emotion/styled'
import { FormControl, Icon, Input, Button, Stack } from '@chakra-ui/core'
import { EmojiPicker } from './emoji-picker'
import { ChatContext } from './chat-context'
import { Quote } from './quote'
import { Upload } from './upload-file'
import { Flex } from '../../../components/container'
import { useUI } from '../../../main-content'

const InputContainer = styled.div`
    padding-right: ${props => (props.is_mobile ? '' : '20px')};
    margin: ${props => (props.is_mobile ? '5px' : '10px 20px 30px 20px')};
    position: relative;
`

const EmojiWrapper = styled.span`
    position: absolute;
    right: ${props => (props.is_mobile ? '22%' : '35px')};
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
    margin: ${props => (props.is_mobile ? '5px' : '5px 30px 0 20px')};
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
    const [paste_file, setPasteFile] = React.useState('')

    const { quoted_message, setQuotedMessage } = React.useContext(ChatContext)
    const { is_mobile } = useUI()

    React.useEffect(() => {
        const handleUserKeyPress = e => {
            if (e.keyCode === 27) {
                setQuotedMessage('')
            }
        }
        window.addEventListener('keydown', handleUserKeyPress)
        if (!is_mobile) document.getElementById('main-input').focus()

        return () => {
            window.removeEventListener('keydown', handleUserKeyPress)
        }
    }, [setQuotedMessage, is_mobile])

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
        if (!is_mobile) document.getElementById('main-input').focus()
    }

    const onPaste = e => {
        if (e.clipboardData.files.length) {
            setPasteFile(e.clipboardData.files)
        }
    }

    const setShowEmojiPicker = show => setShowEmojiBox(show)

    return (
        <>
            <FormControl width="100%" mr="10px">
                {quoted_message && (
                    <QuoteContainer is_mobile={is_mobile} justify="unset" height="unset" align="center">
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
                <InputContainer is_mobile={is_mobile}>
                    <Upload paste_file={paste_file} is_thread={is_thread} thread_message_id={thread_message_id} />
                    <form onSubmit={onSubmit}>
                        <Stack isInline>
                            <Input
                                data-lpignore="true"
                                value={message}
                                onChange={onWriteMessage}
                                onPaste={onPaste}
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
                                is_mobile={is_mobile}
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
                            {is_mobile && (
                                <Button height="48px" type="submit" variantColor="teal">
                                    Send
                                </Button>
                            )}
                        </Stack>
                        {showEmojiBox && (
                            <EmojiBoxWrapper>
                                <EmojiPicker
                                    showPicker={showEmojiBox}
                                    onSelectEmoji={addEmojiToText}
                                    closePicker={() => {
                                        setShowEmojiPicker(false)
                                        if (!is_mobile) document.getElementById('main-input').focus()
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
