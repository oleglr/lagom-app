import React from 'react'
import styled from '@emotion/styled'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  FormHelperText,
} from '@chakra-ui/core'
import { Heading, Button, Text } from '@chakra-ui/core'
import { Flex } from '../../components/container'
import { ReactComponent as FacebookIcon } from '../../assets/svgs/facebook.svg'
import { ReactComponent as GoogleIcon } from '../../assets/svgs/google.svg'

const MainSection = styled.section`
  height: 100%;
  width: 100%;
  padding-top: 4rem;
  background-color: var(--moon-blue);
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

const SocialWrapper = styled(Flex)`
  #fb-btn {
    margin-right: 12px;
  }
  @media (max-width: 600px) {
    #fb-btn {
      margin-right: 0;
      margin-bottom: 16px;
    }
  }
`

export const SignUpForm = () => {
  return (
    <MainSection>
      <FormWrapper>
        <Heading size="lg" textAlign="center">
          Join Lagom
        </Heading>
        <FormControl style={{ padding: '0 2rem' }}>
          <FormLabel mt={8} htmlFor="email">
            Email address
          </FormLabel>
          <Input type="email" id="email" aria-describedby="email-helper-text" />
          <FormHelperText id="email-helper-text">
            We'll never share your email.
          </FormHelperText>
          <FormLabel mt={4} htmlFor="password">
            Password
          </FormLabel>
          <Input type="password" id="password" />
          <Flex justify="flex-end">
            <Button
              width="100px"
              mt={8}
              className="btn-primary"
              type="submit"
              id="form-submit-btn"
            >
              Sign up
            </Button>
          </Flex>
        </FormControl>
        <Text mt={4} mb={4} textAlign="center" color="var(--grey)">
          Or sign up with
        </Text>
        <SocialWrapper columnSize="600px">
          <Button variant="outline" id="fb-btn">
            <FacebookIcon style={{ height: '28px', paddingRight: '5px' }} />
            <Text fontWeight="normal">Sign up with Facebook</Text>
          </Button>
          <Button variant="outline" id="google-btn">
            <GoogleIcon style={{ height: '32px' }} />
            <Text fontWeight="normal">Sign up with Google</Text>
          </Button>
        </SocialWrapper>
      </FormWrapper>
    </MainSection>
  )
}
