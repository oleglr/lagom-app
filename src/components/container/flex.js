import styled from '@emotion/styled'

export const Flex = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: ${props => (props.justify ? props.justify : 'center')};
  align-items: ${props => (props.align ? props.align : '')};
  flex-direction: ${props => (props.column ? 'column' : '')};

  @media (max-width: ${props => (props.columnSize ? props.columnSize : '')}) {
    flex-direction: column;
  }
`