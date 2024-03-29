import React from 'react'
import styled from '@emotion/styled'
import { FormControl, Icon, Button, Stack } from '@chakra-ui/core'
import { EmojiPicker } from './emoji-picker'
import { ChatContext } from './chat-context'
import { Quote } from './quote'
import { Upload } from './upload-file'
import { Flex } from '../../../components/container'
import { useUI } from '../../../main-content'
import { useKeyDown } from '../../../components/hooks/keydown'

function isUrl(str) {
    var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ) // fragment locator
    return !!pattern.test(str)
}

const InputContainer = styled.div`
    padding-right: ${props => (props.is_mobile ? '' : '20px')};
    margin: ${props => (props.is_mobile ? '' : '10px 20px 30px 20px')};
    position: relative;
`

const EmojiWrapper = styled.span`
    position: absolute;
    right: ${props => (props.is_mobile ? '17%' : '35px')};
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

const ChatEditableInput = styled.div`
    padding-left: 38px;
    padding-right: 38px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    margin-left: 5px;
    text-align: left;
    word-break: break-word;
    white-space: break-spaces !important;
    outline: none;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    -webkit-user-modify: read-write-plaintext-only;
    transition: all 0.2s ease 0s;
    outline: none;
    border-radius: 0.25rem;
    border-width: 1px;
    border-style: solid;
    border-image: initial;
    border-color: rgb(0, 0, 0);
    user-select: text;

    &:empty:not(:focus)::before {
        content: attr(data-ph);
        color: var(--grey);
    }

    &:focus {
        box-shadow: rgb(49, 130, 206) 0px 0px 0px 1px;
        border-color: rgb(49, 130, 206);
    }
`

function placeCaretAtEnd(el) {
    el.focus()
    if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
        var range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)
        var sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
    } else if (typeof document.body.createTextRange != 'undefined') {
        var textRange = document.body.createTextRange()
        textRange.moveToElementText(el)
        textRange.collapse(false)
        textRange.select()
    }
}

export const ChatInput = ({ onSend, is_thread, thread_message_id }) => {
    const [emoji, setEmoji] = React.useState('😀')
    const [showEmojiBox, setShowEmojiBox] = React.useState(false)
    const [paste_file, setPasteFile] = React.useState('')
    const input_ref = React.useRef()

    const { quoted_message, setQuotedMessage } = React.useContext(ChatContext)
    const { is_mobile } = useUI()

    useKeyDown(input_ref, onSubmit, 13, is_mobile)

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

    const addEmojiToText = emoji => {
        input_ref.current.insertAdjacentHTML('beforeend', emoji.native)
        setShowEmojiBox(false)
        placeCaretAtEnd(input_ref.current)
    }

    function onSubmit(e) {
        if (e) e.preventDefault()
        if (!input_ref || !input_ref.current) return

        const message_to_send = input_ref.current.innerText.trim()
        if (!message_to_send) return

        let action = 'message'
        let ref = null

        const is_quote = !!quoted_message
        if (is_quote) {
            action = 'quote'
            ref = quoted_message._id
        }
        if (isUrl(message_to_send)) {
            action = 'link'
        }

        onSend({ message: message_to_send, action, ref })
        input_ref.current.innerHTML = ''

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
                            <ChatEditableInput
                                style={{ width: '100%', minHeight: '46px' }}
                                contentEditable="true"
                                aria-multiline="true"
                                spellcheck="true"
                                role="textbox"
                                id="main-input"
                                data-lpignore="true"
                                data-ph={'Type a message'}
                                onPaste={onPaste}
                                ref={input_ref}
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
                                <Stack justify="flex-end" padding="0 5px 5px">
                                    <Button height="48px" type="submit" variantColor="teal">
                                        >
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                        {showEmojiBox && (
                            <EmojiBoxWrapper>
                                <EmojiPicker
                                    is_mobile={is_mobile}
                                    showPicker={showEmojiBox}
                                    onSelectEmoji={addEmojiToText}
                                    has_custom={false}
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
