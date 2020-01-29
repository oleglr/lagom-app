import { getSocket as socket } from '../../../api/socket'

export const getList = ({ group_id }) => {
    socket().emit('get_list', { group_id }, e => {
        console.log(e)
    })
}

export const addNewList = ({ name, group_id, user_id, user_name }) => {
    socket().emit(
        'new_list',
        {
            name,
            group_id,
            user_id,
            user_name,
        },
        e => {
            console.log('e: ', e)
        }
    )
}

export const deleteList = ({ list_id, list_name, group_id, user_name }) => {
    socket().emit('delete_list', { list_id, list_name, group_id, user_name }, e => {
        console.log(e)
    })
}

export const addNewListItem = ({ group_id, list_id, text, user_id }) => {
    socket().emit(
        'add_new_list_item',
        {
            group_id,
            list_id,
            text,
            user_id,
        },
        e => {
            console.log(e)
        }
    )
}

export const editListItem = ({ group_id, list_id, text, text_id, user_id }) => {
    socket().emit(
        'edit_list_item',
        {
            group_id,
            list_id,
            text,
            text_id,
            user_id,
        },
        e => {
            console.log(e)
        }
    )
}

export const deleteListItem = ({ group_id, list_id, text_id }) => {
    socket().emit(
        'delete_list_item',
        {
            group_id,
            list_id,
            text_id,
        },
        e => {
            console.log(e)
        }
    )
}

export const toggleListItem = ({ group_id, list_id, text_id, user_id, status }) => {
    socket().emit(
        'toggle_list_item',
        {
            group_id,
            list_id,
            text_id,
            user_id,
            status,
        },
        e => {
            console.log(e)
        }
    )
}

export const editListIcon = ({ group_id, list_id, icon }) => {
    socket().emit(
        'edit_list_icon',
        {
            group_id,
            list_id,
            icon,
        },
        e => {
            console.log(e)
        }
    )
}
