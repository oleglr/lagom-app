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
import { getSocket as socket } from '../../../api/socket'

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
  max-height: 250px;
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
export const Message = ({ message, idx, measure }) => {
  const { user } = useAuth0()
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
      <ChatMessage user={user} message={message} idx={idx} measure={measure} />
      {should_show_menu && <HoverMenu message_idx={idx} message={message} />}
    </ChatContainer>
  )
}

const ChatMessage = ({ user, message, idx, measure }) => {
  return (
    <>
      <img
        src={user.picture}
        alt="Profile"
        style={{ borderRadius: '5px', maxHeight: '45px', marginTop: '4px' }}
      />
      <Flex column align="flex-start" justify="flex-start" pl="5px">
        <Text>
          <Name className="bold">{user.name}</Name>{' '}
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
}

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
