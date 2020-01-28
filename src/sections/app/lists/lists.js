import React from 'react'
import {
    Heading,
    Button,
    Stack,
    Text,
    Icon,
    FormControl,
    Input,
    Box,
    FormLabel,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/core'
import { useAuth0 } from '../../../react-auth0-spa'
import { Loader } from '../../../components/elements'
import { useGlobal } from '../../../context/global-context'
import { CreateGroup } from '../../../components/general/create-group'
import { getSocket as socket } from '../../../api/socket'
import { ListCard } from './list-card'

class ListContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            labels: [],
            status: 'list_view',
            is_loading: true,
            new_list_loading: false,
        }
    }

    showForm = () => {
        this.setState({ status: 'new_list' })
    }

    closeForm = () => {
        this.setState({ status: 'list_view' })
    }

    populateList = res => {
        this.setState({ is_loading: false, data: res.list })
    }

    listItemUpdated = res => {
        const { data } = this.state
        const list_idx = data.findIndex(l => l._id === res._id)
        const new_data = data
        new_data[list_idx].list_items = res.list_items
        this.setState({ data: new_data })
        // existing list updated by user or other user
    }

    newListAdded = new_list => {
        this.setState({ data: [new_list, ...this.state.data], new_list_loading: false })
    }

    deleteList = (list_id, list_name) => {
        socket().emit(
            'delete_list_list',
            { list_id, list_name, group_id: this.props.group_id, user_name: this.props.user.nickname },
            e => {
                console.log(e)
            }
        )
    }

    onDeleteListItem = res => {
        const { data } = this.state
        const list_idx = data.findIndex(l => l._id === res.list_id)
        const new_data = data
        new_data[list_idx].list_items = new_data[list_idx].list_items.filter(i => i._id !== res.text_id)
        this.setState({ data: new_data })
    }

    onListRemoved = res => {
        const new_data = this.state.data.filter(list_item => list_item._id !== res.list_id)
        this.setState({ data: new_data })
    }

    listUpdated = res => {
        const { data } = this.state
        const list_idx = data.findIndex(l => l._id === res._id)
        const new_data = [...data]
        new_data[list_idx].icon = res.icon

        this.setState({ data: new_data })
    }

    onNewListItem = res => {
        const { data } = this.state
        const list_idx = data.findIndex(l => l._id === res._id)
        const new_data = data
        new_data[list_idx].list_items = res.list_items
        this.setState({ data: new_data })
    }

    addNewListName = name => {
        this.setState({ new_list_loading: true })
        socket().emit(
            'new_list',
            {
                name,
                label: '',
                group_id: this.props.group_id,
                user_id: this.props.user.sub,
                user_name: this.props.user.nickname,
            },
            e => {
                console.log('e: ', e)
            }
        )
    }

    componentDidMount() {
        // fetch data
        socket().on('get_list', this.populateList)

        socket().on('new_list_added', this.newListAdded)
        socket().on('list_deleted', this.onListRemoved)
        socket().on('list_updated', this.listUpdated)

        socket().on('list_item_updated', this.listItemUpdated)
        socket().on('list_item_deleted', this.onDeleteListItem)
        socket().on('new_list_item_added', this.onNewListItem)

        socket().emit(
            'get_list',
            {
                group_id: this.props.group_id,
            },
            e => {
                console.log(e)
            }
        )
    }

    componentWillUnmount() {
        socket().off('get_list', this.populateList)
        socket().off('new_list_added', this.newListAdded)
        socket().off('list_deleted', this.onListRemoved)
        socket().off('list_updated', this.listUpdated)
        socket().off('list_item_updated', this.listItemUpdated)
        socket().off('list_item_deleted', this.onDeleteListItem)
        socket().off('new_list_item_added', this.onNewListItem)
    }

    render() {
        const { is_loading, data, labels } = this.state

        if (is_loading) return <Loader />

        return (
            <div style={{ height: '100%' }}>
                <Box marginTop="100px" marginLeft="100px" marginRight="100px">
                    <Stack isInline>
                        <Heading marginLeft="0" marginBottom="8px" size="xl" style={{ marginRight: 'auto' }}>
                            <span role="img" aria-label="list pad" style={{ paddingRight: '15px' }}>
                                📝
                            </span>
                            Lists:
                        </Heading>
                    </Stack>
                    {/* Travel bucket list, new resolutions, new goals, restaurants to try this month, movies to watch */}
                    <Text paddingBottom="16px">
                        IKEA shopping lists, travel lists, restaurants to visit, movies to watch click "Add list" to
                        create any list that fits your group.
                    </Text>
                    <PopoverForm
                        list_count={this.state.data.length}
                        new_list_loading={this.state.new_list_loading}
                        addNewListName={this.addNewListName}
                    />
                    <div style={{ height: '100%' }}>
                        {!!data.length && <ListCard deleteList={this.deleteList} labels={labels} items={data} />}
                    </div>
                </Box>
            </div>
        )
    }
}

