import React from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
} from '@chakra-ui/core'
import { ChatContext } from './chat-context'
import { ChatInput } from './input'
import { ThreadFeed } from './thread-feed'
import { getSocket as socket } from '../../../api/socket'
import { useAuth0 } from '../../../react-auth0-spa'

export const ThreadDrawer = () => {
    const { thread_message, setThreadMessage } = React.useContext(ChatContext)
    const { user } = useAuth0()

    const sendThreadMessage = ({ action, ref, message }) => {
        socket().emit(
            'thread message',
            {
                message_id: thread_message._id,
                group_id: '5df5c5b8aec1710635f037c4',
                user_id: 'anonymous',
                message: {
                    message,
                    action,
                    user: user.name,
                    ref,
                },
            },
            e => {
                console.log('e: ', e)
            }
        )
    }

    return (
        <Drawer
            isOpen={!!thread_message}
            placement="right"
            onClose={() => setThreadMessage(null)}
            size="md"
            // finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            {thread_message && (
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Thread</DrawerHeader>

                    <DrawerBody>
                        <div
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            <ThreadFeed message_id={thread_message._id} />
                        </div>
                    </DrawerBody>
                    <DrawerFooter>
                        <ChatInput
                            is_thread={true}
                            onSend={sendThreadMessage}
                        />
                        <Button variantColor="teal">Send</Button>
                    </DrawerFooter>
                </DrawerContent>
            )}
        </Drawer>
    )
}
