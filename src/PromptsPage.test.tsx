import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptsPage } from './PromptsPage'

beforeAll(() => {
  // jsdom has no canvas or modal dialog support
  HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) { this.open = true }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia
})

beforeEach(() => history.replaceState(null, '', '/'))

const cards = () => within(screen.getByRole('list')).getAllByRole('button')

describe('PromptsPage', () => {
  it('lists every prompt once loaded', async () => {
    render(<PromptsPage />)
    expect(await screen.findByRole('button', { name: /^Grill Me,/ })).toBeTruthy()
    expect(cards().length).toBeGreaterThan(40)
  })

  it('filters by category', async () => {
    render(<PromptsPage />)
    await screen.findByRole('button', { name: /^Grill Me,/ })
    await userEvent.click(screen.getByRole('button', { name: /^COMPLIANCE/ }))
    for (const card of cards()) expect(card.getAttribute('aria-label')).toMatch(/, Compliance/)
  })

  it('searches titles, descriptions and tags', async () => {
    render(<PromptsPage />)
    await screen.findByRole('button', { name: /^Grill Me,/ })
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search prompts' }), 'grill me')
    expect(cards().map((c) => c.getAttribute('aria-label'))).toContain('Grill Me, Strategy')
  })

  it('opens a prompt in a dialog and links to it', async () => {
    render(<PromptsPage />)
    await userEvent.click(await screen.findByRole('button', { name: /^Grill Me,/ }))
    const dialog = screen.getByRole('dialog', { name: 'Grill Me' })
    expect(within(dialog).getByRole('button', { name: 'Copy prompt' })).toBeTruthy()
    expect(within(dialog).getByRole('link', { name: /GitHub/ }).getAttribute('href')).toMatch(/grill-me\.json$/)
    expect(window.location.hash).toBe('#grill-me')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(window.location.hash).toBe('')
  })

  it('opens the prompt named in the URL hash', async () => {
    history.replaceState(null, '', '/#grill-me')
    render(<PromptsPage />)
    expect(await screen.findByRole('dialog', { name: 'Grill Me' })).toBeTruthy()
  })
})
