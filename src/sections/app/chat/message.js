import React from 'react'
import styled from '@emotion/styled'
import { Text, Stack } from '@chakra-ui/core'
import moment from 'moment'
import Hammer from 'react-hammerjs'
import { Flex } from '../../../components/container'
import { ImagePreview } from '../../../components/general/image'
import { useGlobal } from '../../../context/global-context'
import { ChatContext } from './chat-context'
import { HoverMenu } from './hover-menu'
import { Reaction } from './reaction'
import { Quote } from './quote'

const ChatContainer = styled(Flex)`
    margin-left: 15px;
    padding: 5px 15px 5px 5px;
    transition: 0.1s;
    height: unset;
    min-width: 100%;

    &:hover {
        background-color: var(--grey-hover);
    }
`
const Name = styled.span`
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`
const ImageStyled = styled.img`
    border-radius: 5px;
    max-height: ${props => (props.maxh ? props.maxh : '250px')};
    max-width: ${props => (props.maxh ? props.maxw : '250px')};
    margin: ${props => (props.m ? props.m : '')};
    transition: all 0.2s;

    &:hover {
        cursor: pointer;
        filter: brightness(0.5);
    }
`
const LinkText = styled(Text)`
    font-size: 13px;
    color: var(--rose-red);
    font-weight: bold;

    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`
const HoverWrapper = styled.span`
    visibility: ${props => (props.show_menu ? 'visible' : 'hidden')};
`
const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: #dddddd;
`
export const Message = React.memo(function({ message, idx, measure, is_thread }) {
    const [show_menu, setShowMenu] = React.useState(false)

    if (message.date)
        return (
            <Stack isInline align="center">
                <Divider />
                <Text textAlign="center" fontSize="14px" fontWeight="500" minWidth="fit-content">
                    {message.date}
                </Text>
                <Divider />
            </Stack>
        )

    return (
        <ChatContainer justify="start" onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
            <ChatMessage
                showMenu={setShowMenu}
                show_menu={show_menu}
                is_thread={is_thread}
                message={message}
                idx={idx}
                measure={measure}
            />
            <HoverWrapper show_menu={show_menu}>
                <HoverMenu message_idx={idx} message={message} is_thread={is_thread} />
            </HoverWrapper>
        </ChatContainer>
    )
})

export const ChatMessage = React.memo(function({ showMenu, show_menu, message, idx, measure, is_thread }) {
    const { getUser } = useGlobal()
    const { setThreadMessage } = React.useContext(ChatContext)
    const reply_length = message.replies && message.replies.length
    const user = getUser(message.user)

    const handlePress = () => {
        showMenu(!show_menu)
    }

    return (
        <>
            <img
                src={user.img}
                alt="Profile"
                style={{
                    borderRadius: '5px',
                    maxHeight: '45px',
                    maxWidth: '45px',
                    marginTop: '4px',
                    backgroundColor: 'coral',
                }}
            />
            <Hammer onPress={handlePress}>
                <Flex column align="flex-start" justify="flex-start" pl="5px">
                    <Text>
                        <Name className="bold">{user.name}</Name>{' '}
                        <span style={{ fontSize: '12px', color: 'var(--grey)' }}>
                            {moment(message.createdAt).format('LT')}
                        </span>
                    </Text>
                    <Content message={message} measure={measure} is_thread={is_thread} />
                    <Reaction
                        is_thread={is_thread}
                        reactions={message.reactions}
                        message_idx={idx}
                        message_ref={message._id}
                    />
                    {!!reply_length && !is_thread && (
                        <LinkText onClick={() => setThreadMessage(message)}>
                            {reply_length} {reply_length > 1 ? 'replies' : 'reply'}
                        </LinkText>
                    )}
                </Flex>
            </Hammer>
        </>
    )
})

export const Content = ({ message, measure, is_thread }) => {
    const {
        action,
        image_url,
        message: text,
        t_action: quote_action,
        t_message: quote_text,
        t_user: quote_user,
        t_createdAt: quote_created,
    } = message

    switch (action) {
        case 'message':
            return <Text textAlign="left">{text}</Text>
        case 'image':
            return (
                <>
                    <Text textAlign="left">{text}</Text>
                    <ImagePreview img_source={image_url}>
                        <ImageStyled
                            maxh={is_thread ? '100px' : '200px'}
                            m="10px"
                            alt="received"
                            src={image_url}
                            onLoad={measure}
                        />
                    </ImagePreview>
                </>
            )
        case 'multiple_image':
            const img_arr = image_url.split(',')
            return (
                <>
                    <Text textAlign="left">{text}</Text>
                    <Flex justify="unset" wrap="wrap">
                        {img_arr.map(url => (
                            <ImagePreview img_source={url} key={url}>
                                <ImageStyled
                                    maxh="100px"
                                    maxw={is_thread ? '100px' : null}
                                    m="10px"
                                    alt="received"
                                    src={url}
                                    onLoad={measure}
                                />
                            </ImagePreview>
                        ))}
                    </Flex>
                </>
            )
        case 'quote':
            return (
                <>
                    {quote_text && (
                        <Quote
                            action={quote_action}
                            measure={measure}
                            user={quote_user}
                            text={quote_text}
                            image_url={image_url}
                            time={moment(quote_created).format('lll')}
                        />
                    )}
                    <Text textAlign="left">{text}</Text>
                </>
            )
        default:
            return null
    }
}
