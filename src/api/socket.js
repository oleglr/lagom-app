import io from 'socket.io-client'
let socket

export const getSocket = () => socket

export const initSocket = ({ token, group_id, user_id }) => {
    if (socket) return socket

    return new Promise((resolve, reject) => {
        // TODO: check timeout
        socket = io.connect(process.env.REACT_APP_API, { 'connect timeout': 1000 })
        socket.on('connect', () => {
            socket.emit('join group', { group_id, user_id }, res => {
                if (res.err) {
                    console.log('res: ', res)
                    reject(res.error)
                }
                console.log('res: ', res)
                resolve(res)
            })
        })
    })
}
