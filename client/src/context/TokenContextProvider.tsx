import React, { useState } from 'react'

export interface TokenContextValue {
  setTokenValue(value: string): void
  clearTokenValue(): void
  currentToken?: string
}

export const TokenContext = React.createContext<TokenContextValue | undefined>(
  undefined
)

interface TokenContextProviderProps {
  children: React.ReactNode
}

const TokenContextProvider = ({ children }: TokenContextProviderProps) => {
  const [token, setToken] = useState<string>()

  const setTokenValue = (value: string) => {
    setToken(value)
  }

  const clearTokenValue = () => {
    setToken(undefined)
  }

  return (
    <TokenContext.Provider
      value={{
        setTokenValue,
        clearTokenValue,
        currentToken: token,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

export default TokenContextProvider
