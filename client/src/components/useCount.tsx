import { useContext } from 'react'
import {
  TokenContextValue,
  TokenContext,
} from '../context/TokenContextProvider'
import { ServerResponse } from './types'

interface useCountApi {
  getCurrentInteger(): Promise<ServerResponse>
  getNextInteger(): Promise<ServerResponse>
  resetInteger(value: string): Promise<ServerResponse>
  logout(): void
}

const useCount = (): useCountApi => {
  const context = useContext<TokenContextValue | undefined>(TokenContext)
  const getCurrentInteger = async () => {
    try {
      const response = await fetch('/api/current', {
        headers: { Authorization: `Bearer ${context?.currentToken}` },
      })

      let body
      if (response.status === 401) {
        return { status: response.status, body: response.statusText }
      } else {
        body = await response.json()
      }

      return { status: response.status, body }
    } catch (error) {
      return { body: { error: error.message } }
    }
  }

  const getNextInteger = async () => {
    try {
      const response = await fetch('/api/next', {
        headers: { Authorization: `Bearer ${context?.currentToken}` },
      })

      let body
      if (response.status === 401) {
        return { status: response.status, body: response.statusText }
      } else {
        body = await response.json()
      }

      return { status: response.status, body }
    } catch (error) {
      return { body: { error: error.message } }
    }
  }

  const resetInteger = async (value: string) => {
    try {
      const response = await fetch('/api/reset', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${context?.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: value }),
      })

      let body
      if (response.status === 401) {
        return { status: response.status, body: response.statusText }
      } else {
        body = await response.json()
      }

      return { status: response.status, body }
    } catch (error) {
      return { body: { error: error.message } }
    }
  }

  const logout = () => {
    context?.clearTokenValue()
  }

  return {
    getCurrentInteger,
    getNextInteger,
    resetInteger,
    logout,
  }
}

export default useCount
