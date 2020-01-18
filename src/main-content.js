import React from 'react'
import styled from '@emotion/styled'
import { Swipeable } from 'react-swipeable'

const MainContentStyle = styled.div`
    height: 100%;
    display: flex;
    overflow: scroll;
    flex-direction: ${props => (props.isTabletOrMobile ? 'column-reverse' : 'row')};
`

export const useUI = () => React.useContext(UIContext)

const UIContext = React.createContext({
    is_drawer_open: null,
    toggleDrawer: () => {},
})

export const MainContent = ({ children, isTabletOrMobile }) => {
    const [is_drawer_open, toggleDrawer] = React.useState(false)

    const openDrawer = () => {
        if (is_drawer_open) return
        toggleDrawer(true)
    }

    const closeDrawer = () => {
        console.log('swipe left')
        if (!is_drawer_open) return
        toggleDrawer(false)
    }

    return (
        <Swipeable style={{ height: '100%' }} onSwipedRight={openDrawer} onSwipedLeft={closeDrawer}>
            <UIContext.Provider
                value={{
                    is_drawer_open,
                    toggleDrawer,
                }}
            >
                <MainContentStyle isTabletOrMobile={isTabletOrMobile}>{children}</MainContentStyle>
            </UIContext.Provider>
        </Swipeable>
    )
}
