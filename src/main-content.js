import React from 'react'
import styled from '@emotion/styled'
import { Swipeable } from 'react-swipeable'
import { Emoji } from 'emoji-mart'
import { useMediaQuery } from 'react-responsive'
import { Modal, ModalOverlay, ModalContent, Text, Stack, Box } from '@chakra-ui/core'
import { EmojiPicker } from './sections/app/chat/emoji-picker'
import { ReactComponent as SmilePlusIcon } from './assets/svgs/smile-plus.svg'
import { ReactComponent as ReplyIcon } from './assets/svgs/reply.svg'

const MainContentStyle = styled.div`
    height: 100%;
    display: flex;
    overflow: scroll;
    flex-direction: ${props => (props.is_mobile ? 'column' : 'row')};
`

export const useUI = () => React.useContext(UIContext)

const UIContext = React.createContext({
    is_drawer_open: null,
    toggleDrawer: () => {},
})

export const MainContent = ({ children }) => {
    const [is_drawer_open, toggleDrawer] = React.useState(false)
    const [show_mobile_menu, showMobileMenu] = React.useState(false)
    const [selected_mobile_message, setSelectedMobileMessage] = React.useState({})
    const is_mobile = useMediaQuery({ query: '(max-width: 1000px)' })

    const openDrawer = () => {
        if (is_drawer_open) return
        toggleDrawer(true)
    }

    const closeDrawer = () => {
        if (!is_drawer_open) return
        toggleDrawer(false)
    }

    return (
        <Swipeable style={{ height: '100%' }} onSwipedRight={openDrawer} onSwipedLeft={closeDrawer}>
            <UIContext.Provider
                value={{
                    is_drawer_open,
                    toggleDrawer,
                    showMobileMenu,
                    setSelectedMobileMessage,
                    is_mobile,
                }}
            >
                <MainContentStyle is_mobile={is_mobile}>{children}</MainContentStyle>
                <MobileMenu
                    selected_mobile_message={selected_mobile_message}
                    show_mobile_menu={show_mobile_menu}
                    showMobileMenu={showMobileMenu}
                />
            </UIContext.Provider>
        </Swipeable>
    )
}

const EmojiBubble = styled.div`
    padding: 5px;
    border: solid 1px var(--grey-2);
    border-radius: 15px;
    background-color: var(--grey-3);
    display: flex;
    align-items: center;
    user-select: none;
`
const common_emoji_reactions = [
    { id: 'thumbsup', native: '👍', colons: ':+1:' },
    { id: 'pray', native: '🙏', colons: ':pray:' },
    { id: 'sweat_smile', native: '😅', colons: ':sweat_smile:' },
    { id: 'sob', native: '😭', colons: ':sob:' },
    { id: 'unicorn_face', native: '🦄', colons: ':unicorn_face:' },
]

const MobileMenu = ({ showMobileMenu, show_mobile_menu, selected_mobile_message }) => {
    const [status, setStatus] = React.useState('selection')
    const { onReply, onAddReaction } = selected_mobile_message

    React.useEffect(() => {
        if (!selected_mobile_message.onReply) {
            setStatus('picker_only')
        }
    }, [selected_mobile_message])

    const cleanup = () => {
        setStatus('selection')
        showMobileMenu(false)
    }

    const setReaction = ({ native, colons }) => {
        onAddReaction({ native, colons })
        cleanup()
    }

    return (
        <Modal size="xl" onClose={cleanup} isOpen={show_mobile_menu} isCentered>
            <ModalOverlay />
            <ModalContent backgroundColor={status === 'add_reaction' ? 'transparent' : ''}>
                {status === 'selection' && (
                    <Stack
                        backgroundColor="white"
                        spacing="16px"
                        pt="16px"
                        pb="16px"
                        mr="10px"
                        ml="10px"
                        borderRadius="5px"
                    >
                        <Stack isInline justify="space-evenly" mt="8px" pb="8px" borderBottom="1px solid var(--grey-2)">
                            {common_emoji_reactions.map(emoji => (
                                <EmojiBubble key={emoji.id}>
                                    <Emoji
                                        native={true}
                                        emoji={{ id: emoji.id, skin: 3 }}
                                        onClick={() => {
                                            onAddReaction({ native: emoji.native, colons: emoji.colons })
                                            cleanup()
                                        }}
                                        size={30}
                                    />
                                </EmojiBubble>
                            ))}
                            <EmojiBubble>
                                <div
                                    onClick={() => setStatus('add_reaction')}
                                    style={{
                                        width: '38px',
                                        borderTopRightRadius: '5px',
                                        borderBottomRightRadius: '5px',
                                    }}
                                >
                                    <SmilePlusIcon name="add" style={{ marginBottom: '3px', marginLeft: '5px' }} />
                                </div>
                            </EmojiBubble>
                        </Stack>
                        <Stack
                            onClick={() => {
                                onReply()
                                cleanup()
                            }}
                            isInline
                            align="center"
                            pl="16px"
                            pt="16px"
                            pb="8px"
                        >
                            <Box
                                color="black"
                                opacity="0.8"
                                as={ReplyIcon}
                                size="24px"
                                style={{ marginTop: '2px', marginRight: '2px' }}
                            />
                            <Text pl="8px" fontSize="24px" userSelect="none">
                                Reply
                            </Text>
                        </Stack>
                    </Stack>
                )}
                {(status === 'add_reaction' || status === 'picker_only') && (
                    <EmojiPicker
                        showPicker={true}
                        onSelectEmoji={setReaction}
                        closePicker={() => {
                            cleanup()
                        }}
                        is_mobile
                    />
                )}
            </ModalContent>
        </Modal>
    )
}
