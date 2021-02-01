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
import { useDebouncedFn } from 'beautiful-react-hooks'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppState } from '../app.context'
import { ReleaseDetails, RepositoryDetails } from '../models'
import { octokit } from '../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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

export const Header = () => {
  const classes = useStyles()
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<RepositoryDetails[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const { error, releases } = useAppState()

  useEffect(() => inputRef?.current?.focus(), [])

  useEffect(() => {
    const searchRepos = async (query: string) => {
      try {
        setIsLoading(true)
        const { data } = await octokit.search.repos({
          q: query,
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
        dispatch({ type: 'SetError', payload: "Oops! GitHub's API returned an error. Try again!" })
        console.log('Error: Header.tsx => handleInputChange: ', error)
      }
    }
    if (Boolean(query)) {
      searchRepos(query)
    } else {
      setOptions([])
    }
  }, [dispatch, query])

  const handleInputChange = useDebouncedFn(
    (event: any, value: string, reason: string) => setQuery(value),
    250
  )

  const handleOnChange = async (event: any, value: any, reason: string) => {
    dispatch({ type: 'ClearError' })
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
      // Error on body: null for now
      if (!releaseDetails.body) {
        throw new Error(`Body for ${releaseDetails.repoName} is empty.`)
      }
      addRelease(releaseDetails)
    } catch (error) {
      dispatch({
        type: 'SetError',
        payload: `There are no release notes associated with ${owner}/${repo}. Please try again.`,
      })
    }
  }

  const addRelease = (releaseDetails: ReleaseDetails) => {
    if (releases.map((release) => release.id).includes(releaseDetails.id)) {
      dispatch({
        type: 'SetError',
        payload: `${releaseDetails.repoName} is already being tracked. Try again.`,
      })
      return
    }
    dispatch({ type: 'AddRelease', payload: releaseDetails })
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
              freeSolo
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
