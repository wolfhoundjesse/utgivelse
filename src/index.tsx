import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import reportWebVitals from './reportWebVitals'
import { AppProvider } from './app.context'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#036cc8',
    },
    secondary: {
      main: '#259ea6',
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
