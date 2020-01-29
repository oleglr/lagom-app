import React from 'react'
import { Stack, Text, Icon } from '@chakra-ui/core'

export const Error = ({ error }) => (
    <Stack isInline align="center">
        <Icon color="red.500" name="warning" size="18px" />
        <Text>{error}</Text>
    </Stack>
)
