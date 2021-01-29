import {
  AppBar,
  Box,
  Chip,
  CircularProgress,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { Octokit } from '@octokit/rest'
import { useDebouncedFn } from 'beautiful-react-hooks'
import { useState } from 'react'
import { ReleaseDetails, RepositoryDetails } from '../models'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: theme.zIndex.drawer + 1,
    },
    appBar: {
      height: 84,
      justifyContent: 'center',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    search: {
      backgroundColor: 'white',
      borderRadius: theme.shape.borderRadius,
      minWidth: 400,
    },
  })
)

const octokit = new Octokit({
  auth: process.env.REACT_APP_OCTOKIT_AUTH_TOKEN,
  userAgent: 'utgiveles v0.1.0',
})

type HeaderProps = {
  addRelease: (releaseDetails: ReleaseDetails) => void
}

export const Header = ({ addRelease }: HeaderProps) => {
  const classes = useStyles()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [options, setOptions] = useState<RepositoryDetails[]>([])

  const handleInputChange = useDebouncedFn(async (event: any, value: string, reason: string) => {
    setError('')
    if (!value) {
      setOptions([])
      return
    }
    try {
      setIsLoading(true)
      const { data } = await octokit.search.repos({
        q: value,
      })
      setOptions(
        data.items.map((item) => ({
          id: item.id,
          name: item.full_name,
          avatarUrl: item.owner.avatar_url,
          description: item.description,
          archived: item.archived,
        }))
      )
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setError("Oops! GitHub's API returned an error. Try again!")
      console.log('Error: Header.tsx => handleInputChange: ', error)
    }
  }, 250)

  const handleOnChange = async (event: any, value: RepositoryDetails | null, reason: string) => {
    // clear errors when an item is selected
    setError('')
    if (!value) return
    let [owner, repo] = value.name.split('/')
    try {
      const { data } = await octokit.repos.getLatestRelease({
        owner,
        repo,
      })
      const releaseDetails: ReleaseDetails = {
        id: data.id,
        body: data.body,
        createdAt: data.created_at,
        draft: data.draft,
        prerelease: data.prerelease,
        repoName: value.name,
        avatarUrl: value.avatarUrl,
        tagName: data.tag_name,
      }
      addRelease(releaseDetails)
    } catch (error) {
      if ('name' in error && error.name === 'DuplicationError') {
        setError(error.message)
      } else {
        setError(
          `Oops! There are no release notes associated with ${owner}/${repo}. Please try again.`
        )
      }
    }
    // TODO: Decide which data we care about, and give it to the releaseList component
  }

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar variant='dense'>
          <Typography variant='h6' color='inherit' aria-label='Utgiveles'>
            Utgiveles
          </Typography>
          <Box mr={7} display='flex' justifyContent='center' flexGrow={1}>
            <Autocomplete
              id='github-repo-search'
              options={options}
              autoHighlight
              getOptionLabel={(option) => option.name}
              renderOption={(option) => (
                <Box display='flex' flexDirection='column'>
                  <Typography variant='h6'>{option.name}</Typography>
                  {option.archived ? (
                    <Chip size='small' label='archived' color='secondary' />
                  ) : null}
                  <Typography variant='body2'>{option.description}</Typography>
                </Box>
              )}
              getOptionSelected={(option, value) => option.id === value.id}
              onInputChange={handleInputChange}
              onChange={handleOnChange}
              loading={isLoading}
              closeIcon={null}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    className={classes.search}
                    label='Search repos to add …'
                    margin='dense'
                    variant='filled'
                    InputProps={{
                      ref: params.InputProps.ref,
                      endAdornment: (
                        <>{isLoading ? <CircularProgress color='inherit' size={20} /> : null}</>
                      ),
                      type: 'search',
                    }}
                    error={Boolean(error)}
                    helperText={Boolean(error) ? error : ''}
                  />
                )
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}
