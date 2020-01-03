import styled from '@emotion/styled'

export const Flex = styled.div`
    display: flex;
    height: ${props => (props.height ? props.height : '100%')};
    width: ${props => (props.width ? props.width : '100%')};
    justify-content: ${props => (props.justify ? props.justify : 'center')};
    align-items: ${props => (props.align ? props.align : '')};
    flex-direction: ${props => (props.column ? 'column' : '')};
    margin-top: ${props => (props.mt ? props.mt : '')};
    margin-left: ${props => (props.ml ? props.ml : '')};
    padding-left: ${props => (props.pl ? props.pl : '')};
    flex-wrap: ${props => (props.wrap ? props.wrap : '')};

    @media (max-width: ${props => (props.columnSize ? props.columnSize : '')}) {
        flex-direction: column;
    }
`
