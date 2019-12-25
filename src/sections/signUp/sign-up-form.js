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
import { Formik, Form, Field } from 'formik'
import { Flex } from '../../components/container'
import { ReactComponent as FacebookIcon } from '../../assets/svgs/facebook.svg'
import { ReactComponent as GoogleIcon } from '../../assets/svgs/google.svg'
import { useAuth0 } from '../../react-auth0-spa'

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

function hasLowerCase(str) {
  return /[a-z]/.test(str)
}
function hasUpperCase(str) {
  return /[A-Z]/.test(str)
}
function hasNumber(str) {
  return /[0-9]/.test(str)
}
function hasSpecialCharacter(str) {
  return /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(str)
}

export const SignUpForm = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <MainSection>
      <FormWrapper>
        <Heading size="lg" textAlign="center">
          Join Lagom
        </Heading>
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={values => {
            const errors = {}
            if (!values.email) {
              errors.email = 'Required'
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address'
            }
            if (!values.password) {
              errors.password = 'Required'
            } else if (!hasLowerCase(values.password)) {
              errors.password = 'Include lower case character'
            } else if (!hasUpperCase(values.password)) {
              errors.password = 'Include upper case character'
            } else if (!hasNumber(values.password)) {
              errors.password = 'Include number'
            } else if (!hasSpecialCharacter(values.password)) {
              errors.password = 'include special character'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit: ', values)
            setSubmitting(true)
            setSubmitting(false)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                name="email"
                render={({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                  >
                    <FormLabel mt={8} htmlFor="email">
                      Email address
                    </FormLabel>
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      aria-describedby="email-helper-text"
                    />
                    <FormHelperText id="email-helper-text">
                      We'll never share your email.
                    </FormHelperText>
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              />
              <Field
                name="password"
                render={({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel mt={4} htmlFor="password">
                      Password
                    </FormLabel>
                    <Input {...field} type="password" id="password" />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              />
              <Flex justify="flex-end">
                <Button
                  width="100px"
                  mt={8}
                  className="btn-primary"
                  type="submit"
                  id="form-submit-btn"
                  disabled={isSubmitting}
                >
                  Sign up
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
        <Text mt={4} mb={4} textAlign="center" color="var(--grey)">
          Or sign up with
        </Text>
        <SocialWrapper columnSize="600px">
          <Button
            variant="outline"
            id="fb-btn"
            onClick={() => loginWithRedirect({ connection: 'facebook' })}
          >
            <FacebookIcon style={{ height: '28px', paddingRight: '5px' }} />
            <Text fontWeight="normal">Sign up with Facebook</Text>
          </Button>
          <Button
            variant="outline"
            id="google-btn"
            onClick={() => loginWithRedirect({ connection: 'google-oauth2' })}
          >
            <GoogleIcon style={{ height: '32px' }} />
            <Text fontWeight="normal">Sign up with Google</Text>
          </Button>
        </SocialWrapper>
      </FormWrapper>
    </MainSection>
  )
}
