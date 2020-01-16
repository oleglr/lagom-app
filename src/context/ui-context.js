import React from 'react'

export const useGlobal = () => React.useContext(GlobalContext)

export const GlobalContext = React.createContext({
    active_group: null,
    setActiveGroup: () => {},
})
// TODO: consider moving to app.js instead of copying props here
export const GlobalContextProvider = ({ children, activeGroup, groupMembers = [] }) => {
    const [active_group, setActiveGroup] = React.useState(activeGroup)
    const [group_members, setGroupMembers] = React.useState(groupMembers)
    const [all_groups, setAllGroups] = React.useState([])

    return (
        <GlobalContext.Provider
            value={{
                active_group,
                setActiveGroup,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
