import React from 'react'

import { CssBaseline } from '@material-ui/core'

import { Header } from './Header/Header'
import { Releases } from './Releases/Releases'

export const App = () => {
  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Releases />
    </div>
  )
}
