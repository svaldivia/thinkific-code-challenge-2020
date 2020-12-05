import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import {
  Card,
  CardBody,
  Text,
  CardHeader,
  Form,
  CardFooter,
  FormField,
  TextInput,
  Button,
  Box,
} from 'grommet'

import { LoginOrSignupFormData, FormType } from './types'
import useLoginOrSignup from './useLoginOrSignup'

interface LoginOrSignupProps {
  formType: FormType
}

const LoginOrSignup = ({ formType }: LoginOrSignupProps) => {
  const { register, handleSubmit, errors } = useForm()
  const [formError, setFormError] = useState<string>()
  const history = useHistory()
  const { login, signup } = useLoginOrSignup()

  const onSubmit = async (data: LoginOrSignupFormData) => {
    const loginOrSignUp = formType === FormType.Login ? login : signup
    const response = await loginOrSignUp(data)

    if (response?.status === 200) {
      history.push('/count')
    } else {
      setFormError(response.body?.error)
    }
  }

  return (
    <Card height="500px" width="medium" background="light-1">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader pad="medium" align="center" background="light-2">
          <Text weight="bold">Increment Integer App</Text>
        </CardHeader>
        <CardBody
          pad={{ horizontal: 'medium', top: 'medium', bottom: 'xsmall' }}
        >
          <FormField label="Email">
            <TextInput
              name="email"
              type="email"
              ref={register({ required: true })}
            />
          </FormField>
          {errors.email && <Text size="small">Email is required</Text>}
          <FormField label="Password">
            <TextInput
              name="password"
              type="password"
              ref={register({ required: true })}
            />
          </FormField>
          {errors.password && <Text size="small">Password is required</Text>}
          <Box pad={{ vertical: 'small' }}>
            <Button
              primary
              type="submit"
              label={formType === FormType.Login ? 'Login' : 'Sign Up'}
            />
          </Box>
          {formType === FormType.Login ? (
            <Box direction="row" align="center" pad={{ top: 'xsmall' }}>
              <Text> Don't have an account?</Text>
              <Link to="/signup">Sign up here!</Link>
            </Box>
          ) : (
            <Box direction="row" align="center" pad={{ top: 'xsmall' }}>
              <Text> Already have an account?</Text>
              <Link to="/">Login!</Link>
            </Box>
          )}
        </CardBody>
      </Form>
      <CardFooter justify="center">
        {formError && <Text color="red">{formError}</Text>}
      </CardFooter>
    </Card>
  )
}
export default LoginOrSignup
