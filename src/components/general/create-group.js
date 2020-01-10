import React from 'react'
import { MainSection, FormWrapper } from '../container'
import { Heading } from '@chakra-ui/core'

export const CreateGroup = () => {
    return (
        <MainSection>
            <FormWrapper>
                <Heading size="lg">Step 1: Create a group</Heading>
                <Heading size="lg">Step 2: Invite your friends</Heading>
                <Heading size="lg">Step 3: profit</Heading>
            </FormWrapper>
        </MainSection>
    )
}
