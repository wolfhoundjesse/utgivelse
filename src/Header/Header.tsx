import {
  AppBar,
  Box,
  Chip,
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: theme.zIndex.drawer + 1,
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

type RepositoryDetails = {
  id: number
  name: string
  description: string
  archived: boolean
}

type HeaderProps = {
  addRelease: (releases: any) => void
}

export const Header = ({ addRelease }: HeaderProps) => {
  const classes = useStyles()

  const [options, setOptions] = useState<RepositoryDetails[]>([])

  const handleInputChange = useDebouncedFn(async (event: any, value: string, reason: string) => {
    if (!value) {
      setOptions([])
      return
    }
    const { data } = await octokit.search.repos({
      q: value,
    })
    console.log(data.items.filter((item) => item.archived))
    setOptions(
      data.items.map((item) => ({
        id: item.id,
        name: item.full_name,
        description: item.description,
        archived: item.archived,
      }))
    )
  }, 250)

  const handleOnChange = async (event: any, value: RepositoryDetails | null, reason: string) => {
    if (!value) return
    let [owner, repo] = value.name.split('/')
    const { data } = await octokit.repos.getLatestRelease({
      owner,
      repo,
    })
    // TODO: Decide which data we care about, and give it to the releaseList component
    console.log(data)
  }

  return (
    <div className={classes.root}>
      <AppBar position='fixed'>
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={classes.search}
                  label='Search Repos'
                  margin='dense'
                  variant='filled'
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: null,
                    endAdornment: null,
                    type: 'search',
                  }}
                />
              )}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}
