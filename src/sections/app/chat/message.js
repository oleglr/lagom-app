import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@chakra-ui/core'
import moment from 'moment'
import { Flex } from '../../../components/container'
import { ImagePreview } from '../../../components/general/image'
import { useAuth0 } from '../../../react-auth0-spa'
import { HoverMenu } from './hover-menu'
import { Reaction } from './reaction'
import { Quote } from './quote'

const ChatContainer = styled(Flex)`
    margin-left: 15px;
    position: relative;
    padding: 5px 15px 5px 5px;
    transition: 0.1s;

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
export const Message = React.memo(function({ message, idx, measure }) {
    const [show_menu, setShowMenu] = React.useState(false)

    return (
        <ChatContainer
            justify="start"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
        >
            <ChatMessage message={message} idx={idx} measure={measure} />
            {show_menu && <HoverMenu message_idx={idx} message={message} />}
        </ChatContainer>
    )
})

const ChatMessage = React.memo(function({ message, idx, measure }) {
    const { user } = useAuth0()
    const reply_length = message.replies.length

    return (
        <>
            <img
                src={user.picture}
                alt="Profile"
                style={{
                    borderRadius: '5px',
                    maxHeight: '45px',
                    marginTop: '4px',
                }}
            />
            <Flex column align="flex-start" justify="flex-start" pl="5px">
                <Text>
                    <Name className="bold">{message.user}</Name>{' '}
                    <span style={{ fontSize: '12px', color: 'var(--grey)' }}>
                        {moment(message.createdAt).format('LT')}
                    </span>
                </Text>
                <Content message={message} measure={measure} />
                {!!message.reactions.length && (
                    <Reaction
                        reactions={message.reactions}
                        message_idx={idx}
                        message_ref={message._id}
                    />
                )}
                {!!reply_length && (
                    <LinkText>
                        {reply_length} {reply_length > 1 ? 'replies' : 'reply'}
                    </LinkText>
                )}
            </Flex>
        </>
    )
})

const Content = ({ message, measure }) => {
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
