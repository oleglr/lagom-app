import styled from '@emotion/styled'

export const Grid = styled.div`
    display: grid;
    height: 100%;
    margin: ${props => props.margin || '0'};
    grid-template-columns: ${props => props.columns || 'auto'};
    grid-column-gap: ${props => props.columngap || '0'};
    grid-row-gap: ${props => props.rowgap || '0'};
    grid-gap: ${props => props.gap || ''};
    align-items: ${props => props.align || 'start'};
    justify-items: ${props => props.justify || 'start'};
    background-color: ${props => props.bgcolor || ''};
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    width: 100%;
`
