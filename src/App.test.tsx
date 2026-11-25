import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { DEFAULT_EDITABLE } from './board/data'

afterEach(() => {
  vi.unstubAllGlobals()
})

function readSavedEditable() {
  const raw = window.localStorage.getItem('throughline:board:v1')
  return raw ? JSON.parse(raw).editable : null
}

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

  it('restores edits, lead choice, checklist, and approval after a reload', async () => {
    const user = userEvent.setup()
    const view = render(<App />)

    const headline = screen.getByRole('textbox', { name: 'Headline 1' })
    await user.clear(headline)
    await user.type(headline, 'A headline that survives a reload.')
    await user.click(
      screen.getByRole('radio', { name: 'Make headline 2 the lead' }),
    )
    await user.click(screen.getByRole('checkbox', { name: 'Marquee letters' }))
    await user.click(screen.getByRole('button', { name: 'Mark approved' }))

    await waitFor(() => {
      expect(readSavedEditable()).toMatchObject({
        headlines: [
          'A headline that survives a reload.',
          DEFAULT_EDITABLE.headlines[1],
          DEFAULT_EDITABLE.headlines[2],
        ],
        headlineChoice: 1,
        approved: true,
      })
      expect(readSavedEditable()?.checklist[2]).toBe(true)
    })

    view.unmount()
    render(<App />)

    expect(screen.getByRole('textbox', { name: 'Headline 1' })).toHaveValue(
      'A headline that survives a reload.',
    )
    expect(
      screen.getByRole('radio', { name: 'Make headline 2 the lead' }),
    ).toBeChecked()
    expect(
      screen.getByRole('checkbox', { name: 'Marquee letters' }),
    ).toBeChecked()
    expect(
      screen.getByRole('button', { name: 'Direction approved' }),
    ).toBeDisabled()
  })

  it('resets edits, lead choice, checklist, and approval to the defaults', async () => {
    const user = userEvent.setup()
    render(<App />)

    const headline = screen.getByRole('textbox', { name: 'Headline 1' })
    await user.clear(headline)
    await user.type(headline, 'Temporary copy.')
    await user.click(
      screen.getByRole('radio', { name: 'Make headline 2 the lead' }),
    )
    await user.click(screen.getByRole('checkbox', { name: 'Marquee letters' }))
    await user.click(screen.getByRole('button', { name: 'Mark approved' }))

    await user.click(screen.getByRole('button', { name: 'Reset demo' }))

    expect(screen.getByRole('textbox', { name: 'Headline 1' })).toHaveValue(
      DEFAULT_EDITABLE.headlines[0],
    )
    expect(
      screen.getByRole('radio', { name: 'Make headline 1 the lead' }),
    ).toBeChecked()
    expect(
      screen.getByRole('checkbox', { name: 'Marquee letters' }),
    ).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Mark approved' })).toBeEnabled()

    await waitFor(() => {
      expect(readSavedEditable()).toEqual(DEFAULT_EDITABLE)
    })
  })

  it('falls back to defaults when saved editable state is incomplete', () => {
    window.localStorage.setItem(
      'throughline:board:v1',
      JSON.stringify({
        version: 1,
        positions: {},
        editable: {
          headlines: ['Only one line'],
          headlineChoice: 9,
          checklist: [true],
          approved: 'yes',
        },
      }),
    )

    render(<App />)

    expect(screen.getByRole('textbox', { name: 'Headline 1' })).toHaveValue(
      DEFAULT_EDITABLE.headlines[0],
    )
    expect(
      screen.getByRole('radio', { name: 'Make headline 1 the lead' }),
    ).toBeChecked()
    expect(
      screen.getByRole('checkbox', { name: 'Marquee letters' }),
    ).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Mark approved' })).toBeEnabled()
  })

  it('renders the compact flat view when the viewport is small', () => {
    vi.stubGlobal('CanvasRenderingContext2D', {
      prototype: { drawElementImage: vi.fn() },
    })
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    render(<App />)

    expect(
      screen.getByText('Compact view', { exact: true }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Present the board' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Headline 1' }),
    ).toBeInTheDocument()
  })
})
