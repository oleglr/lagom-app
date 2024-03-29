import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@chakra-ui/core'
import { Flex } from '../../../components/container'
import { useGlobal } from '../../../context/global-context'

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

export const Quote = ({ user: user_id, text, image_url, time, action, w, measure }) => {
    const { getUser } = useGlobal()
    const is_image = action === 'image'
    const is_multiple_image = action === 'multiple_image'
    const user = getUser(user_id)

    let img_arr = []
    if (is_multiple_image) {
        if (image_url) {
            img_arr = image_url.split(',')
        }
    }
    return (
        <QuoteStyle w={w}>
            <Text fontWeight="bold">{user.name}</Text>
            {text && <Text>{text}</Text>}
            {is_image && <StyledImage src={image_url} alt="reply" onLoad={measure} />}
            {is_multiple_image && (
                <Flex justify="unset" wrap="wrap" height="unset">
                    {img_arr.map((url, idx) => (
                        <StyledImage m="10px" alt="reply" src={url} key={url} onLoad={measure} />
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
