import { useContext } from 'react'
import {
  TokenContext,
  TokenContextValue,
} from '../context/TokenContextProvider'
import { LoginOrSignupFormData, ServerResponse } from './types'

interface useLoginOrSignupApi {
  login(data: LoginOrSignupFormData): Promise<ServerResponse>
  signup(data: LoginOrSignupFormData): Promise<ServerResponse>
}

const useLoginOrSignup = (): useLoginOrSignupApi => {
  //TODO: create a encapsulation to catch errors
  const context = useContext<TokenContextValue | undefined>(TokenContext)
  const login = async ({ email, password }: LoginOrSignupFormData) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const body = await response.json()
      if (body.token) {
        context?.setTokenValue(body.token)
      }
      return { status: response.status, body }
    } catch (error) {
      return { body: { error: error.message } }
    }
  }

  const signup = async ({ email, password }: LoginOrSignupFormData) => {
    try {
      const user = { email, password }
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      const body = await response.json()

      await login(user)

      return { status: response.status, body }
    } catch (error) {
      return { body: { error: error.message } }
    }
  }

  return {
    login,
    signup,
  }
}

export default useLoginOrSignup
