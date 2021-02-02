import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { Header } from './Header/Header'
import { ReleaseList } from './ReleaseList/ReleaseList'
import { ReleaseDetails } from './ReleaseDetails/ReleaseDetails'

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#036cc8',
    },
    secondary: {
      main: '#259ea6',
    },
  },
})

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: 'flex' }}>
        <Header />
        <ReleaseList />
        <ReleaseDetails />
      </div>
    </ThemeProvider>
  )
}
