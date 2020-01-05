import React from 'react'

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
    const [active_group, setActiveGroup] = React.useState({
        name: 'Best friends',
        id: '5df5c5b8aec1710635f037c4',
    })
    const [all_groups, setAllGroups] = React.useState('')

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
