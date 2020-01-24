import styled from '@emotion/styled'

export const NotificationCircle = styled.span`
    color: white;
    background: var(--red);
    border-radius: 50%;
    border: 1px solid white;
    font-weight: bold;
    position: absolute;
    top: ${props => (props.top ? props.top : '')};
    left: ${props => (props.left ? props.left : '')};
    right: ${props => (props.right ? props.right : '')};
    font-size: ${props => (props.fontSize ? props.fontSize : '10px')};
    padding: ${props => (props.p ? props.p : '0 4px')};
}
`
