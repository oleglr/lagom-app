import React from 'react'
import { useAuth0 } from '../../react-auth0-spa'
import { useHistory } from 'react-router-dom'
import { Heading, Button, Spinner, Stack } from '@chakra-ui/core'
import { MainSection, FormWrapper, Lottie } from '../../components/container'
import { Error } from '../../components/elements'
import { getUrlParameter } from '../../utils/history'
import tadaAnimation from '../../assets/lotties/13491-pop-new-year.json'

export const ExternalInvite = ({ ...props }) => {
    const [status, setStatus] = React.useState('loading')
    const [form_status, setFormStatus] = React.useState('')
    const [group_res, setGroupRes] = React.useState({})

    const { isAuthenticated, user, getTokenSilently } = useAuth0()
    const history = useHistory()

    React.useEffect(() => {
        async function fetchGroupDetails({ group_id, user_id }) {
            fetch(`${process.env.REACT_APP_API}/group-invite-details`, {
                method: 'POST',
                body: JSON.stringify({
                    group_id: group_id,
                    user_id: user_id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(data => data.json())
                .then(res => {
                    console.log('res: ', res)
                    if (res.error) {
                        setStatus('error')
                        return
                    }
                    setGroupRes({ ...res, group_id, inviter_id: user_id })
                    setStatus('has_group_details')
                })
        }
        const group_id = getUrlParameter('g')
        const user_id = getUrlParameter('u')

        if (group_id && user_id) {
            // get user name and group name
            fetchGroupDetails({ group_id, user_id })
        } else {
            history.push('/')
        }
    }, [history])

    const joinGroup = async () => {
        setFormStatus('loading')

        // add user to existing group
        const token = await getTokenSilently()

        fetch(`${process.env.REACT_APP_API}/new-group-member`, {
            method: 'POST',
            body: JSON.stringify({
                group_id: group_res.group_id,
                user_id: user.sub,
                inviter_id: group_res.inviter_id,
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(data => data.json())
            .then(res => {
                console.log('res: ', res)
                if (res.error) {
                    setGroupRes(res.error)
                    setStatus('error')
                    return
                }
                // TODO ==:
                // added to group ---> update user + active id
                // for now:
                window.location.replace(process.env.REACT_APP_META_KEY)
                // setGroupRes(res)
                // setStatus('added_to_g')
            })
    }

    const redirectToSignup = () => {
        // redirect user to signup with query string for group
        // --> after signup automatically add user to group
        localStorage.setItem('signup_group_id', group_res.group_id)
        localStorage.setItem('signup_inviter_id', group_res.inviter_id)
        history.push(`/sign-up`)
    }

    return (
        <MainSection>
            <FormWrapper>
                {status === 'error' && <Error text={`Error: ${group_res}`} />}
                {status === 'loading' && <Spinner />}
                {status === 'has_group_details' && (
                    <Stack>
                        <Heading size="lg" textAlign="center">
                            {group_res.inviter} has invited you to join the group {group_res.group_name} on lagom
                        </Heading>
                        <Lottie animationData={tadaAnimation} height={200} width={200} loop={true} />
                        {isAuthenticated && (
                            <Stack isInline marginTop="16px" justify="center" spacing={4}>
                                <Button>Decline</Button>
                                <Button onClick={() => joinGroup()} variantColor="teal">
                                    {form_status === 'loading' ? <Spinner /> : 'Accept'}
                                </Button>
                            </Stack>
                        )}
                        {!isAuthenticated && (
                            <Stack isInline marginTop="16px" justify="center" spacing={4}>
                                <Button onClick={() => history.push('/')}>Decline</Button>
                                <Button onClick={() => redirectToSignup()} variantColor="teal">
                                    Sign me up!
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                )}
            </FormWrapper>
        </MainSection>
    )
}
