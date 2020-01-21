import React from 'react'
import { useHistory } from 'react-router-dom'
import {
    Avatar,
    Stack,
    Text,
    Button,
    // AvatarBadge,
} from '@chakra-ui/core'
import { PopoverBubble } from '../../../components/general/popover-bubble'
import { useGlobal } from '../../../context/global-context'

export const GroupAvatars = ({ onClose }) => {
    const { group_members } = useGlobal()
    const history = useHistory()

    let show_more, more_members
    if (group_members.length > 12) {
        show_more = true
        more_members = group_members.length - 12
    }

    return (
        <>
            <div>
                <Stack
                    align="center"
                    isInline
                    marginLeft="8px"
                    flexWrap="wrap"
                    maxWidth="250px"
                    maxHeight="250px"
                    overflow="scroll"
                >
                    {group_members.slice(0, 12).map(m => (
                        <PopoverBubble key={m.user_id} text={<Text>{m.nickname}</Text>}>
                            <Avatar margin="2px" src={m.picture} size="sm">
                                {/* <AvatarBadge border="0.1em solid" borderColor="papayawhip" bg="green.400" size="1em" /> */}
                            </Avatar>
                        </PopoverBubble>
                    ))}
                    {show_more && (
                        <Text fontSize="12px" margin="2px" color="#fff">
                            ...and {more_members} more
                        </Text>
                    )}
                </Stack>
            </div>
            <Button
                onClick={() => {
                    if (onClose) onClose()
                    history.push('/invite')
                }}
                size="xs"
                variantColor="teal"
                marginTop="16px"
                marginLeft="8px"
                width="100px"
            >
                Add members
            </Button>
        </>
    )
}
