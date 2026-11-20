import 'react'

declare global {
  interface HTMLCanvasElement {
    requestPaint: () => void
  }

  interface CanvasRenderingContext2D {
    drawElementImage: (
      element: Element,
      dx: number,
      dy: number,
      dWidth?: number,
      dHeight?: number,
    ) => void
  }

  interface CanvasPaintEvent extends Event {
    readonly changedElements: Element[]
  }
}

declare module 'react' {
  interface CanvasHTMLAttributes<T> {
    layoutsubtree?: string
    content?: 'drawable' | 'fallback'
    onpaint?: (event: CanvasPaintEvent) => void
  }

  interface HTMLAttributes<T> {
    drawable?: string
  }
}
