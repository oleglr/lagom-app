import React from 'react'
import styled from '@emotion/styled'
import {
    Heading,
    FormControl,
    FormErrorMessage,
    Input,
    Spinner,
    Text,
    Stack,
    Icon,
} from '@chakra-ui/core'
import { Button } from '@chakra-ui/core'
import { Formik, Form, Field } from 'formik'
import { Flex } from '../../../components/container'
import { useAuth0 } from '../../../react-auth0-spa'
import { useHistory } from 'react-router-dom'

const MainSection = styled.section`
    height: 100%;
    width: 100%;
    padding-top: 4rem;
`

const FormWrapper = styled.div`
    margin: 0 auto;
    max-width: 600px;
    background-color: var(--white);
    padding: 4rem 16px;
    border-radius: 0.25rem;

    @media (max-width: 600px) {
        #form-submit-btn {
            width: 100%;
        }
    }
`

const LinkText = styled(Text)`
    &:hover {
        cursor: pointer;
        color: #3182ce;
    }
`

export const NewGroup = () => {
    const [form_status, setFormStatus] = React.useState('in_progress')
    const [invite_status, setInviteStatus] = React.useState('in_progress')
    const [new_group, setGroup] = React.useState({})
    const [inputs, setInputs] = React.useState(['', '', ''])

    const { getTokenSilently, user } = useAuth0()
    const history = useHistory()
    const setNewGroup = (group, cb) => {
        setGroup(group)
        setFormStatus('complete')
    }

    const onSubmit = async e => {
        e.preventDefault()

        const email_list = inputs.filter(Boolean)
        if (!email_list.length) {
            setInviteStatus('missing_inputs')
            return
        }
        if (
            !email_list.filter(
                v => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v)
            ).length
        ) {
            setInviteStatus('incorrect email')
        }
        setInviteStatus('sending')
        const token = await getTokenSilently()

        fetch(`http://localhost:3000/invite-to-group`, {
            method: 'POST',
            body: JSON.stringify({
                group_id: new_group.id,
                user_id: user.sub,
                email_list,
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(data => data.json())
            .then(res => {
                if (res.error) {
                    setInviteStatus('api_error')
                }
                setFormStatus('invite_complete')
            })
    }

    const updateInput = (e, idx) => {
        const new_inputs = [...inputs]
        new_inputs[idx] = e.target.value
        setInputs(new_inputs)
    }

    if (form_status === 'invite_complete') {
        return (
            <MainSection>
                <FormWrapper>
                    <Heading mb={4} size="lg">
                        Fantastic{' '}
                        <span aria-label="thumbsup" role="img">
                            👍
                        </span>
                    </Heading>
                    <Text mb={4}>
                        All that is left now is to wait for your friends to join
                    </Text>
                    <Button
                        variantColor="teal"
                        onClick={() => history.push('/')}
                    >
                        Go to group
                    </Button>
                </FormWrapper>
            </MainSection>
        )
    }

    if (form_status === 'complete') {
        return (
            <MainSection>
                <FormWrapper>
                    <Heading size="lg">
                        Invite friends to {new_group.group_name}
                    </Heading>
                    <form onSubmit={onSubmit}>
                        <Stack spacing={4} mt={4}>
                            {inputs.map((value, i) => {
                                return (
                                    <Input
                                        key={i}
                                        value={value}
                                        onChange={e => updateInput(e, i)}
                                        type="email"
                                        placeholder="e.g. name@gmail.com"
                                        data-lpignore="true"
                                    />
                                )
                            })}
                            <Stack
                                isInline
                                mb="16px"
                                align="center"
                                justify="flex-end"
                            >
                                <Stack
                                    isInline
                                    align="center"
                                    onClick={() => {
                                        if (inputs.length >= 10) return
                                        setInputs([...inputs, ''])
                                    }}
                                >
                                    <Icon
                                        name="plus-square"
                                        size="18px"
                                        color="blue.500"
                                    />
                                    <LinkText>Add another</LinkText>
                                </Stack>
                            </Stack>
                            {invite_status === 'missing_inputs' && (
                                <Stack isInline align="center">
                                    <Icon
                                        color="red.500"
                                        name="warning"
                                        size="18px"
                                    />
                                    <Text>Add at least one email</Text>
                                </Stack>
                            )}
                            {invite_status === 'incorrect_email' && (
                                <Stack isInline align="center">
                                    <Icon
                                        color="red.500"
                                        name="warning"
                                        size="18px"
                                    />
                                    <Text>
                                        Emails should be in the format
                                        name@email.com
                                    </Text>
                                </Stack>
                            )}
                            {invite_status === 'api_error' && (
                                <Stack isInline align="center">
                                    <Icon
                                        color="red.500"
                                        name="warning"
                                        size="18px"
                                    />
                                    <Text>Server error, please try again</Text>
                                </Stack>
                            )}
                            <Button className="btn-primary" type="submit">
                                {invite_status === 'sending' ? (
                                    <Spinner />
                                ) : (
                                    'Send invites'
                                )}
                            </Button>
                        </Stack>
                    </form>
                    {/* TODO: Add sharable invite link here:  */}
                    <Stack isInline mt="16px" mb="16px" align="center">
                        <Icon name="link" size="18px" />
                        <Text>Get an invite link to share</Text>
                    </Stack>
                    <LinkText textAlign="center" mt={4}>
                        Or, skip for now
                    </LinkText>
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
                            .then(res => {
                                if (res.error) {
                                    setStatus({ msg: res.error })
                                    return
                                }
                                setNewGroup(res)
                            })
                    }}
                >
                    {({ isSubmitting, status }) => (
                        <Form>
                            <Field
                                name="group_name"
                                render={({ field, form }) => (
                                    <FormControl
                                        isInvalid={
                                            form.errors.group_name &&
                                            form.touched.group_name
                                        }
                                    >
                                        <Heading
                                            size="lg"
                                            mb={4}
                                            htmlFor="group-name"
                                        >
                                            What's the name of your group?
                                        </Heading>
                                        <Input
                                            {...field}
                                            type="text"
                                            id="group-name"
                                            placeholder="E.g. The ones who knock"
                                        />
                                        <FormErrorMessage>
                                            {form.errors.group_name}
                                        </FormErrorMessage>
                                        {status && status.msg && (
                                            <Stack isInline align="center">
                                                <Icon
                                                    color="red.500"
                                                    name="warning"
                                                    size="18px"
                                                />
                                                <Text>
                                                    Server error {status.msg},
                                                    please try again
                                                </Text>
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
                                    {form_status === 'loading_new_group' ? (
                                        <Spinner />
                                    ) : (
                                        'Create group'
                                    )}
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </FormWrapper>
        </MainSection>
    )
}
