import { TideField, tideTone, tideValue } from './effects'

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
    const small = makeCanvas(1280, 800)
    new TideField(small.canvas).start()
    expect([small.canvas.width, small.canvas.height]).toEqual([320, 200])

    const huge = makeCanvas(3840, 2160)
    new TideField(huge.canvas).start()
    expect(huge.canvas.width * huge.canvas.height).toBeLessThanOrEqual(140_000)
  })

  it('paints one still frame and never animates', () => {
    const raf = vi.fn()
    vi.stubGlobal('requestAnimationFrame', raf)
    const { canvas, putImageData } = makeCanvas(800, 600)
    const tide = new TideField(canvas)
    tide.start()
    expect(putImageData).toHaveBeenCalledTimes(1)
    expect(raf).not.toHaveBeenCalled()
    tide.destroy()
  })
})
