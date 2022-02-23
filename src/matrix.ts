import { randomInt } from './helpers'

export interface MatrixOptions {
  font: FontOptions
  symbols?: () => string | string[]
}

export type MatrixDynamicOptions = Pick<MatrixOptions, 'symbols'>

interface FontOptions {
  family: string
  file: string
  size: number,
  colors?: string[]
  descriptors?: FontFaceDescriptors
}

export class Matrix {
  public ctx: CanvasRenderingContext2D
  public canvas: HTMLCanvasElement
  public font: FontFace

  private target: HTMLElement
  private fontSize: number
  private colors: string[]
  private traces: number[] = []
  private tracesCount: number
  private symbols: (() => string | string[]) | undefined
  private running = false

  constructor(container: HTMLElement, { font, symbols }: MatrixOptions) {
    this.target = container
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.target.appendChild(this.canvas)
    this.setSize()

    this.font = new FontFace(font.family, `url(${font.file})`, font.descriptors)
    this.fontSize = font.size
    this.symbols = symbols
    this.colors = font.colors || [
      '#225400',
      '#66FF00',
      '#155400',
      '#395410',
      '#7FFF00',
      '#005400',
      '#2A5400',
      '#3FFF00',
      '#00FF00',
      '#ADFF2F'
    ]

    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize, false)
  }

  get isRunning(): boolean {
    return this.running
  }

  start(): void {
    if (this.running) {
      return
    }

    this.font.load().then(() => {
      this.running = true
      this.render()
    }).catch(() => {
      throw new Error('Failed loading `font.file`')
    })
  }

  stop(): void {
    this.running = false
    window.removeEventListener('resize', this.handleResize, false)
    this.clear()
  }

  clear(): void {
    if (!this.ctx) {
      return
    }

    this.traces = []
    this.ctx.save()
    this.ctx.globalCompositeOperation = 'copy'
    this.ctx.lineTo(0, 0)
    this.ctx.stroke()
    this.ctx.restore()
  }

  pause(): void {
    this.running = !this.running
    if (this.running) {
      this.render()
    }
  }

  setOptions(options: Partial<MatrixDynamicOptions>): void {
    Object.assign(this, options)
  }

  private getColor(): string {
    return this.colors[randomInt(0, this.colors.length - 1)]
  }

  private handleResize(): void {
    this.setSize()
    this.clear()
  }

  private setSize(): void {
    this.canvas.width = this.target.clientWidth
    this.canvas.height = this.target.clientHeight
  }

  private initTraces(): void {
    this.tracesCount = Math.round(window.innerWidth / this.fontSize)

    while (this.traces.length !== this.tracesCount) {
      this.traces.push(randomInt(0, window.innerHeight))
    }
  }

  private render(): void {
    if (!this.ctx || !this.running) {
      return
    }

    if (this.traces.length !== this.tracesCount) {
      this.initTraces()
    }

    window.requestAnimationFrame(() => this.render())

    this.ctx.fillStyle = 'rgba(0, 0, 0, .05)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = this.getColor()
    this.ctx.font = `${this.fontSize}pt ${this.font.family}`

    this.traces.map((y, i) => {
      const char = String.fromCharCode(100 + 28 * Math.random())
      const symbol = this.symbols?.call(this)
      const x = i * this.fontSize
      const s = typeof symbol === 'object' && !!symbol.length ? symbol[randomInt(0, symbol.length - 1)] : char
      this.ctx.fillText(s, x, y)

      if (y > 100 + Math.random() * 10000) {
        this.traces[i] = 0
      } else {
        this.traces[i] = y + 10
      }
    })
  }
}
