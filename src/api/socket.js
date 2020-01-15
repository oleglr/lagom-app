import io from 'socket.io-client'
let socket

export const getSocket = () => socket

export const initSocket = ({ token, group_id, user_id }) => {
    if (socket) return socket

    return new Promise((resolve, reject) => {
        socket = io.connect(process.env.REACT_APP_API, {
            query: { token },
        })
        socket.on('connect', () => {
            socket.emit('join group', { group_id, user_id }, res => {
                if (res.err) {
                    reject(res.error)
                }
                resolve(res)
            })
        })
    })
}
