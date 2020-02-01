import React from 'react'
import LagomRobotImg from '../assets/images/lagom_robot.png'

export const useGlobal = () => React.useContext(GlobalContext)

export const GlobalContext = React.createContext({
    active_group: null,
    setActiveGroup: () => {},
    all_groups: null,
    setAllGroups: () => {},
    group_members: null,
    setGroupMembers: () => {},
})

function checkNotificationPromise() {
    try {
        Notification.requestPermission().then()
    } catch (e) {
        return false
    }

    return true
}

function handlePermission(permission) {
    // Whatever the user answers, we make sure Chrome stores the information
    if (!('permission' in Notification)) {
        Notification.permission = permission
    }

    if (Notification.permission === 'denied' || Notification.permission === 'default') {
        console.log('denied!')
    } else {
        console.log('accepted!')
    }
}

const askForNotificationPermission = () => {
    if (typeof Notification === 'undefined') {
        console.log('This browser does not support notifications.')
    } else {
        if (checkNotificationPromise()) {
            Notification.requestPermission().then(permission => {
                handlePermission(permission)
            })
        } else {
            Notification.requestPermission(function(permission) {
                handlePermission(permission)
            })
        }
    }
}

const LAGOMBOT = 'Lagom Robot'
// TODO: consider moving to app.js instead of copying props here
export const GlobalContextProvider = ({ children, activeGroup, groupMembers = [] }) => {
    const [active_group, setActiveGroup] = React.useState(activeGroup)
    const [group_members, setGroupMembers] = React.useState(groupMembers)
    const [all_groups, setAllGroups] = React.useState([])

    const getUser = id => {
        const user = group_members.find(u => u.id === id)
        if (user) return { name: user.name, img: user.picture }
        if (id === LAGOMBOT) return { name: LAGOMBOT, img: LagomRobotImg }

        return { name: 'unkown user', img: LagomRobotImg }
    }

    // ask for permission for notifications
    askForNotificationPermission()

    return (
        <GlobalContext.Provider
            value={{
                active_group,
                setActiveGroup,
                group_members,
                setGroupMembers,
                all_groups,
                setAllGroups,
                // functions
                getUser,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
