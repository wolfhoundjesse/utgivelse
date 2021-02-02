import { render, waitFor } from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { Header } from './Header'

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

const searchRepoUrl = 'https://api.github.com/search/repositories'

describe('Search component in header', () => {
  test('returns a list of repos to be displayed in the dropdown', async () => {
    server.use(
      rest.get(searchRepoUrl, (req, res, ctx) =>
        res(
          ctx.json({
            items: [
              {
                id: 1,
                full_name: 'vuejs/vue',
                owner: { avatar_url: 'some_url' },
                description: 'some_description',
                archived: false,
              },
            ],
          })
        )
      )
    )

    const { getByText, getByRole, queryByText } = render(<Header />)

    const autoComplete = getByRole('combobox')

    expect(queryByText('vuejs/vue')).toBeNull()

    autoComplete.focus()
    userEvent.type(autoComplete, 'vuejs/vue')

    await waitFor(() => expect(getByText('vue')).toBeInTheDocument())
  })

  test('displays an error when GitHub presents some issue', async () => {
    server.use(
      rest.get(searchRepoUrl, (req, res, ctx) =>
        res(
          ctx.status(500),
          ctx.json({
            errorMessage: 'Everything is terrible.',
          })
        )
      )
    )

    const { getByText, getByRole, queryByText } = render(<Header />)

    const autoComplete = getByRole('combobox')
    expect(queryByText(/oops/i)).toBeNull()

    autoComplete.focus()
    userEvent.type(autoComplete, 'vue')

    await waitFor(() => expect(getByText(/oops/i)).toBeInTheDocument())
  })
})
