import React from 'react'
import styled from '@emotion/styled'
import { Spinner } from '@chakra-ui/core'

const AlignMiddle = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const BouncingLoader = () => {
    return (
        <AlignMiddle>
            <div className="bouncing-loader">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </AlignMiddle>
    )
}

export const Loader = () => {
    return (
        <AlignMiddle>
            <Spinner />
        </AlignMiddle>
    )
}