const MAX_NAME_LENGTH = 200
const MAX_LIST_COUNT = 3
const PopoverForm = ({ addNewListName, new_list_loading, list_count }) => {
    let default_error
    if (list_count >= MAX_LIST_COUNT) {
        // TODO display error
        default_error = `Max ${MAX_LIST_COUNT} lists allowed, for more lists please upgrade your account to premium`
    } else {
        default_error = ''
    }

    const [new_list_name, setNewListName] = React.useState('')
    const [form_error, setFormError] = React.useState(default_error)
    const [isOpen, setIsOpen] = React.useState(false)
    const [status, setStatus] = React.useState('')

    const input_ref = React.useRef()

    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    const onUpdateName = e => {
        setNewListName(e.target.value)
    }

    const newListName = e => {
        e.preventDefault()
        if (form_error) return
        setStatus('submitting')
        addNewListName(new_list_name)
    }

    React.useEffect(() => {
        if (!new_list_loading && status === 'submitting') {
            setStatus('')
            setNewListName('')
            close()
        }
    }, [new_list_loading, status])

    React.useEffect(() => {
        if (new_list_name.length >= MAX_NAME_LENGTH) {
            // TODO display error
            setFormError(`Name should be shorter than ${MAX_NAME_LENGTH} characters`)
            return
        } else {
            setFormError('')
        }
    }, [new_list_name])

    return (
        <div style={{ maxHeight: '40px', marginBottom: '20px' }}>
            <Popover placement="right" initialFocusRef={input_ref} isOpen={isOpen} onClose={close}>
                <PopoverTrigger>
                    <Button className="btn-primary" onClick={open}>
                        Add list
                    </Button>
                </PopoverTrigger>
                <PopoverContent zIndex={4}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight="bold">Add new list</PopoverHeader>
                    <PopoverBody>
                        {default_error && (
                            <Stack isInline align="center">
                                <Icon color="blue.500" name="info" size="18px" />
                                <Text>{default_error}</Text>
                            </Stack>
                        )}
                        {!default_error && (
                            <form onSubmit={newListName}>
                                <FormControl>
                                    <FormLabel fontWeight="normal" htmlFor="list-name">
                                        Name
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        id="list-name"
                                        placeholder="E.g. Malaysia trip"
                                        data-lpignore="true"
                                        value={new_list_name}
                                        onChange={e => {
                                            onUpdateName(e)
                                        }}
                                        ref={input_ref}
                                        marginBottom="16px"
                                    />
                                    {/* TODO: sharable error component */}
                                    {form_error && (
                                        <Stack isInline align="center">
                                            <Icon color="red.500" name="warning" size="18px" />
                                            <Text>{form_error}</Text>
                                        </Stack>
                                    )}
                                </FormControl>
                                <Button
                                    isDisabled={status === 'submitting'}
                                    isLoading={status === 'submitting'}
                                    variantColor="teal"
                                    type="submit"
                                >
                                    Add list
                                </Button>
                            </form>
                        )}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </div>
    )
}

const Lists = () => {
    const { active_group } = useGlobal()
    const { user } = useAuth0()

    if (!active_group || !active_group.id) {
        return <CreateGroup />
    }

    return <ListContainer user={user} group_id={active_group.id} />
}

export default Lists
