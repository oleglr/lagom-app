import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from '@emotion/styled'
import { Heading, Button, Text } from '@chakra-ui/core'

import legoAnimation from '../../assets/lotties/410-lego-loader.json'
import { Flex, Lottie } from '../../components/container'
import { useAuth0 } from '../../react-auth0-spa'

const Hero = styled.section`
  height: 90vh;
`

const SignUp_ = ({ ...props }) => {
  const { loginWithRedirect } = useAuth0()

  return (
    <Hero>
      <Flex style={{ marginTop: '10rem' }}>
        <Flex column style={{ width: '60%', paddingLeft: '12rem' }}>
          <Heading as="h1" style={{ textAlign: 'left' }} fontSize="42px">
            Social media for your social circles that doesn't suck.
          </Heading>
          <Text style={{ margin: '16px 0', textAlign: 'left' }}>
            Connect with your friends and only your friends.
          </Text>
          <Flex style={{ marginTop: '16px' }} justify="unset">
            <Button
              className="btn-primary"
              style={{ marginRight: '16px' }}
              onClick={() => props.history.push('/sign-up')}
            >
              Sign up
            </Button>
            <Button onClick={() => loginWithRedirect({})} variant="outline">
              Login
            </Button>
          </Flex>
        </Flex>
        <div style={{ width: '50%' }}>
          <div style={{ marginTop: '-7rem', paddingRight: '10rem' }}>
            <Lottie animationData={legoAnimation} height={500} width={300} />
          </div>
        </div>
      </Flex>
    </Hero>
  )
}

export const SignUp = withRouter(SignUp_)
