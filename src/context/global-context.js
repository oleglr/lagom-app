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
const LAGOMBOT = 'Lagom Robot'
// TODO: consider moving to app.js instead of copying props here
export const GlobalContextProvider = ({ children, activeGroup, groupMembers = [] }) => {
    const [active_group, setActiveGroup] = React.useState(activeGroup)
    const [group_members, setGroupMembers] = React.useState(groupMembers)
    const [all_groups, setAllGroups] = React.useState([])

    const getUser = id => {
        const user = group_members.find(u => u.user_id === id)
        if (user) return { name: user.nickname, img: user.picture }
        if (id === LAGOMBOT) return { name: LAGOMBOT, img: LagomRobotImg }

        return { name: 'unkown user', img: LagomRobotImg }
    }

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
