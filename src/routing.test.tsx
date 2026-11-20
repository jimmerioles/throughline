import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { Root } from './Root'

function setHash(hash: string) {
  window.history.replaceState(null, '', `/${hash}`)
}

describe('hash routing', () => {
  beforeEach(() => {
    setHash('')
  })

  it('renders the flat board at the root', () => {
    render(<Root />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'The Lumen' }),
    ).toBeInTheDocument()
  })

  it('renders the case study from the hash and returns to the board', async () => {
    const user = userEvent.setup()
    setHash('#/case-study')
    render(<Root />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Canvas speed. HTML manners.',
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByRole('link', { name: 'Skip to the case study' }),
    ).toBeInTheDocument()

    const back = within(
      screen.getByRole('banner', { name: 'Case study' }),
    ).getByRole('link', {
      name: 'Back to the board',
    })
    expect(back).toHaveAttribute('href', '#/')

    await user.click(back)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'The Lumen' }),
    ).toBeInTheDocument()
  })

  it('opens the case study from the demo top bar', async () => {
    const user = userEvent.setup()
    render(<Root />)

    await user.click(screen.getByRole('link', { name: 'Read the case study' }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Canvas speed. HTML manners.',
      }),
    ).toBeInTheDocument()
  })
})
