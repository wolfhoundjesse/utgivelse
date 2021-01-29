import {
  Box,
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
import { Delete } from '@material-ui/icons'

import { Skeleton } from '@material-ui/lab'
import { ReleaseDetails } from '../models'
import { format, parseISO } from 'date-fns'

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
  })
)

type ReleaseListProps = {
  releases: ReleaseDetails[]
  deleteRelease: (releaseId: number) => void
}

export const ReleaseList = ({ deleteRelease, releases }: ReleaseListProps) => {
  const classes = useStyles()

  return (
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
            releases.map((release) => (
              <ListItem key={release.id} button>
                <ListItemAvatar>
                  <Avatar alt={release.repoName} src={release.avatarUrl} />
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={<Typography variant='body1'>{release.repoName}</Typography>}
                  secondary={
                    <>
                      <Typography variant='caption'>
                        {format(parseISO(release.createdAt), 'dd MMM yyyy @HH:mm')}
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
            ))
          ) : (
            <Box px={2}>
              {[...Array(5)].map((element, index) => (
                <Skeleton
                  key={index}
                  variant='rect'
                  width={208}
                  height={48}
                  style={{ marginTop: 8 }}
                  animation='wave'
                />
              ))}
            </Box>
          )}
        </List>
      </div>
    </Drawer>
  )
}
