import React, { useState } from 'react'

import { CssBaseline } from '@material-ui/core'

import { Header } from './Header/Header'
import { ReleaseList } from './ReleaseList/ReleaseList'
import { ReleaseDetails } from './models'
import { useLocalStorage } from 'beautiful-react-hooks'
import { DuplicationError } from './utils/custom-errors'

export const App = () => {
  const [releaseCache, setReleaseCache] = useLocalStorage<ReleaseDetails[]>('releases', [])
  const [releases, setReleases] = useState<ReleaseDetails[]>(releaseCache || [])

  const handleAddRelease = (releaseDetails: ReleaseDetails) => {
    if (releases.map((release) => release.id).includes(releaseDetails.id)) {
      throw new DuplicationError(
        `${releaseDetails.repoName} is already being tracked. Please try again.`
      )
    }
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
