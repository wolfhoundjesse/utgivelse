import { AppBar, createStyles, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      justifyItems: 'center',
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
)

export const Header = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position='fixed'>
        <Toolbar variant='dense' style={{ justifyContent: 'center' }}>
          <Typography variant='h6' color='inherit' aria-label='Utgiveles'>
            Utgiveles
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}
