import {
  Box,
  createStyles,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Theme,
  Toolbar,
  makeStyles,
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: 240,
      flexShrink: 0,
      padding: 16,
    },
    drawerPaper: {
      width: 240,
    },
    drawerContainer: {
      overflow: 'auto',
    },
  })
)

export const Releases = () => {
  const classes = useStyles()

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          <Box px={2}>
            <Skeleton
              variant='rect'
              width={208}
              height={48}
              style={{ marginTop: 8 }}
              animation='wave'
            />
            <Skeleton
              variant='rect'
              width={208}
              height={48}
              style={{ marginTop: 8 }}
              animation='wave'
            />
            <Skeleton
              variant='rect'
              width={208}
              height={48}
              style={{ marginTop: 8 }}
              animation='wave'
            />
          </Box>
        </List>
      </div>
    </Drawer>
  )
}
