import React from 'react'
import styled from '@emotion/styled'
import {
    Button,
    Heading,
    Input,
    Spinner,
    Text,
    Stack,
    Icon,
} from '@chakra-ui/core'
import { useAuth0 } from '../../../react-auth0-spa'
import { useGlobal } from '../../../context/global-context'

const HoverStack = styled(Stack)`
    &:hover {
        cursor: pointer;
        color: var(--primary);
    }
`

const LinkText = styled(Text)`
    &:hover {
        cursor: pointer;
        color: var(--primary);
    }
`

export const InviteForm = ({ has_skip = false, onSuccess, onSkip }) => {
    const [invite_status, setInviteStatus] = React.useState('in_progress')
    const [inputs, setInputs] = React.useState([''])

    const { getTokenSilently, user } = useAuth0()
    const { active_group } = useGlobal()

    const updateInput = (e, idx) => {
        const new_inputs = [...inputs]
        new_inputs[idx] = e.target.value
        setInputs(new_inputs)
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
                group_id: active_group.id,
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
                onSuccess()
            })
    }

    return (
        <>
            <Heading size="lg">Invite friends to {active_group.name}</Heading>
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
                    <Stack isInline mb="16px" align="center" justify="flex-end">
                        <HoverStack
                            isInline
                            align="center"
                            onClick={() => {
                                if (inputs.length >= 10) return
                                setInputs([...inputs, ''])
                            }}
                        >
                            <Icon name="plus-square" size="18px" />
                            <Text>Add another</Text>
                        </HoverStack>
                    </Stack>
                    {invite_status === 'missing_inputs' && (
                        <Stack isInline align="center">
                            <Icon color="red.500" name="warning" size="18px" />
                            <Text>Add at least one email</Text>
                        </Stack>
                    )}
                    {invite_status === 'incorrect_email' && (
                        <Stack isInline align="center">
                            <Icon color="red.500" name="warning" size="18px" />
                            <Text>
                                Emails should be in the format name@email.com
                            </Text>
                        </Stack>
                    )}
                    {invite_status === 'api_error' && (
                        <Stack isInline align="center">
                            <Icon color="red.500" name="warning" size="18px" />
                            <Text>Server error, please try again</Text>
                        </Stack>
                    )}
                    <Button
                        className="btn-primary"
                        type="submit"
                        width="150px"
                        alignSelf="flex-end"
                    >
                        {invite_status === 'sending' ? (
                            <Spinner />
                        ) : (
                            'Send invite'
                        )}
                    </Button>
                </Stack>
            </form>
            {/* TODO: Add sharable invite link here:  */}
            <Stack isInline mt="16px" mb="16px" align="center">
                <Icon name="link" size="18px" />
                <Text>Get an invite link to share</Text>
            </Stack>
            {has_skip && (
                <LinkText textAlign="center" mt={4} onClick={() => onSkip()}>
                    Or, skip for now
                </LinkText>
            )}
        </>
    )
}
