import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@chakra-ui/core'
import moment from 'moment'
import { Flex } from '../../../components/container'
import { useAuth0 } from '../../../react-auth0-spa'
import { HoverMenu } from './hover-menu'
import { ChatContext } from './chat-context'
import { Reaction } from './reaction'
import { Quote } from './quote'

const ChatContainer = styled(Flex)`
    margin-left: 15px;
    position: relative;
    padding: 5px 15px 5px 5px;
    transition: 0.1s;
    background-color: ${props =>
        props.this_menu_is_open ? 'var(--grey-hover)' : ''};

    &:hover {
        background-color: ${props =>
            props.a_menu_is_open ? '' : 'var(--grey-hover)'};
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
    const { active_message } = React.useContext(ChatContext)

    const a_menu_is_open = typeof active_message === 'number'
    const this_menu_is_open = a_menu_is_open && active_message === idx

    let should_show_menu = show_menu || this_menu_is_open
    if (a_menu_is_open && !this_menu_is_open) {
        should_show_menu = false
    }

    return (
        <ChatContainer
            justify="start"
            this_menu_is_open={this_menu_is_open}
            a_menu_is_open={a_menu_is_open}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
        >
            <ChatMessage message={message} idx={idx} measure={measure} />
            {should_show_menu && (
                <HoverMenu message_idx={idx} message={message} />
            )}
        </ChatContainer>
    )
})

const ChatMessage = React.memo(function({ message, idx, measure }) {
    const { user } = useAuth0()

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
                {!!message.replies.length && (
                    <LinkText>{message.replies.length} replies</LinkText>
                )}
            </Flex>
        </>
    )
})

// const AnimatedWrapper = styled.div`
//   max-width: 200px;
//   background-color: ${props => (props.has_color ? 'var(--primary)' : '')};
// `
const Content = ({ message, measure }) => {
    const {
        action,
        message: text,
        quote_text,
        quote_user,
        quote_created,
    } = message

    switch (action) {
        case 'message':
            return <Text textAlign="left">{text}</Text>
        case 'image':
            return <ImageStyled alt="received" src={text} onLoad={measure} />
        case 'multiple_image':
            const img_arr = text.split(',')
            return (
                <Flex justify="unset" wrap="wrap">
                    {img_arr.map((url, idx) => (
                        <ImageStyled
                            key={url}
                            maxh="100px"
                            m="10px"
                            alt="received"
                            src={url}
                            onLoad={measure}
                        />
                    ))}
                </Flex>
            )

        case 'animated':
            return (
                <Text textAlign="left">{text}</Text>
                // <AnimatedWrapper has_color={text === 'ok_boomer'}>
                //   <Lottie animationData={animated[text]} loop={true} />
                // </AnimatedWrapper>
            )
        case 'quote':
            return (
                <>
                    {quote_text && (
                        <Quote
                            user={quote_user}
                            text={quote_text}
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
