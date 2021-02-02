import React from 'react'
import { render, screen } from './test/test-utils'
import { App } from './App'

test('renders learn react link', () => {
  render(<App />)
  const brand = screen.getByText(/utgiveles/i)
  expect(brand).toBeInTheDocument()
})
