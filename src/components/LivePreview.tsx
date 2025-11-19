import { useEffect, useRef, useState, useCallback } from 'react'
import { SelectedElement, Change } from '../types'

interface LivePreviewProps {
  code: string
  selectedElement: SelectedElement | null
  onElementSelect: (element: SelectedElement) => void
  changes: Change[]
}

export default function LivePreview({ code, selectedElement, onElementSelect, changes }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const elementCacheRef = useRef<Map<string, HTMLElement>>(new Map())

  // Memoize getElementPath to use in both useEffects
  const getElementPath = useCallback((element: HTMLElement): string => {
    const path: string[] = []
    let current: HTMLElement | null = element

    while (current && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
      let selector = current.tagName.toLowerCase()

      // Add classes if available
      if (current.classList.length > 0) {
        selector += '.' + Array.from(current.classList).filter(c => !c.includes('overlay')).join('.')
      }

      // Add index if there are siblings with same tag
      const siblings = current.parentElement?.children
      if (siblings && siblings.length > 1) {
        const sameTagSiblings = Array.from(siblings).filter(s => s.tagName === current!.tagName)
        if (sameTagSiblings.length > 1) {
          const index = Array.from(siblings).indexOf(current)
          selector += `:nth-child(${index + 1})`
        }
      }

      path.unshift(selector)
      current = current.parentElement
    }

    return path.join(' > ')
  }, [])

  // Effect 1: Initialize iframe and set up event listeners (only when code changes)
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    // Inject Tailwind CDN and content
    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { margin: 0; }
            .element-hover-overlay {
              outline: 2px dashed #3b82f6 !important;
              outline-offset: 2px !important;
            }
            .element-selected-overlay {
              outline: 2px solid #10b981 !important;
              outline-offset: 2px !important;
            }
          </style>
        </head>
        <body>
          ${code}
        </body>
      </html>
    `)
    doc.close()

    // Wait for iframe to be ready
    const setupIframe = () => {
      if (!doc.body) return

      // Build element cache for faster lookups
      elementCacheRef.current.clear()
      const elements = doc.querySelectorAll('*')
      elements.forEach(el => {
        const path = getElementPath(el as HTMLElement)
        elementCacheRef.current.set(path, el as HTMLElement)
      })

      // Apply all existing changes to the fresh iframe
      changes.forEach(change => {
        const element = elementCacheRef.current.get(change.elementPath)
        if (element) {
          element.style.setProperty(change.property, change.newValue)
        }
      })

      // Add event listeners for selection
      const handleMouseOver = (e: MouseEvent) => {
        e.stopPropagation()
        const target = e.target as HTMLElement
        if (target.tagName === 'HTML' || target.tagName === 'BODY') return

        target.classList.add('element-hover-overlay')
        setHoveredPath(getElementPath(target))
      }

      const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        target.classList.remove('element-hover-overlay')
        setHoveredPath(null)
      }

      const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const target = e.target as HTMLElement
        if (target.tagName === 'HTML' || target.tagName === 'BODY') return

        // Remove previous selection
        doc.querySelectorAll('.element-selected-overlay').forEach(el => {
          el.classList.remove('element-selected-overlay')
        })

        // Add new selection
        target.classList.add('element-selected-overlay')
        target.classList.remove('element-hover-overlay')

        const computedStyles = iframe.contentWindow?.getComputedStyle(target)
        const styles: Record<string, string> = {}

        // Extract relevant styles
        if (computedStyles) {
          const properties = [
            'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
            'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
            'color', 'background-color', 'border-color',
            'font-size', 'font-weight', 'line-height',
            'display', 'flex-direction', 'justify-content', 'align-items', 'gap'
          ]

          properties.forEach(prop => {
            styles[prop] = computedStyles.getPropertyValue(prop)
          })
        }

        onElementSelect({
          path: getElementPath(target),
          tagName: target.tagName.toLowerCase(),
          classes: Array.from(target.classList).filter(c => !c.includes('overlay')),
          styles,
          element: target
        })
      }

      doc.body.addEventListener('mouseover', handleMouseOver)
      doc.body.addEventListener('mouseout', handleMouseOut)
      doc.body.addEventListener('click', handleClick)

      // Return cleanup function
      return () => {
        if (doc.body) {
          doc.body.removeEventListener('mouseover', handleMouseOver)
          doc.body.removeEventListener('mouseout', handleMouseOut)
          doc.body.removeEventListener('click', handleClick)
        }
      }
    }

    // Wait a bit for the iframe to render
    const timeoutId = setTimeout(setupIframe, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [code, getElementPath, onElementSelect]) // Only depend on code changes

  // Effect 2: Apply property changes without recreating iframe
  useEffect(() => {
    if (changes.length === 0) return

    const iframe = iframeRef.current
    if (!iframe?.contentDocument) return

    // Apply only the latest change
    const latestChange = changes[changes.length - 1]
    const element = elementCacheRef.current.get(latestChange.elementPath)

    if (element) {
      element.style.setProperty(latestChange.property, latestChange.newValue)
    }
  }, [changes])

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-white font-semibold">Live Preview</h2>
        <p className="text-gray-400 text-xs mt-1">
          {hoveredPath || selectedElement?.path || 'Hover over elements to inspect, click to select'}
        </p>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="preview"
        />
      </div>
    </div>
  )
}
