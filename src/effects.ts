// Background effect, ported from Nexus (src/nexus/pixelWave.ts). The moving version and the card contact effects stay on AI Hub.

// 4×4 ordered-dither thresholds: turns the smooth wave into a pixel pattern
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)

// Tide: the dithered blue swell behind the whole page, painted as one still frame.
const TIDE_BASE_CELL = 4
// Large screens get coarser cells instead of more of them, so a 4K frame costs what a laptop frame does
const TIDE_MAX_CELLS = 140_000
const TIDE_WAVES = [
  { kx: 0.09, ky: 0.035, speed: 0.00022, amp: 1.0 },
  { kx: 0.045, ky: 0.07, speed: 0.00015, amp: 0.6 },
  { kx: 0.17, ky: 0.02, speed: 0.00035, amp: 0.3 },
]
const TIDE_WARP_AMP = 0.35
const TIDE_MAX_AMP = TIDE_WAVES.reduce((s, w) => s + w.amp, TIDE_WARP_AMP)
// Deep navy, royal blue, cyan crest as [r, g, b, a]
const TIDE_TONES = [[10, 24, 64, 140], [24, 70, 190, 128], [90, 190, 255, 112]] as const

/** Tide height at base cell (x, y) and time t, normalised to 0..1. */
export function tideValue(x: number, y: number, t: number): number {
  let v = 0
  for (const w of TIDE_WAVES) v += Math.sin(x * w.kx + y * w.ky - t * w.speed) * w.amp
  // A slowly warped long swell keeps the pattern from visibly repeating
  v += Math.sin((x * 0.02 + Math.sin(y * 0.03 + t * 0.0001)) * 3 + t * 0.00017) * TIDE_WARP_AMP
  return (v / TIDE_MAX_AMP) * 0.5 + 0.5
}

/** Dithered tone for a cell of strength v: -1 for empty, otherwise an index into the tide palette. */
export function tideTone(v: number, x: number, y: number): number {
  const th = BAYER[(y & 3) * 4 + (x & 3)]
  if (v > 0.62 + th * 0.25) return 2
  if (v > 0.38 + th * 0.3) return 1
  if (v > 0.18 + th * 0.3) return 0
  return -1
}

export class TideField {
  private ctx: CanvasRenderingContext2D | null
  private img: ImageData | null = null
  private cell = TIDE_BASE_CELL

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')
  }

  /** Paints the tide, and repaints it whenever the window resizes. */
  start() {
    this.resize()
    window.addEventListener('resize', this.resize)
  }

  destroy() {
    window.removeEventListener('resize', this.resize)
  }

  private resize = () => {
    const { width, height } = this.canvas.getBoundingClientRect()
    this.cell = Math.max(TIDE_BASE_CELL, Math.ceil(Math.sqrt((width * height) / TIDE_MAX_CELLS)))
    const W = Math.max(1, Math.ceil(width / this.cell)), H = Math.max(1, Math.ceil(height / this.cell))
    if (this.canvas.width !== W) this.canvas.width = W
    if (this.canvas.height !== H) this.canvas.height = H
    this.img = this.ctx?.createImageData(W, H) ?? null
    this.draw()
  }

  private draw() {
    const ctx = this.ctx, img = this.img
    if (!ctx || !img) return
    const { width: W, height: H, data } = img
    const s = this.cell / TIDE_BASE_CELL
    data.fill(0)
    for (let y = 0; y < H; y++) {
      // The swell rises from the bottom of the screen; the brand line and top cards sit on clean black
      const depth = (y / H) ** 1.6 * 0.95 + 0.134
      for (let x = 0; x < W; x++) {
        const tone = tideTone(tideValue(x * s, y * s, 0) * depth, x, y)
        if (tone < 0) continue
        data.set(TIDE_TONES[tone], (y * W + x) * 4)
      }
    }
    ctx.putImageData(img, 0, 0)
  }
}
