import { useAppState } from '../app.context'
import ReactMarkdown from 'react-markdown'
import { Box, Chip, Typography } from '@material-ui/core'
import { format, parseISO } from 'date-fns'

export const ReleaseDetails = () => {
  const { selectedRelease, unreadReleases } = useAppState()

  return (
    <Box mt={12}>
      {selectedRelease?.body ? (
        <>
          <Typography variant='h4'>{selectedRelease.repoName}</Typography>
          <Typography variant='body1'>
            {format(parseISO(selectedRelease.createdAt), 'dd MMM yyyy @HH:mm')}{' '}
            {unreadReleases.includes(selectedRelease.id) ? (
              <Chip color='secondary' label='updated' size='small' style={{ marginLeft: 4 }} />
            ) : null}
          </Typography>
          <ReactMarkdown>{selectedRelease.body}</ReactMarkdown>
        </>
      ) : (
        <Typography variant='h5'>Select a repository to see the release notes here.</Typography>
      )}
    </Box>
  )
}
