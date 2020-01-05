import { getSocket as socket } from '../../../api/socket'

export const addReaction = ({ emoji, ref, group_id }) => {
    emitReaction({ emoji, ref, group_id })
}

export const addThreadReaction = ({ emoji, ref, thread_ref, group_id }) => {
    emitReaction({ emoji, ref, thread_ref, is_thread: true, group_id })
}

const emitReaction = ({
    emoji,
    ref,
    is_thread = false,
    thread_ref,
    group_id,
}) => {
    socket().emit(
        'add reaction',
        {
            emoji,
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
