import React from 'react'
import moment from 'moment'
import styled from '@emotion/styled'
import {
    Box,
    Stack,
    Text,
    Badge,
    Checkbox,
    Button,
    Input,
    useToast,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/core'
import { useGlobal } from '../../../context/global-context'
import { useAuth0 } from '../../../react-auth0-spa'
import { getSocket as socket } from '../../../api/socket'

const ImageCard = styled(Box)`
    &:hover {
        cursor: pointer;
        .media-img {
            filter: brightness(0.5);
        }
    }
`

const MAX_LIST_ITEM_LENGTH = 300
const MAX_LIST_ITEMS = 20

const too_long_list_item_toast = {
    title: 'Cannot add the item to the list',
    description: `Keep it shorter than ${MAX_LIST_ITEM_LENGTH} characters`,
    status: 'error',
    duration: 3000,
    isClosable: true,
    position: 'top-right',
}

const too_many_list_item_toast = {
    title: `Only ${MAX_LIST_ITEMS} items per list allowed on free accounts`,
    description: `To have more items please upgrade to premium account`,
    status: 'error',
    duration: 9000,
    isClosable: true,
    position: 'top-right',
}

const BucketListCard = ({ todo_list, deleteList }) => {
    const [status, setStatus] = React.useState('initial_view')
    const [new_list_item_text, setNewText] = React.useState('')
    const [edit_list_item_text, setEditedText] = React.useState('')

    const { active_group } = useGlobal()
    const { user } = useAuth0()
    const toast = useToast()

    const onNewListItem = () => {
        setStatus('add_new_item')
    }

    const onSetNewText = e => {
        setNewText(e.target.value)
    }

    const addNewListIem = () => {
        if (!new_list_item_text) return
        if (new_list_item_text.length >= MAX_LIST_ITEM_LENGTH) {
            toast(too_long_list_item_toast)
            return
        }
        if (todo_list.list_items.length > MAX_LIST_ITEMS) {
            toast(too_many_list_item_toast)
            return
        }
        socket().emit(
            'add_new_list_item',
            {
                group_id: active_group.id,
                list_id: todo_list._id,
                text: new_list_item_text,
                user_id: user.sub,
            },
            e => {
                console.log(e)
            }
        )
        setStatus('initial_view')
    }

    const editListText = text_id => {
        if (!edit_list_item_text) return
        if (edit_list_item_text.length >= MAX_LIST_ITEM_LENGTH) {
            toast(too_long_list_item_toast)
            return
        }

        socket().emit(
            'edit_list_item',
            {
                group_id: active_group.id,
                list_id: todo_list._id,
                text: edit_list_item_text,
                text_id,
                user_id: user.sub,
            },
            e => {
                console.log(e)
            }
        )
        setStatus('initial_view')
    }

    const deleteItem = text_id => {
        socket().emit(
            'delete_list_item',
            {
                group_id: active_group.id,
                list_id: todo_list._id,
                text_id,
            },
            e => {
                console.log(e)
            }
        )
        setStatus('initial_view')
    }

    const toggleListItem = (text_id, status) => {
        let send_status = 'complete'
        if (status === 'complete') {
            send_status = 'pending'
        }

        socket().emit(
            'toggle_list_item',
            {
                group_id: active_group.id,
                list_id: todo_list._id,
                text_id,
                user_id: user.sub,
                status: send_status,
            },
            e => {
                console.log(e)
            }
        )
    }

    return (
        <ImageCard
            key={todo_list._id}
            maxWidth="600px"
            borderWidth="1px"
            rounded="lg"
            overflow="hidden"
            margin="5px"
            height="fit-content"
        >
            <Stack isInline justify="space-between">
                <Text>{todo_list.name}</Text>
                {todo_list.label && <Badge>{todo_list.label}</Badge>}
                <Popover>
                    <PopoverTrigger>
                        <Button>Delete</Button>
                    </PopoverTrigger>
                    <PopoverContent zIndex={4}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Delete {todo_list.name}?</PopoverHeader>
                        <PopoverBody>Deleting a list is permanent and there is no way to get it back.</PopoverBody>
                        <Button variantColor="red" onClick={() => deleteList(todo_list._id, todo_list.name)}>
                            Delete list
                        </Button>
                    </PopoverContent>
                </Popover>
            </Stack>
            <Box p="5px" maxHeight="98px">
                <Box maxWidth="180px" as="div" color="gray.600" fontSize="sm">
                    {moment(todo_list.createdAt).format('ll')}
                </Box>
            </Box>
            <Stack>
                {todo_list.list_items.map((todo, idx) => {
                    return (
                        <Stack key={idx} isInline justify="space-between">
                            <Stack isInline align="center">
                                <Checkbox
                                    onChange={() => toggleListItem(todo._id, todo.status)}
                                    isChecked={todo.status === 'complete'}
                                    size="lg"
                                    variantColor="green"
                                />
                                {status !== idx && (
                                    <Text
                                        onClick={() => {
                                            setStatus(idx)
                                            setEditedText(todo.text)
                                        }}
                                    >
                                        {todo.text}
                                    </Text>
                                )}
                                {status === idx && (
                                    <Stack>
                                        <Input
                                            value={edit_list_item_text}
                                            type="text"
                                            id="edit_text"
                                            onChange={e => setEditedText(e.target.value)}
                                        />
                                        <Stack isInline>
                                            <Button onClick={() => editListText(todo._id)}>Save</Button>
                                            <div onClick={() => setStatus('initial_view')}>X</div>
                                        </Stack>
                                    </Stack>
                                )}
                            </Stack>
                            {status !== idx && <Button onClick={() => deleteItem(todo._id)}>delete</Button>}
                        </Stack>
                    )
                })}
            </Stack>
            {status === 'add_new_item' && (
                <Stack>
                    <Input type="text" id="new_list_item_text" value={new_list_item_text} onChange={onSetNewText} />
                    <Stack isInline>
                        <Button onClick={addNewListIem}>Add</Button>
                        <div onClick={() => setStatus('initial_view')}>X</div>
                    </Stack>
                </Stack>
            )}
            {status === 'initial_view' && <Button onClick={onNewListItem}>Add an item</Button>}
        </ImageCard>
    )
}

class List extends React.Component {
    render() {
        return (
            <div>
                {this.props.items.map((item, idx) => (
                    <BucketListCard deleteList={this.props.deleteList} key={idx} todo_list={item} />
                ))}
            </div>
        )
    }
}

export { List }
