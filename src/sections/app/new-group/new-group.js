import React from 'react'
import { Button, Heading, FormControl, FormErrorMessage, Input, Spinner, Text, Stack, Icon } from '@chakra-ui/core'
import { Formik, Form, Field } from 'formik'
import { Flex, MainSection, FormWrapper } from '../../../components/container'
import { useAuth0 } from '../../../react-auth0-spa'
import { Success } from './success'
import { InviteForm } from './invite-form'
import { useGlobal } from '../../../context/global-context'
import { initSocket } from '../../../api/socket'

export const NewGroup = () => {
    const [form_status, setFormStatus] = React.useState('create_group')
    const { setActiveGroup } = useGlobal()

    const { getTokenSilently, user } = useAuth0()

    const setNewGroup = (group, admin_id) => {
        setActiveGroup({ name: group.group_name, id: group.group_id, admin: admin_id })
        setFormStatus('invite_form')
    }

    if (form_status === 'invite_complete') {
        return (
            <MainSection>
                <FormWrapper>
                    <Success />
                </FormWrapper>
            </MainSection>
        )
    }

    if (form_status === 'skip') {
        return (
            <MainSection>
                <FormWrapper>
                    <Success text="You have created your first group!" />
                </FormWrapper>
            </MainSection>
        )
    }

    if (form_status === 'invite_form') {
        return (
            <MainSection>
                <FormWrapper>
                    <InviteForm
                        onSuccess={() => setFormStatus('invite_complete')}
                        has_skip
                        onSkip={() => setFormStatus('skip')}
                    />
                </FormWrapper>
            </MainSection>
        )
    }

    return (
        <MainSection>
            <FormWrapper>
                <Formik
                    initialValues={{ group_name: '' }}
                    validate={values => {
                        const errors = {}
                        if (!values.group_name) {
                            errors.group_name = 'Required'
                        }
                        return errors
                    }}
                    onSubmit={async (values, { setStatus }) => {
                        setFormStatus('loading_new_group')

                        const token = await getTokenSilently()

                        fetch(`http://localhost:3000/new-group`, {
                            method: 'POST',
                            body: JSON.stringify({
                                group_name: values.group_name,
                                user_id: user.sub,
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        })
                            .then(data => data.json())
                            .then(async res => {
                                console.log('res: ', res)
                                if (res.error) {
                                    setStatus({ msg: res.error })
                                    return
                                }
                                const res_group = await initSocket({
                                    group_id: res.group_id,
                                    user_id: user.sub,
                                })
                                setNewGroup(res, res_group.group.admin.id)
                            })
                    }}
                >
                    {({ isSubmitting, status }) => (
                        <Form>
                            <Field
                                name="group_name"
                                render={({ field, form }) => (
                                    <FormControl isInvalid={form.errors.group_name && form.touched.group_name}>
                                        <Heading size="lg" mb={4} htmlFor="group-name">
                                            What's the name of your group?
                                        </Heading>
                                        <Input
                                            {...field}
                                            type="text"
                                            id="group-name"
                                            placeholder="E.g. The ones who knock"
                                            data-lpignore="true"
                                        />
                                        <FormErrorMessage>{form.errors.group_name}</FormErrorMessage>
                                        {status && status.msg && (
                                            <Stack isInline align="center">
                                                <Icon color="red.500" name="warning" size="18px" />
                                                <Text>Server error {status.msg}, please try again</Text>
                                            </Stack>
                                        )}
                                    </FormControl>
                                )}
                            />
                            <Flex justify="flex-end">
                                <Button
                                    mt={4}
                                    className="btn-primary"
                                    type="submit"
                                    id="form-submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {form_status === 'loading_new_group' ? <Spinner /> : 'Create group'}
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </FormWrapper>
        </MainSection>
    )
}
