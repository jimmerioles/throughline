import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Throughline fallback experience', () => {
  it('lets a visitor edit a headline, check a task, and approve the direction', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'The Lumen' }),
    ).toBeInTheDocument()

    const headline = screen.getByRole('textbox', { name: 'Headline 1' })
    await user.clear(headline)
    await user.type(headline, 'A new line for the marquee.')
    expect(headline).toHaveValue('A new line for the marquee.')

    const checkbox = screen.getByRole('checkbox', {
      name: 'Marquee letters',
    })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Mark approved' }))

    expect(
      screen.getByRole('button', { name: 'Direction approved' }),
    ).toBeDisabled()
  })
})
