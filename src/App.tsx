import React, { useState } from 'react'

import { CssBaseline } from '@material-ui/core'

import { Header } from './Header/Header'
import { ReleaseList } from './ReleaseList/ReleaseList'

export const App = () => {
  const [releases, setReleases] = useState<any[]>([])

  const handleAddRelease = (release: any) => setReleases((prev) => [...prev, release])

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Header addRelease={handleAddRelease} />
      <ReleaseList releases={releases} />
    </div>
  )
}
