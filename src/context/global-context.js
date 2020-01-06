import React from 'react'
import { useAuth0 } from '../react-auth0-spa'

export const useGlobal = () => React.useContext(GlobalContext)

export const GlobalContext = React.createContext({
    active_group: null,
    setActiveGroup: () => {},
    all_groups: null,
    setAllGroups: () => {},
    // members: null,
    // setAllMembers: () => {},
})

// use websocket to get group
// use websocket to get group members
export const GlobalContextProvider = ({ children }) => {
    const { user } = useAuth0()
    const [active_group, setActiveGroup] = React.useState({})
    const [all_groups, setAllGroups] = React.useState([])

    React.useEffect(() => {
        const all_groups = Object.keys(
            user['http://localhost:3001/user_metadata']
        )
        const first_group = all_groups[0]
        const group_id =
            user['http://localhost:3001/user_metadata'][first_group]
        setActiveGroup({ name: first_group, id: group_id })
        setAllGroups(all_groups)
    }, [user])

    return (
        <GlobalContext.Provider
            value={{
                active_group,
                setActiveGroup,
                all_groups,
                setAllGroups,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
