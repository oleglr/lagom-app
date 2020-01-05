import React from 'react'
import {
    Button,
    Heading,
    Image,
    Stack,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Icon,
    Spinner,
    Text,
} from '@chakra-ui/core'
import { Formik, Form, Field } from 'formik'
import { useAuth0 } from '../../react-auth0-spa'
import { MainSection, FormWrapper } from '../container'

const Profile = () => {
    const { user, getTokenSilently } = useAuth0()
    const [form_status, setFormStatus] = React.useState('')

    console.log('user: ', user)
    return (
        <MainSection>
            <FormWrapper>
                <Heading size="xl" marginBottom="16px">
                    Edit your profile
                </Heading>
                <Stack spacing={2}>
                    <Heading size="md">Photo</Heading>
                    <Image
                        rounded="full"
                        size="100px"
                        src={user.picture}
                        alt={user.name}
                    />
                    <Button width="150px" variant="outline">
                        Upload photo
                    </Button>
                    <Formik
                        initialValues={{ user_name: user.name }}
                        validate={values => {
                            const errors = {}
                            if (!values.user_name) {
                                errors.user_name = 'Required'
                            }
                            return errors
                        }}
                        onSubmit={async (values, { setStatus }) => {
                            const token = await getTokenSilently()

                            // fetch(`http://localhost:3000/new-group`, {
                            //     method: 'POST',
                            //     body: JSON.stringify({
                            //         group_name: values.group_name,
                            //         user_id: user.sub,
                            //     }),
                            //     headers: {
                            //         'Content-Type': 'application/json',
                            //         Authorization: `Bearer ${token}`,
                            //     },
                            // })
                            //     .then(data => data.json())
                            //     .then(res => {
                            //         if (res.error) {
                            //             setStatus({ msg: res.error })
                            //             return
                            //         }
                            //         setNewGroup(res)
                            //     })
                        }}
                    >
                        {({ isSubmitting, status }) => (
                            <Form>
                                <Field
                                    name="user_name"
                                    render={({ field, form }) => (
                                        <FormControl
                                            isInvalid={
                                                form.errors.user_name &&
                                                form.touched.user_name
                                            }
                                        >
                                            <FormLabel htmlFor="user-name">
                                                User name
                                            </FormLabel>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="user-name"
                                                data-lpignore="true"
                                            />
                                            <FormErrorMessage>
                                                {form.errors.user_name}
                                            </FormErrorMessage>
                                            {status && status.msg && (
                                                <Stack isInline align="center">
                                                    <Icon
                                                        color="red.500"
                                                        name="warning"
                                                        size="18px"
                                                    />
                                                    <Text>
                                                        Server error{' '}
                                                        {status.msg}, please try
                                                        again
                                                    </Text>
                                                </Stack>
                                            )}
                                        </FormControl>
                                    )}
                                />
                                <Stack justify="flex-end">
                                    <Button
                                        mt={4}
                                        variantColor="teal"
                                        width="150px"
                                        type="submit"
                                        id="form-submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {form_status === 'loading_new_group' ? (
                                            <Spinner />
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </Button>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Stack>
            </FormWrapper>
        </MainSection>
    )
}

export default Profile
