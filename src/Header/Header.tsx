import { AppBar, createStyles, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      justifyItems: 'center',
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
      <AppBar position='static'>
        <Toolbar variant='dense' style={{ justifyContent: 'center' }}>
          <Typography variant='h6' color='inherit' aria-label='Utgiveles'>
            Utgiveles
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}
