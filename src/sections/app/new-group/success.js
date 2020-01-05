import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Heading, Text } from '@chakra-ui/core'

export const Success = ({ text }) => {
    const history = useHistory()

    return (
        <>
            <Heading mb={4} size="lg">
                Fantastic{' '}
                <span aria-label="thumbsup" role="img">
                    👍
                </span>
            </Heading>
            <Text mb={4}>
                {text
                    ? text
                    : 'All that is left now is to wait for your friends to join'}
            </Text>
            <Button variantColor="teal" onClick={() => history.push('/')}>
                Go to group
            </Button>
        </>
    )
}
