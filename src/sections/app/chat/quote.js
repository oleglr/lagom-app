import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'

const QuoteStyle = styled.div`
    text-align: left;
    font-size: 14px;
    background: #f3f3f3;
    border-left: 5px solid var(--carafe);
    padding: 5px 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    width: ${props => (props.w ? props.w : '')};
`

const StyledImage = styled.img`
    max-height: 100px;
    max-width: 100px;
    border-radius: 5px;
    margin: ${props => (props.m ? props.m : '')};
`

export const Quote = ({ user, text, time, action, w }) => {
    const is_image = action === 'image'
    const is_multiple_image = action === 'multiple_image'
    const is_message = !is_image && !is_multiple_image
    let img_arr
    if (is_multiple_image) {
        img_arr = text.split(',')
    }
    return (
        <QuoteStyle w={w}>
            <Text fontWeight="bold">{user}</Text>
            {is_message && <Text>{text}</Text>}
            {is_image && <StyledImage src={text} alt="reply" />}
            {is_multiple_image && (
                <Flex justify="unset" wrap="wrap">
                    {img_arr.map(url => (
                        <StyledImage m="10px" alt="reply" src={url} />
                    ))}
                </Flex>
            )}
            {time && (
                <Text
                    style={{
                        paddingTop: '5px',
                        fontSize: '12px',
                        opacity: '0.8',
                    }}
                >
                    {time}
                </Text>
            )}
        </QuoteStyle>
    )
}
