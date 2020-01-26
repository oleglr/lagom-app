import React from 'react'
import styled from '@emotion/styled'
import Hammer from 'hammerjs'
import { Stack, Heading, Button, Drawer, Icon, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/core'
import { useHistory } from 'react-router-dom'
import { useUI } from '../../../main-content'
import { useGlobal } from '../../../context/global-context'
import { SideContent } from './content'

const Aside = styled.aside`
    min-width: 275px;
    height: 100%;
    background-color: var(--secondary);
`
const StyledDrawerContent = styled(DrawerContent)`
    min-width: 275px;
    height: 100%;
    background-color: var(--secondary);
    font-size: 18px;
`
const Nav = styled.nav`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

class SwipeWrapper extends React.PureComponent {
    componentDidMount() {
        this.hammer = Hammer(this.container)
        this.hammer.on('swipeleft', this.props.onSwipedLeft)
    }
    render() {
        return (
            <div ref={el => (this.container = el)} style={{ height: '100%' }}>
                {this.props.children}
            </div>
        )
    }
}

export const SideMenu = () => {
    const btnRef = React.useRef()
    const { is_drawer_open, toggleDrawer, is_mobile } = useUI()
    const history = useHistory()
    const { active_group } = useGlobal()

    const closeDrawer = () => toggleDrawer(false)
    const openDrawer = () => toggleDrawer(true)

    const has_group = active_group && active_group.name

    if (is_mobile) {
        return (
            <>
                <Stack backgroundColor="var(--secondary)" height="60px" align="center" isInline>
                    <Button width="50px" ref={btnRef} backgroundColor="transparent" onClick={openDrawer}>
                        <Icon name="arrow-right" color="#fff" />
                    </Button>
                    {has_group && (
                        <Heading
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            color="white"
                            size="sm"
                            onClick={() => history.push('/')}
                        >
                            {active_group.name}
                        </Heading>
                    )}
                </Stack>
                <Drawer isOpen={is_drawer_open} placement="left" onClose={closeDrawer} finalFocusRef={btnRef}>
                    <SwipeWrapper style={{ height: '100%' }} onSwipedLeft={closeDrawer}>
                        <DrawerOverlay />
                        <StyledDrawerContent>
                            <DrawerCloseButton color="#fff" />
                            <SideContent onClose={closeDrawer} />
                        </StyledDrawerContent>
                    </SwipeWrapper>
                </Drawer>
            </>
        )
    }

    return (
        <Aside>
            <Nav>
                <SideContent />
            </Nav>
        </Aside>
    )
}
