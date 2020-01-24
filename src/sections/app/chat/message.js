import React from 'react'
import styled from '@emotion/styled'
import { Text, Stack } from '@chakra-ui/core'
import moment from 'moment'
import { useAuth0 } from '../../../react-auth0-spa'
import { useUI } from '../../../main-content'
import { useLongPress } from '../../../components/hooks/on-press'
import { Flex } from '../../../components/container'
import { ImagePreview } from '../../../components/general/image'
import { useGlobal } from '../../../context/global-context'
import { ChatContext } from './chat-context'
import { HoverMenu } from './hover-menu'
import { Reaction } from './reaction'
import { Quote } from './quote'
import { addReaction } from './socket-methods'

const ChatContainer = styled(Flex)`
    margin-left: 15px;
    padding: 5px 15px 5px 5px;
    transition: 0.1s;
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
    max-height: ${props => (props.maxh ? props.maxh : '200px')};
    max-width: ${props => (props.maxh ? props.maxw : '200px')};
    margin: ${props => (props.m ? props.m : '')};
    transition: all 0.2s;
    &:hover {
        cursor: pointer;
        filter: brightness(0.5);
    }
`

const ImagePlaceholder = styled.div`
    border-radius: 5px;
    background-color: var(--grey-3);
    filter: blur(2px);
    height: ${props => (props.height ? props.height : '200px')};
    width: ${props => (props.width ? props.width : '200px')};
    margin: ${props => (props.margin ? props.margin : '')};
`

const HoverWrapper = styled.span`
    visibility: ${props => (props.show_menu ? 'visible' : 'hidden')};
`
const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: #dddddd;
`
const LinkText = styled(Text)`
    &:hover {
        cursor: pointer;
        color: var(--primary);
    }
`

const formatDate = date => {
    if (!date) return undefined

    const is_today = moment().isSame(date, 'day')
    if (is_today) return 'Today'

    const is_yesterday = moment()
        .subtract(1, 'days')
        .isSame(date, 'day')
    if (is_yesterday) return 'Yesterday'
    else return date.format('ll')
}

function hasDateDivider(message_date, all_messages, message_idx) {
    const previous_message = all_messages[message_idx - 1]
    if (!previous_message || !previous_message.createdAt) return false

    const prev_date = formatDate(moment(previous_message.createdAt))
    const date = formatDate(moment(message_date))

    if (date !== prev_date) return date
    return false
}

export const Message = React.memo(function({ all_items, message, idx, measure, isScrolling }) {
    const [show_menu, setShowMenu] = React.useState(false)
    const { is_mobile } = useUI()

    const handleEnter = () => {
        if (is_mobile) return
        setShowMenu(true)
    }
    const handleLeave = () => {
        if (is_mobile) return
        setShowMenu(false)
    }

    const date_divider = hasDateDivider(message.createdAt, all_items, idx)

    return (
        <div>
            {date_divider && (
                <Stack isInline align="center">
                    <Divider />
                    <Text textAlign="center" fontSize="14px" fontWeight="500" minWidth="fit-content">
                        {date_divider}
                    </Text>
                    <Divider />
                </Stack>
            )}
            <ChatContainer justify="start" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <ChatMessage
                    showMenu={setShowMenu}
                    show_menu={show_menu}
                    isScrolling={isScrolling}
                    message={message}
                    idx={idx}
                    measure={measure}
                />
                <HoverWrapper show_menu={show_menu}>
                    <HoverMenu message_idx={idx} message={message} />
                </HoverWrapper>
            </ChatContainer>
        </div>
    )
})

export const ChatMessage = React.memo(function({ showMenu, show_menu, message, idx, measure, isScrolling }) {
    const { getUser, active_group } = useGlobal()
    const { showMobileMenu, setSelectedMobileMessage, is_mobile } = useUI()
    const { setQuotedMessage } = React.useContext(ChatContext)
    const { user } = useAuth0()

    const onAddReaction = ({ native: emoji, colons: emoji_code }) => {
        addReaction({ emoji, emoji_code, ref: message._id, group_id: active_group.id, user_id: user.sub })
    }

    const onPress = useLongPress(() => {
        if (!is_mobile) return
        showMobileMenu(true)
        setSelectedMobileMessage({ onReply: () => setQuotedMessage(message), onAddReaction })
    }, 300)

    const message_user = getUser(message.user)

    return (
        <>
            {isScrolling ? (
                <ImagePlaceholder height="45px" width="50px" margin="4px 0 0 0" />
            ) : (
                <img
                    src={message_user.img}
                    alt="Profile"
                    style={{
                        borderRadius: '5px',
                        maxHeight: '45px',
                        height: '45px',
                        width: '45px',
                        maxWidth: '45px',
                        marginTop: '4px',
                        backgroundColor: 'coral',
                    }}
                    height="45px"
                    width="45px"
                />
            )}
            <Flex {...onPress} column align="flex-start" justify="flex-start" pl="5px">
                <Text>
                    <Name className="bold">{message_user.name}</Name>{' '}
                    <span style={{ fontSize: '12px', color: 'var(--grey)' }}>
                        {moment(message.createdAt).format('LT')}
                    </span>
                </Text>
                <Content message={message} measure={measure} isScrolling={isScrolling} />
                <Reaction reactions={message.reactions} message_idx={idx} message_ref={message._id} />
            </Flex>
        </>
    )
})

const Link = ({ text }) => {
    // TODO: fetch link metadata
    // React.useEffect(() => {
    //     console.log('fetch: ', text)
    //     fetch('http://localhost:3002/?url=http://google.com/')
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log(data)
    //         })
    // }, [text])

    return (
        <LinkText as="a" color="blue.500" href={text} target="_blank">
            {text}
        </LinkText>
    )
}
export const Content = ({ message, measure, is_thread, isScrolling }) => {
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
        case 'link':
            return <Link text={text} />
        case 'image':
            return (
                <>
                    <Text textAlign="left">{text}</Text>
                    {isScrolling ? (
                        <ImagePlaceholder height="200px" width="200px" margin="10px" />
                    ) : (
                        <ImagePreview img_source={image_url}>
                            <ImageStyled
                                maxh={is_thread ? '100px' : '200px'}
                                alt="received"
                                src={image_url}
                                height="200px"
                                width="200px"
                                m="10px"
                            />
                        </ImagePreview>
                    )}
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
                                {isScrolling ? (
                                    <ImagePlaceholder height="100px" width="100px" margin="10px" />
                                ) : (
                                    <ImageStyled
                                        maxh="100px"
                                        maxw={is_thread ? '100px' : null}
                                        m="10px"
                                        alt="received"
                                        src={url}
                                        height="100px"
                                        width="100px"
                                        // onLoad={measure}
                                    />
                                )}
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
