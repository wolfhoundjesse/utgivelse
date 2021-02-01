import {
  Badge,
  Box,
  Button,
  Chip,
  createStyles,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
  Toolbar,
  makeStyles,
  Avatar,
  Typography,
  IconButton,
} from '@material-ui/core'
import { Delete, Refresh } from '@material-ui/icons'
import { useDebouncedFn } from 'beautiful-react-hooks'
import { octokit } from '../utils'
import { format, isAfter, parseISO } from 'date-fns'
import { useAppDispatch, useAppState } from '../app.context'
import { useState } from 'react'

const drawerwidth = 360

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      marginRight: theme.spacing(1),
    },
    drawer: {
      width: drawerwidth,
      flexShrink: 0,
      padding: 16,
    },
    drawerPaper: {
      width: drawerwidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    toolbar: {
      height: 84,
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingBottom: theme.spacing(2),
    },
  })
)

export const ReleaseList = () => {
  const classes = useStyles()
  const { releases, selectedRelease, unreadReleases } = useAppState()
  const dispatch = useAppDispatch()

  const deleteRelease = (releaseId: number) =>
    dispatch({ type: 'DeleteRelease', payload: releaseId })

  const checkForNewReleases = useDebouncedFn(
    async () => {
      Promise.all(
        releases.map(async (release) => {
          const [owner, repo] = release.repoName.split('/')
          const { data } = await octokit.repos.getLatestRelease({
            owner,
            repo,
          })
          if (isAfter(Date.now(), parseISO(release.createdAt))) {
            dispatch({ type: 'UpdateReleaseNotes', payload: { id: data.id, body: data.body } })
          }
        })
      )
    },
    1000,
    { leading: true }
  )

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar className={classes.toolbar} />
        <div className={classes.drawerContainer}>
          <List dense>
            {releases?.length > 0 ? (
              <>
                <ListItem className={classes.actionButtons}>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => dispatch({ type: 'ClearReleases' })}
                    startIcon={<Delete />}
                  >
                    Clear List
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => checkForNewReleases()}
                    style={{ marginLeft: 8 }}
                    startIcon={<Refresh />}
                  >
                    Update All
                  </Button>
                </ListItem>
                {releases.map((release) => (
                  <ListItem
                    key={release.id}
                    button
                    onClick={() => dispatch({ type: 'SelectRelease', payload: release.id })}
                    selected={selectedRelease?.id === release.id}
                  >
                    <ListItemAvatar>
                      <Badge
                        color='secondary'
                        variant='dot'
                        invisible={!unreadReleases.includes(release.id)}
                      >
                        <Avatar alt={release.repoName} src={release.avatarUrl} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      disableTypography
                      primary={<Typography variant='body1'>{release.repoName}</Typography>}
                      secondary={
                        <>
                          <Typography variant='caption'>
                            {unreadReleases.includes(release.id) ? (
                              <mark>
                                {format(parseISO(release.createdAt), 'dd MMM yyyy @HH:mm')}
                              </mark>
                            ) : (
                              <span>
                                {format(parseISO(release.createdAt), 'dd MMM yyyy @HH:mm')}
                              </span>
                            )}
                          </Typography>
                          <Box display='flex' mt={0.5}>
                            {release.draft ? (
                              <Chip
                                component='span'
                                className={classes.chip}
                                label='draft'
                                color='secondary'
                                size='small'
                              />
                            ) : null}
                            {release.prerelease ? (
                              <Chip
                                component='span'
                                className={classes.chip}
                                label='prerelease'
                                color='secondary'
                                size='small'
                              />
                            ) : null}
                          </Box>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => deleteRelease(release.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </>
            ) : (
              <ListItem>
                <ListItemText primary='Search for some release notes to get started!' />
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>
    </>
  )
}
