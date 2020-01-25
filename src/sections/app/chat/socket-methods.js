import { getSocket as socket } from '../../../api/socket'

export const addReaction = ({ emoji, emoji_code, ref, group_id, user_id, custom }) => {
    emitReaction({ emoji, emoji_code, ref, group_id, user_id, custom })
}

export const addThreadReaction = ({ emoji, ref, thread_ref, group_id }) => {
    emitReaction({ emoji, ref, thread_ref, is_thread: true, group_id })
}

export const removeReaction = ({ message_id, reaction_id, group_id, is_thread, thread_ref }) => {
    socket().emit(
        'remove reaction',
        {
            message_id,
            reaction_id,
            group_id,
        },
        e => {
            console.log('e: ', e)
        }
    )
}

const emitReaction = ({ emoji, emoji_code, ref, is_thread = false, thread_ref, group_id, user_id, custom }) => {
    let emoji_to_send = emoji
    if (custom) {
        emoji_to_send = `custom_${emoji_code}`
    }

    socket().emit(
        'add reaction',
        {
            user_id,
            emoji: emoji_to_send,
            emoji_code,
            ref,
            is_thread,
            thread_ref,
            group_id,
        },
        e => {
            console.log('e: ', e)
        }
    )
}
