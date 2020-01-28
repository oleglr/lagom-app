import React from 'react'
import moment from 'moment'
import styled from '@emotion/styled'
import {
    Box,
    Stack,
    Text,
    Heading,
    Badge,
    Checkbox,
    Button,
    Input,
    IconButton,
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
import { PopoverBubble } from '../../../components/general/popover-bubble'

const MAX_LIST_ITEM_LENGTH = 300
const MAX_LIST_ITEMS = 20

const CheckListItem = styled(Stack)`
    margin-bottom: 0;

    &:hover {
        background-color: var(--grey-hover);
        cursor: pointer;
    }
`

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

const Card = ({ todo_list, deleteList }) => {
    const [status, setStatus] = React.useState('initial_view')
    const [new_list_item_text, setNewText] = React.useState('')
    const [edit_list_item_text, setEditedText] = React.useState('')
    const [item_menu, toggleItemMenu] = React.useState(-1)

    const { active_group } = useGlobal()
    const { user } = useAuth0()
    const toast = useToast()

    const new_item_input_ref = React.useRef()
    const itemsRef = React.useRef([])

    const onNewListItem = () => {
        setStatus('add_new_item')
    }

    React.useEffect(() => {
        itemsRef.current = itemsRef.current.slice(0, todo_list.list_items.length)
    }, [todo_list.list_items])

    React.useEffect(() => {
        if (status === 'add_new_item') {
            new_item_input_ref.current.focus()
        }
        if (typeof status === 'number') {
            itemsRef.current[status].focus()
        }
    }, [status])

    const handleClickOutside = e => {
        if (status === 'add_new_item' && new_item_input_ref.current && !new_item_input_ref.current.contains(e.target)) {
            setStatus('initial_view')
        }
        if (
            typeof status === 'number' &&
            itemsRef.current &&
            itemsRef.current.length &&
            itemsRef.current[status] &&
            !itemsRef.current[status].contains(e.target)
        ) {
            setStatus('initial_view')
        }
    }

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    })

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
        setNewText('')
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
    const completed = todo_list.list_items.filter(li => li.status === 'complete').length
    const total = todo_list.list_items.length

    return (
        <Box key={todo_list._id} maxWidth="600px" padding="8px" overflow="hidden" margin="5px" height="fit-content">
            <Stack
                isInline
                justify="space-between"
                borderBottom="1px solid var(--grey-2)"
                paddingBottom="8px"
                marginBottom="8px"
            >
                <div>
                    <Heading size="md">
                        <span aria-label="shopping cart" role="img" style={{ paddingRight: '8px' }}>
                            🛒
                        </span>
                        {todo_list.name}
                    </Heading>
                    <Box maxHeight="98px">
                        <Box maxWidth="180px" as="div" color="gray.600" fontSize="sm">
                            {`${completed}/${total} completed`}
                        </Box>
                    </Box>
                </div>
                {todo_list.label && <Badge>{todo_list.label}</Badge>}
                <Popover>
                    <PopoverTrigger>
                        <Button size="sm" marginTop="auto" variant="outline">
                            Delete
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent zIndex={4}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader fontWeight="bold">Delete {todo_list.name}?</PopoverHeader>
                        <PopoverBody>Deleting a list is permanent and there is no way to get it back.</PopoverBody>
                        <Button
                            marginRight="0.75rem"
                            marginLeft="0.75rem"
                            marginBottom="0.75rem"
                            variantColor="red"
                            onClick={() => deleteList(todo_list._id, todo_list.name)}
                        >
                            Delete list
                        </Button>
                    </PopoverContent>
                </Popover>
            </Stack>
            <Stack>
                {todo_list.list_items.map((todo, idx) => {
                    return (
                        <CheckListItem
                            key={todo._id}
                            isInline
                            justify="space-between"
                            onMouseEnter={() => toggleItemMenu(todo._id)}
                            onMouseLeave={() => toggleItemMenu(-1)}
                        >
                            <Stack isInline width="100%">
                                <Checkbox
                                    onChange={() => toggleListItem(todo._id, todo.status)}
                                    isChecked={todo.status === 'complete'}
                                    size="lg"
                                    variantColor="teal"
                                    alignItems="unset"
                                    paddingTop="8px"
                                />
                                {status !== idx && (
                                    <Text
                                        padding="5px"
                                        width="100%"
                                        onClick={() => {
                                            setStatus(idx)
                                            setEditedText(todo.text)
                                        }}
                                    >
                                        {todo.text}
                                    </Text>
                                )}
                                {status === idx && (
                                    <Stack width="100%" marginRight="20px" marginTop="9px">
                                        <Input
                                            width="100%"
                                            value={edit_list_item_text}
                                            type="text"
                                            onChange={e => setEditedText(e.target.value)}
                                            id={`edit_text_${idx}`}
                                            ref={el => (itemsRef.current[idx] = el)}
                                        />
                                        <Stack isInline marginBottom="5px" align="center">
                                            <Button variantColor="teal" onClick={() => editListText(todo._id)}>
                                                Save
                                            </Button>
                                            <PopoverBubble text={<Text>Close</Text>}>
                                                <IconButton
                                                    onClick={() => setStatus('initial_view')}
                                                    aria-label="Close new list item"
                                                    icon="close"
                                                    size="sm"
                                                    variant="ghost"
                                                />
                                            </PopoverBubble>
                                        </Stack>
                                    </Stack>
                                )}
                            </Stack>
                            {status !== idx && item_menu === todo._id && (
                                <PopoverBubble text={<Text>Delete item</Text>}>
                                    <IconButton
                                        onClick={() => deleteItem(todo._id)}
                                        aria-label="Delete list item"
                                        icon="small-close"
                                        size="sm"
                                    />
                                </PopoverBubble>
                            )}
                        </CheckListItem>
                    )
                })}
            </Stack>
            {status === 'add_new_item' && (
                <Stack>
                    <Input
                        placeholder="Add an item"
                        ref={new_item_input_ref}
                        type="text"
                        id="new_list_item_text"
                        value={new_list_item_text}
                        onChange={onSetNewText}
                    />
                    <Stack isInline align="center">
                        <Button variantColor="teal" onClick={addNewListIem}>
                            Add
                        </Button>
                        <PopoverBubble text={<Text>Close</Text>}>
                            <IconButton
                                variant="ghost"
                                onClick={() => setStatus('initial_view')}
                                aria-label="Close new list item"
                                icon="close"
                                size="sm"
                            />
                        </PopoverBubble>
                    </Stack>
                </Stack>
            )}
            <Button marginTop="8px" onClick={onNewListItem}>
                Add an item
            </Button>
        </Box>
    )
}

class ListCard extends React.Component {
    render() {
        return (
            <div>
                {this.props.items.map((item, idx) => (
                    <Card deleteList={this.props.deleteList} key={idx} todo_list={item} />
                ))}
            </div>
        )
    }
}

export { ListCard }
