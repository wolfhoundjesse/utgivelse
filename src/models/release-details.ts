export type ReleaseDetails = {
  id: number
  body?: string | null
  createdAt: string
  draft: boolean
  prerelease: boolean
  repoName: string
  tagName: string
}
