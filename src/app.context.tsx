import { useLocalStorage } from 'beautiful-react-hooks'
import { isAfter, parseISO } from 'date-fns'
import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react'
import { ReleaseDetails } from './models'
import { octokit } from './utils'

type Action =
  | { type: 'LoadReleasesFromLocalStorage'; payload: ReleaseDetails[] }
  | { type: 'DeleteRelease'; payload: number }
  | { type: 'AddRelease'; payload: ReleaseDetails }
  | { type: 'SetError'; payload: string }
  | { type: 'ClearError' }
  | { type: 'SelectRelease'; payload: number }
  | { type: 'ClearReleases' }
  | { type: 'UpdateReleaseNotes'; payload: Pick<ReleaseDetails, 'id' | 'body'> }

type Dispatch = (action: Action) => void

type State = {
  releases: ReleaseDetails[]
  selectedRelease?: ReleaseDetails
  unreadReleases: number[]
  error: string
}

const initialState: State = {
  releases: [],
  unreadReleases: [],
  error: '',
}

const AppStateContext = createContext<State | undefined>(undefined)

const AppDispatchContext = createContext<Dispatch | undefined>(undefined)

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LoadReleasesFromLocalStorage':
      let releases = action.payload
      return {
        ...state,
        releases,
      }
    case 'AddRelease':
      let release = action.payload
      return {
        ...state,
        releases: [...state.releases, release],
        selectedRelease: release,
      }
    case 'DeleteRelease':
      let id = action.payload
      let clearSelectedRelease = state.selectedRelease?.id === id
      return {
        ...state,
        releases: state.releases.filter((release) => release.id !== id),
        selectedRelease: clearSelectedRelease ? undefined : state.selectedRelease,
        unreadReleases: state.unreadReleases.includes(id)
          ? state.unreadReleases.filter((releaseId) => releaseId !== id)
          : [...state.unreadReleases],
      }
    case 'SelectRelease': {
      let id = action.payload
      let selectedRelease = state.releases.find((release) => release.id === id)
      return {
        ...state,
        selectedRelease,
        unreadReleases: [...state.unreadReleases.filter((releaseId) => releaseId !== id)],
      }
    }
    case 'SetError':
      let error = action.payload
      return {
        ...state,
        error,
      }
    case 'ClearError':
      return {
        ...state,
        error: '',
      }
    case 'ClearReleases':
      return {
        ...initialState,
      }
    case 'UpdateReleaseNotes': {
      let id = action.payload.id
      let body = action.payload.body
      let releases = state.releases.map((release) =>
        release.id !== id ? release : { ...release, body }
      )
      let updateSelectedRelease = state.selectedRelease?.id === id
      return {
        ...state,
        releases,
        selectedRelease: updateSelectedRelease
          ? releases.find((release) => release.id === id)
          : state.selectedRelease,
        unreadReleases: [...state.unreadReleases, id],
      }
    }
    default:
      throw new Error(`Unhandled action type: ${(action as any).type}`)
  }
}

type Props = { children?: ReactNode }

export const AppProvider = ({ children }: Props) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    reducer,
    initialState
  )
  const [releaseCache, setReleaseCache] = useLocalStorage<ReleaseDetails[]>('releases', [])
  const { releases } = state

  useEffect(() => {
    if (isInitialized) {
      setReleaseCache(releases)
    }
  }, [isInitialized, releases, setReleaseCache])

  useEffect(() => {
    const checkForNewReleases = async () => {
      if (!releaseCache) {
        return
      }
      Promise.all(
        releaseCache.map(async (release) => {
          const [owner, repo] = release.repoName.split('/')
          const { data } = await octokit.repos.getLatestRelease({
            owner,
            repo,
          })
          if (isAfter(parseISO(data.created_at), parseISO(release.createdAt))) {
            dispatch({ type: 'UpdateReleaseNotes', payload: { id: data.id, body: data.body } })
          }
        })
      )
    }

    if (!isInitialized) {
      dispatch({ type: 'LoadReleasesFromLocalStorage', payload: releaseCache || [] })
      checkForNewReleases()
      setIsInitialized(true)
    }
  }, [isInitialized, releaseCache])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export const useAppState = (): State => {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error(`useAppState must be used within an AppProvider.`)
  }
  return context
}

export const useAppDispatch = (): Dispatch => {
  const context = useContext(AppDispatchContext)
  if (context === undefined) {
    throw new Error(`useAppDispatch must be used within an AppProvider`)
  }
  return context
}
