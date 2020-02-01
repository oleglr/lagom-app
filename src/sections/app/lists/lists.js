import React from 'react'
import styled from '@emotion/styled'
import { Heading, Stack, Text, Box } from '@chakra-ui/core'
import { useAuth0 } from '../../../react-auth0-spa'
import { Loader } from '../../../components/elements'
import { useGlobal } from '../../../context/global-context'
import { useUI } from '../../../main-content'
import { CreateGroup } from '../../../components/general/create-group'
import { getSocket as socket } from '../../../api/socket'
import { ListCard } from './list-card'
import { PopoverForm } from './add-list-popover'
import { getList, addNewList, deleteList } from './list-socket-methods'

const PageLayout = styled(Box)`
    height: 100%;
    margin-top: ${props => (props.is_mobile ? '' : '100px')};
    margin-right: ${props => (props.is_mobile ? '' : '100px')};
    margin-left: ${props => (props.is_mobile ? '' : '100px')};
    margin: ${props => (props.is_mobile ? '20px' : '')};
`

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

    populateList = res => {
        this.setState({ is_loading: false, data: res.list })
    }

    listItemUpdated = res => {
        const { data } = this.state
        const list_idx = data.findIndex(l => l._id === res._id)
        const new_data = data
        new_data[list_idx].list_items = res.list_items
        this.setState({ data: new_data })
    }

    newListAdded = new_list => {
        this.setState({ data: [new_list, ...this.state.data], new_list_loading: false })
    }

    deleteList = (list_id, list_name) => {
        const { group_id, user } = this.props
        deleteList({ list_id, list_name, group_id, user_name: user.nickname })
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
        const { group_id, user } = this.props
        addNewList({ name, group_id, user_id: user.sub, user_name: user.nickname })
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

        getList({ group_id: this.props.group_id })
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
            <PageLayout as="section" is_mobile={this.props.is_mobile}>
                <Stack isInline>
                    <Heading marginLeft="0" marginBottom="8px" size="xl" style={{ marginRight: 'auto' }}>
                        <span role="img" aria-label="list pad" style={{ paddingRight: '15px' }}>
                            📝
                        </span>
                        Lists:
                    </Heading>
                </Stack>
                <Text paddingBottom="16px">
                    IKEA shopping list, Travel bucket list, restaurants to try 2020, movies to watch - click "Add list"
                    to create a checklist that fits your group.
                </Text>
                <PopoverForm
                    list_count={this.state.data.length}
                    new_list_loading={this.state.new_list_loading}
                    addNewListName={this.addNewListName}
                />
                <div style={{ height: '100%' }}>
                    {!!data.length && <ListCard deleteList={this.deleteList} labels={labels} items={data} />}
                </div>
            </PageLayout>
        )
    }
}

const Lists = () => {
    const { active_group } = useGlobal()
    const { user } = useAuth0()
    const { is_mobile } = useUI()

    if (!active_group || !active_group.id) {
        return <CreateGroup />
    }

    return <ListContainer is_mobile={is_mobile} user={user} group_id={active_group.id} />
}

export default Lists
