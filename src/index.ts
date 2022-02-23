import { Matrix as _Matrix } from './matrix'
import type { MatrixOptions, MatrixDynamicOptions } from './matrix'

class Matrix {
  private _: _Matrix

  constructor(container: HTMLElement, options: MatrixOptions) {
    this._ = new _Matrix(container, options)
  }

  get isRunning(): boolean {
    return this._.isRunning
  }

  start(): void {
    this._.start()
  }

  stop(): void {
    this._.stop()
  }

  clear(): void {
    this._.clear()
  }

  pause(): void {
    this._.pause()
  }

  setOptions(options: Partial<MatrixDynamicOptions>): void {
    this._.setOptions(options)
  }
}

export { Matrix }
export type { MatrixOptions }
