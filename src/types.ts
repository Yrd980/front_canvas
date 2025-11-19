export interface SelectedElement {
  path: string // DOM path like "div > header > h1"
  tagName: string
  classes: string[]
  styles: Record<string, string>
  element: HTMLElement
}

export interface Change {
  elementPath: string
  elementTag: string
  elementClasses: string[]
  property: string
  oldValue: string
  newValue: string
  timestamp: number
}
