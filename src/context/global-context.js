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

export const GlobalContextProvider = ({ children, activeGroup }) => {
    const [active_group, setActiveGroup] = React.useState(activeGroup)
    const [all_groups, setAllGroups] = React.useState([])

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
