import React from 'react'
import { useAuth0 } from '../../react-auth0-spa'
import { useHistory } from 'react-router-dom'
import { Heading, Button, Text, Spinner, Stack } from '@chakra-ui/core'
import { MainSection, FormWrapper, Lottie } from '../../components/container'
import tadaAnimation from '../../assets/lotties/13491-pop-new-year.json'

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    var results = regex.exec(window.location.search)
    return results === null
        ? ''
        : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export const ExternalInvite = ({ ...props }) => {
    const [status, setStatus] = React.useState('loading')
    const [group_res, setGroupRes] = React.useState({})

    const { isAuthenticated, user } = useAuth0()
    const history = useHistory()

    React.useEffect(() => {
        async function fetchGroupDetails({ group_id, user_id }) {
            fetch(`http://localhost:3000/group-invite-details`, {
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
        setStatus('loading_add_to_group')
        // add user to existing group
        fetch(`http://localhost:3000/new-group-member`, {
            method: 'POST',
            body: JSON.stringify({
                group_id: group_res.id,
                user_id: user.sub,
                inviter_id: group_res.inviter_id,
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
                setStatus('')
                // setGroupRes(res)
                // setStatus('added_to_g')
            })
    }

    const redirectToSignup = () => {
        // redirect user to signup with query string for group
        // --> after signup automatically add user to group
    }

    return (
        <MainSection>
            <FormWrapper>
                {status === 'loading' && <Spinner />}
                {status === 'has_group_details' && (
                    <Stack>
                        <Heading size="lg" textAlign="center">
                            {group_res.inviter} has invited you to join the
                            group {group_res.group_name} on lagom
                        </Heading>
                        <Lottie
                            animationData={tadaAnimation}
                            height={200}
                            width={200}
                            loop={true}
                        />
                        {isAuthenticated && (
                            <Stack
                                isInline
                                marginTop="16px"
                                justify="center"
                                spacing={4}
                            >
                                <Button>Decline</Button>
                                <Button
                                    onClick={() => joinGroup()}
                                    variantColor="teal"
                                >
                                    {status === 'loading_add_to_group' ? (
                                        <Spinner />
                                    ) : (
                                        'Accept'
                                    )}
                                </Button>
                            </Stack>
                        )}
                        {!isAuthenticated && (
                            <Stack
                                isInline
                                marginTop="16px"
                                justify="center"
                                spacing={4}
                            >
                                <Button onClick={() => history.push('/')}>
                                    Decline
                                </Button>
                                <Button
                                    onClick={() => redirectToSignup()}
                                    variantColor="teal"
                                >
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
