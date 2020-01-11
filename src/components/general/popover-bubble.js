import React from 'react'
import styled from '@emotion/styled'
import Popover, { ArrowContainer } from 'react-tiny-popover'

export const Bubble = styled.div`
    background-color: black;
    color: white;
    padding: 5px 5px;
    border-radius: 5px;
    font-size: 13px;
    max-width: ${props => (props.max_w ? props.max_w : '150px;')};
    min-width: ${props => (props.min_w ? props.min_w : '')};
    text-align: center;
    font-weight: bold;

    span {
        color: var(--grey-2);
        font-weight: normal;
    }
`
export const PopoverBubble = ({ children, text, is_hover = true }) => {
    const [show_bubble, setShowBubble] = React.useState(false)

    return (
        <Popover
            isOpen={show_bubble}
            position={['top', 'right', 'left', 'bottom']}
            padding={10}
            content={({ position, targetRect, popoverRect }) => (
                <ArrowContainer
                    position={position}
                    targetRect={targetRect}
                    popoverRect={popoverRect}
                    arrowColor={'black'}
                    arrowSize={7}
                >
                    <Bubble>{text}</Bubble>
                </ArrowContainer>
            )}
        >
            <div
                onMouseEnter={() => setShowBubble(true)}
                onMouseLeave={() => setShowBubble(false)}
            >
                {children}
            </div>
        </Popover>
    )
}
