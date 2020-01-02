import { getSocket as socket } from '../../../api/socket'

export const addReaction = ({ emoji, ref }) => {
    emitReaction({ emoji, ref })
}

export const addThreadReaction = ({ emoji, ref, thread_ref }) => {
    emitReaction({ emoji, ref, thread_ref, is_thread: true })
}

const emitReaction = ({ emoji, ref, is_thread = false, thread_ref }) => {
    socket().emit(
        'add reaction',
        {
            emoji,
            ref,
            is_thread,
            thread_ref,
            group_id: '5df5c5b8aec1710635f037c4',
        },
        e => {
            console.log('e: ', e)
        }
    )
}
