import React, { useState } from 'react'

import { CssBaseline } from '@material-ui/core'

import { Header } from './Header/Header'
import { ReleaseList } from './ReleaseList/ReleaseList'
import { ReleaseDetails } from './models'
import { useLocalStorage } from 'beautiful-react-hooks'

export const App = () => {
  const [releaseCache, setReleaseCache] = useLocalStorage<ReleaseDetails[]>('releases', [])
  const [releases, setReleases] = useState<ReleaseDetails[]>(releaseCache || [])

  const handleAddRelease = (releaseDetails: ReleaseDetails) => {
    console.log(releaseDetails)
    setReleases((prev) => [...prev, releaseDetails])
    setReleaseCache(releaseCache ? [...releaseCache, releaseDetails] : [releaseDetails])
  }

  const handleDelete = (releaseId: number) => {
    setReleases((prev) => prev.filter((release) => release.id !== releaseId))
    setReleaseCache(releaseCache.filter((release) => release.id !== releaseId))
  }

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Header addRelease={handleAddRelease} />
      <ReleaseList releases={releases} deleteRelease={handleDelete} />
    </div>
  )
}
