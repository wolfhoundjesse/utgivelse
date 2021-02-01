import React from 'react'

import { Header } from './Header/Header'
import { ReleaseList } from './ReleaseList/ReleaseList'
import { ReleaseDetails } from './ReleaseDetails/ReleaseDetails'

export const App = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Header />
      <ReleaseList />
      <ReleaseDetails />
    </div>
  )
}
