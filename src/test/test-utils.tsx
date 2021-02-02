import { render as tlrRender, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@material-ui/core'
import { theme } from '../App'
import { AppProvider } from '../app.context'
import { ReactElement, ReactNode } from 'react'

export const render = (ui: ReactElement, { ...options } = {} as Omit<RenderOptions, 'queries'>) => {
  const Wrapper = ({ children }: { children?: ReactNode }) => (
    <AppProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppProvider>
  )

  return tlrRender(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
