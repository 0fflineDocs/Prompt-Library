import { PixelField, TideField, scramble, tideTone, tideValue, waveValue } from './effects'

describe('PixelField', () => {
  it('re-measures its canvas when the card resizes while active', () => {
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { frames.push(cb); return frames.length })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    const canvas = document.createElement('canvas')
    canvas.getContext = (() => ({ clearRect() {}, fillRect() {}, fillStyle: '' })) as never
    let size = { width: 320, height: 210 }
    canvas.getBoundingClientRect = () => ({ ...size, top: 0, left: 0, right: size.width, bottom: size.height, x: 0, y: 0, toJSON() {} })

    const field = new PixelField()
    field.attach(canvas, '#ff6a5c')
    expect([canvas.width, canvas.height]).toEqual([64, 42])

    size = { width: 200, height: 210 }
    frames.shift()!(performance.now())
    expect([canvas.width, canvas.height]).toEqual([40, 42])

    field.destroy()
    vi.unstubAllGlobals()
  })
})

describe('waveValue', () => {
  it('stays within 0..1', () => {
    for (let x = -50; x <= 50; x += 7)
      for (let y = -50; y <= 50; y += 9)
        for (const t of [0, 1234, 98765]) {
          const v = waveValue(x, y, t)
          expect(v).toBeGreaterThanOrEqual(0)
          expect(v).toBeLessThanOrEqual(1)
        }
  })
})

describe('scramble', () => {
  let now = 0
  let queue: FrameRequestCallback[] = []

  beforeEach(() => {
    now = 0
    queue = []
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { queue.push(cb); return queue.length })
    vi.stubGlobal('cancelAnimationFrame', () => {})
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

  const advance = (ms: number) => {
    now += ms
    const run = queue
    queue = []
    run.forEach((cb) => cb(now))
  }

  it('settles on the real text', () => {
    const el = document.createElement('span')
    scramble(el, 'AI News', 50)
    for (let i = 0; i < 10; i++) advance(10)
    expect(el.textContent).toBe('AI News')
  })

  it('never replaces spaces mid-animation', () => {
    const el = document.createElement('span')
    scramble(el, 'Prompt Library', 100)
    advance(20)
    expect(el.textContent).toHaveLength('Prompt Library'.length)
    expect(el.textContent![6]).toBe(' ')
  })
})

describe('tideValue', () => {
  it('stays within 0..1', () => {
    for (let x = 0; x <= 400; x += 13)
      for (let y = 0; y <= 300; y += 11)
        for (const t of [0, 4321, 987654]) {
          const v = tideValue(x, y, t)
          expect(v).toBeGreaterThanOrEqual(0)
          expect(v).toBeLessThanOrEqual(1)
        }
  })
})

describe('tideTone', () => {
  it('leaves empty water empty and lights every cell of a full crest', () => {
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) {
        expect(tideTone(0, x, y)).toBe(-1)
        expect(tideTone(1, x, y)).toBe(2)
      }
  })
})

describe('TideField', () => {
  const makeCanvas = (width: number, height: number) => {
    const canvas = document.createElement('canvas')
    const putImageData = vi.fn()
    canvas.getContext = (() => ({
      createImageData: (w: number, h: number) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
      putImageData,
    })) as never
    canvas.getBoundingClientRect = () => ({ width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0, toJSON() {} })
    return { canvas, putImageData }
  }
  afterEach(() => vi.unstubAllGlobals())

  it('coarsens its cells on large screens instead of growing the grid', () => {
    vi.stubGlobal('requestAnimationFrame', () => 1)
    vi.stubGlobal('cancelAnimationFrame', () => {})
    const small = makeCanvas(1280, 800)
    new TideField(small.canvas).start()
    expect([small.canvas.width, small.canvas.height]).toEqual([320, 200])

    const huge = makeCanvas(3840, 2160)
    new TideField(huge.canvas).start()
    expect(huge.canvas.width * huge.canvas.height).toBeLessThanOrEqual(140_000)
  })

  it('paints one still frame and never animates under reduced motion', () => {
    const raf = vi.fn()
    vi.stubGlobal('requestAnimationFrame', raf)
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const { canvas, putImageData } = makeCanvas(800, 600)
    const tide = new TideField(canvas)
    tide.start()
    expect(putImageData).toHaveBeenCalledTimes(1)
    expect(raf).not.toHaveBeenCalled()
    tide.destroy()
  })
})
