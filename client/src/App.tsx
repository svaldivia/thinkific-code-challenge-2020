import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Box, Grommet } from 'grommet'

import LoginOrSignup from './components/LoginOrSignup'
import { FormType } from './components/types'
import TokenContextProvider from './context/TokenContextProvider'
import Count from './components/Count'

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
}

const App = () => {
  return (
    <Grommet theme={theme} full>
      <TokenContextProvider>
        <Box align="center" pad="medium" justify="center" fill>
          <Router>
            <Switch>
              <Route path="/" exact>
                <LoginOrSignup formType={FormType.Login} />
              </Route>
              <Route path="/signup" exact>
                <LoginOrSignup formType={FormType.SignUp} />
              </Route>
              <Route path="/count" exact>
                <Count />
              </Route>
              <Route path="*">
                <Box direction="column" gap="small" align="center">
                  ✨ Does not exist 🦄
                  <Link to="/"> Go back to app</Link>
                </Box>
              </Route>
            </Switch>
          </Router>
        </Box>
      </TokenContextProvider>
    </Grommet>
  )
}

export default App
