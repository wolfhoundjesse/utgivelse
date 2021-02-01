import { Octokit } from '@octokit/rest'

export const octokit = new Octokit({
  auth: process.env.REACT_APP_OCTOKIT_AUTH_TOKEN,
  userAgent: 'utgiveles v0.1.0',
})
