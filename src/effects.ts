// Card contact effects, ported from Nexus (src/nexus/pixelWave.ts and src/nexus/repos/effects.ts).
// Imperative and framework-free so pointer movement never re-renders React.

const WAVES = [
  { kx: 0.28, ky: 0.06, speed: 0.00055, amp: 1.0 },
  { kx: 0.14, ky: 0.18, speed: 0.00038, amp: 0.55 },
  { kx: 0.52, ky: 0.10, speed: 0.00090, amp: 0.30 },
]
const MAX_AMP = WAVES.reduce((s, w) => s + w.amp, 0)

/** Wave height at cell (x, y) and time t, normalised to 0..1. */
export function waveValue(x: number, y: number, t: number): number {
  let v = 0
  for (const w of WAVES) v += Math.sin(x * w.kx + y * w.ky - t * w.speed) * w.amp
  return (v / MAX_AMP) * 0.5 + 0.5
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const CELL = 5
// 4×4 ordered-dither thresholds: turns the smooth wave into a pixel pattern
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)
const REVEAL_MS = 420

const hexToRgb = (hex: string): [number, number, number] =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]

/**
 * A dithered wave field in a site's colour that sweeps in from the left and
 * concentrates around the pointer. One instance serves the whole grid.
 */
export class PixelField {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private rgb: [number, number, number] = [255, 255, 255]
  private intensity = 0
  private target = 0
  private start = 0
  private raf = 0
  private px = 0
  private py = 0

  attach(canvas: HTMLCanvasElement, color: string, pointer?: { x: number; y: number }) {
    if (this.canvas && this.canvas !== canvas) this.clear()
    const rect = this.measure(canvas)
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.rgb = hexToRgb(color)
    this.start = performance.now()
    this.target = 1
    this.intensity = 0
    if (pointer) { this.px = pointer.x; this.py = pointer.y }
    else { this.px = rect.width * 0.3; this.py = rect.height / 2 }
    if (!this.raf) this.raf = requestAnimationFrame(this.frame)
  }

  pointer(x: number, y: number) { this.px = x; this.py = y }

  release() { this.target = 0 }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
    this.clear()
    this.canvas = null
  }

  /** Matches the canvas grid to the card's current size so the field never stretches. */
  private measure(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    const w = Math.max(1, Math.ceil(rect.width / CELL)), h = Math.max(1, Math.ceil(rect.height / CELL))
    if (canvas.width !== w) canvas.width = w
    if (canvas.height !== h) canvas.height = h
    return rect
  }

  private clear() {
    this.ctx?.clearRect(0, 0, this.canvas?.width ?? 0, this.canvas?.height ?? 0)
  }

  private frame = (ts: number) => {
    const ctx = this.ctx, canvas = this.canvas
    if (!ctx || !canvas) { this.raf = 0; return }
    this.intensity += (this.target - this.intensity) * 0.14
    this.measure(canvas)

    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    const reveal = Math.min(1, (ts - this.start) / REVEAL_MS)
    const [r, g, b] = this.rgb
    const radius = Math.max(36, W * 0.5)
    const cx = this.px / CELL, cy = this.py / CELL
    const squash = 1.2, density = 0.75, alpha = 0.32

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const fx = x / W
        if (fx > reveal) continue
        const dx = x - cx, dy = (y - cy) * squash
        let m = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / radius)
        m *= m
        const v = waveValue(x * 1.6, y * 2.5, ts * 2.2) * (0.12 + density * m) * this.intensity
        const edge = reveal < 1 && reveal - fx < 0.035
        if (edge || v > BAYER[(y & 3) * 4 + (x & 3)]) {
          const a = edge ? 0.85 * this.intensity : (0.1 + alpha * m) * this.intensity
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }

    if (this.target === 0 && this.intensity < 0.01) { this.clear(); this.raf = 0; return }
    this.raf = requestAnimationFrame(this.frame)
  }
}

const GLYPHS = '▓▒░<>/\\_#=+*01ΣΔ'
const scrambles = new WeakMap<HTMLElement, number>()

/** Resolves `text` left to right out of random glyphs. Decorative: use on aria-hidden nodes. */
export function scramble(el: HTMLElement, text: string, duration = 420) {
  cancelAnimationFrame(scrambles.get(el) ?? 0)
  const t0 = performance.now()
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration)
    let out = ''
    for (let i = 0; i < text.length; i++) {
      const settled = i / text.length < p * 1.15 - 0.1
      out += settled || text[i] === ' ' ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = out
    if (p < 1) scrambles.set(el, requestAnimationFrame(step))
  }
  scrambles.set(el, requestAnimationFrame(step))
}

// Tide: the dithered blue swell behind the whole hub. Same material as PixelField, much quieter.
const TIDE_BASE_CELL = 4
// Large screens get coarser cells instead of more of them, so a 4K frame costs what a laptop frame does
const TIDE_MAX_CELLS = 140_000
const TIDE_FRAME_MS = 33
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
  private raf = 0
  private last = -Infinity
  private still = false

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')
  }

  start() {
    this.still = prefersReducedMotion()
    this.resize()
    window.addEventListener('resize', this.resize)
    if (!this.still) this.raf = requestAnimationFrame(this.frame)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
    window.removeEventListener('resize', this.resize)
  }

  private resize = () => {
    const { width, height } = this.canvas.getBoundingClientRect()
    this.cell = Math.max(TIDE_BASE_CELL, Math.ceil(Math.sqrt((width * height) / TIDE_MAX_CELLS)))
    const W = Math.max(1, Math.ceil(width / this.cell)), H = Math.max(1, Math.ceil(height / this.cell))
    if (this.canvas.width !== W) this.canvas.width = W
    if (this.canvas.height !== H) this.canvas.height = H
    this.img = this.ctx?.createImageData(W, H) ?? null
    if (this.still) this.draw(0)
  }

  private frame = (ts: number) => {
    this.raf = requestAnimationFrame(this.frame)
    // The swell is slow enough that 30fps is indistinguishable from 60
    if (ts - this.last < TIDE_FRAME_MS) return
    this.last = ts
    this.draw(ts)
  }

  private draw(t: number) {
    const ctx = this.ctx, img = this.img
    if (!ctx || !img) return
    const { width: W, height: H, data } = img
    const s = this.cell / TIDE_BASE_CELL
    data.fill(0)
    for (let y = 0; y < H; y++) {
      // The swell rises from the bottom of the screen; the brand line and top cards sit on clean black
      const depth = (y / H) ** 1.6 * 0.95 + 0.134
      for (let x = 0; x < W; x++) {
        const tone = tideTone(tideValue(x * s, y * s, t) * depth, x, y)
        if (tone < 0) continue
        data.set(TIDE_TONES[tone], (y * W + x) * 4)
      }
    }
    ctx.putImageData(img, 0, 0)
  }
}
