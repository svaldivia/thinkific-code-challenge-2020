import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormField,
  Heading,
  Text,
  TextInput,
} from 'grommet'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import useCount from './useCount'

type CountFormData = {
  count: string
}

const Count = () => {
  const { register, handleSubmit, errors } = useForm()
  const history = useHistory()
  const [error, setError] = useState<string>()
  const [currentCount, setCurrentCount] = useState<string>()
  const { getCurrentInteger, getNextInteger, logout, resetInteger } = useCount()

  useEffect(() => {
    fetchCurrent()
  })
  const fetchCurrent = async () => {
    const response = await getCurrentInteger()

    if (response?.status === 200) {
      setCurrentCount(response.body.count)
    } else if (response?.status === 401) {
      history.push('/')
    } else {
      setError(response.body?.error)
    }
  }

  const onResetInteger = async ({ count }: CountFormData) => {
    const response = await resetInteger(count)

    if (response?.status === 200) {
      setCurrentCount(response.body.count)
    } else if (response?.status === 401) {
      history.push('/')
    } else {
      setError(response.body?.error)
    }
  }

  const handleLogout = () => {
    logout()
    history.push('/')
  }

  const handleNextIntegerClick = async () => {
    const response = await getNextInteger()

    if (response?.status === 200) {
      setCurrentCount(response.body.count)
    } else if (response?.status === 401) {
      history.push('/')
    } else {
      setError(response.body?.error)
    }
  }

  return (
    <Card height="600px" width="medium" background="light-1">
      <CardHeader pad="medium" align="center" background="light-2">
        <Text weight="bold">Counter</Text>
      </CardHeader>
      <CardBody pad="medium">
        <Heading textAlign="center">{currentCount}</Heading>
        <Box pad={{ vertical: 'medium' }}>
          <Button onClick={handleNextIntegerClick} label="Next Count" />
        </Box>
        <Form onSubmit={handleSubmit(onResetInteger)}>
          <FormField label="New Count">
            <TextInput
              name="count"
              type="number"
              ref={register({ required: true })}
            />
          </FormField>
          {errors.count && <Text size="small">Count is required</Text>}
          <Box direction="column" pad={{ vertical: 'medium' }} gap="small">
            <Button type="submit" label="Set Count" />
          </Box>
        </Form>
        <Button primary onClick={handleLogout} label="Log Out" />
        <Box pad={{ vertical: 'medium' }}>
          {error && <Text color="red">{error}</Text>}
        </Box>
      </CardBody>
    </Card>
  )
}
export default Count
