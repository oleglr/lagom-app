import React from 'react'
import {
    Heading,
    Button,
    Stack,
    Text,
    Icon,
    FormControl,
    Input,
    FormLabel,
    Popover,
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

// TODO:
// const labels = {
//     group_id: 'abc',
//     default_labels: [
//         { name: 'Shopping', _id: 'label_id', color: 'green' },
//         { name: 'Travel', _id: 'label_id', color: 'red' },
//         { name: 'Restaurants', _id: 'label_id', color: 'blue' },
//         { name: 'Watch', _id: 'label_id', color: 'yellow' },
//         { name: 'Read', _id: 'label_id', color: 'purple' },
//         { name: 'Important', _id: 'label_id', color: 'purple' },
//     ],
// }

class MediaListContainer extends React.Component {
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
        this.setState({ is_loading: false, data: res.bucket_list })
    }

    listUpdated = res => {
        const { data } = this.state
        const list_idx = data.findIndex(l => l._id === res._id)
        const new_data = data
        new_data[list_idx].list_items = res.list_items
        this.setState({ data: new_data })
        // existing list updated by user or other user
    }

    new_bucket_added = new_bucket => {
        this.setState({ data: [new_bucket, ...this.state.data], new_list_loading: false })
    }

    deleteList = (list_id, list_name) => {
        socket().emit(
            'delete_bucket_list',
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
            'new_bucket_list',
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
        socket().on('get_bucket_list', this.populateList)

        socket().on('new_bucket_added', this.new_bucket_added)
        socket().on('bucket_list_deleted', this.onListRemoved)

        socket().on('list_item_updated', this.listUpdated)
        socket().on('list_item_deleted', this.onDeleteListItem)
        socket().on('new_list_item_added', this.onNewListItem)

        socket().emit(
            'get_bucket_list',
            {
                group_id: this.props.group_id,
            },
            e => {
                console.log(e)
            }
        )
    }

    componentWillUnmount() {
        socket().off('get_bucket_list', this.populateList)
        socket().off('bucket_list_item_updated', this.listUpdated)
        socket().off('new_bucket_added', this.new_bucket_added)
    }

    render() {
        const { is_loading, data, labels } = this.state

        if (is_loading) return <Loader />

        return (
            <div style={{ height: '100%' }}>
                <>
                    <Stack isInline align="center">
                        <Heading marginLeft="2rem" marginTop="2rem" size="xl" marginBottom="16px">
                            Lists:
                        </Heading>
                        <PopoverForm
                            list_count={this.state.data.length}
                            new_list_loading={this.state.new_list_loading}
                            addNewListName={this.addNewListName}
                        />
                    </Stack>
                    <div style={{ height: '100%' }}>
                        {!!data.length && <ListCard deleteList={this.deleteList} labels={labels} items={data} />}
                    </div>
                </>
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
        <div>
            <Button onClick={open}>Add list</Button>
            <Popover placement="bottom" initialFocusRef={input_ref} isOpen={isOpen} onClose={close}>
                <PopoverContent zIndex={4}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Add new list</PopoverHeader>
                    <PopoverBody>
                        {default_error && (
                            <Stack isInline align="center">
                                <Icon color="blue.500" name="info" size="18px" />
                                <Text>{form_error}</Text>
                            </Stack>
                        )}
                        {!default_error && (
                            <form onSubmit={newListName}>
                                <FormControl>
                                    <FormLabel htmlFor="list-name">Name</FormLabel>
                                    <Input
                                        type="text"
                                        id="list-name"
                                        placeholder="E.g. IKEA shopping list"
                                        data-lpignore="true"
                                        value={new_list_name}
                                        onChange={e => {
                                            onUpdateName(e)
                                        }}
                                        ref={input_ref}
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
                                    className="btn-primary"
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

const Media = () => {
    const { active_group } = useGlobal()
    const { user } = useAuth0()

    if (!active_group || !active_group.id) {
        return <CreateGroup />
    }

    return <MediaListContainer user={user} group_id={active_group.id} />
}

export default Media
