import React from 'react'
import {
    Button,
    Heading,
    Image,
    Stack,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/core'
import { useAuth0 } from '../../react-auth0-spa'
import { MainSection, FormWrapper } from '../container'

const Profile = () => {
    const { user } = useAuth0()

    return (
        <MainSection>
            <FormWrapper>
                <Stack>
                    <Heading size="md">Photo</Heading>
                    <Image
                        rounded="full"
                        size="100px"
                        src={user.picture}
                        alt={user.name}
                    />
                    <Button variant="outline">Upload photo</Button>
                    <FormControl>
                        <FormLabel htmlFor="email">User name</FormLabel>
                        <Input type="text" id="email" value={user.name} />
                    </FormControl>
                    <Button variantColor="teal">Save Changes</Button>
                </Stack>
            </FormWrapper>
        </MainSection>
    )
}

export default Profile
