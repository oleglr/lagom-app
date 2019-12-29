import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from '@emotion/styled'
import { Heading, Button, Text } from '@chakra-ui/core'

import legoAnimation from '../../assets/lotties/410-lego-loader.json'
import { Flex, Lottie } from '../../components/container'
import { useAuth0 } from '../../react-auth0-spa'

const Hero = styled.div`
    height: 90vh;
`
const HeaderWrapper = styled(Flex)`
    width: 60%;
    padding-left: 12rem;

    @media (max-width: 1100px) {
        padding-left: 0;
    }
`
const LandingImageWrapper = styled.div`
    width: 50%;
    @media (max-width: 1100px) {
        display: none;
    }
`

const Container = styled.section`
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 8rem;

    @media (max-width: 1100px) {
        margin-top: 6rem;
    }
`

const SignUp_ = ({ ...props }) => {
    const { loginWithRedirect } = useAuth0()

    return (
        <Container>
            <Hero>
                <Flex>
                    <HeaderWrapper column>
                        <Heading
                            as="h1"
                            style={{ textAlign: 'left' }}
                            fontSize="42px"
                        >
                            Relax and express yourself.
                        </Heading>
                        <Text style={{ margin: '16px 0', textAlign: 'left' }}>
                            A small group based social media, connect with
                            family and close friends. Imagine a whatsapp group
                            with features such as photo albums, plan group
                            activities, split bills.
                        </Text>
                        <Flex justify="unset">
                            <Button
                                className="btn-primary"
                                style={{ marginRight: '16px' }}
                                onClick={() => props.history.push('/sign-up')}
                            >
                                Sign up
                            </Button>
                            <Button
                                onClick={() => loginWithRedirect({})}
                                variant="outline"
                            >
                                Login
                            </Button>
                        </Flex>
                    </HeaderWrapper>
                    <LandingImageWrapper>
                        <div
                            style={{
                                marginTop: '-7rem',
                                paddingRight: '10rem',
                            }}
                        >
                            <Lottie
                                animationData={legoAnimation}
                                height={500}
                                width={300}
                            />
                        </div>
                    </LandingImageWrapper>
                </Flex>
            </Hero>
        </Container>
    )
}

export const SignUp = withRouter(SignUp_)
