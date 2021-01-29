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
    toolbar: {
      height: 84,
    },
  })
)

type ReleaseListProps = {
  releases: any
}

export const ReleaseList = ({ releases }: ReleaseListProps) => {
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
        <List>
          {releases?.length > 0 ? (
            <div>Yup</div>
          ) : (
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
          )}
        </List>
      </div>
    </Drawer>
  )
}
