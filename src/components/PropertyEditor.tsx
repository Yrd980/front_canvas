import { SelectedElement } from '../types'

interface PropertyEditorProps {
  selectedElement: SelectedElement | null
  onPropertyChange: (property: string, value: string) => void
}

export default function PropertyEditor({ selectedElement, onPropertyChange }: PropertyEditorProps) {
  if (!selectedElement) {
    return (
      <div className="h-full bg-gray-800 p-4 text-gray-400 text-center flex items-center justify-center">
        <div>
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <p className="text-sm">Click an element in the preview to edit its properties</p>
        </div>
      </div>
    )
  }

  const parseValue = (value: string): number => {
    return parseInt(value) || 0
  }

  const createSliderInput = (label: string, property: string, max: number = 100) => (
    <div className="mb-4">
      <label className="block text-gray-300 text-xs font-semibold mb-2">
        {label}
        <span className="text-gray-500 ml-2">{selectedElement.styles[property] || '0px'}</span>
      </label>
      <input
        type="range"
        min="0"
        max={max}
        value={parseValue(selectedElement.styles[property])}
        onChange={(e) => onPropertyChange(property, `${e.target.value}px`)}
        className="w-full"
      />
    </div>
  )

  const createColorInput = (label: string, property: string) => (
    <div className="mb-4">
      <label className="block text-gray-300 text-xs font-semibold mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={rgbToHex(selectedElement.styles[property] || '#000000')}
          onChange={(e) => onPropertyChange(property, e.target.value)}
          className="w-12 h-8 rounded border border-gray-600"
        />
        <input
          type="text"
          value={selectedElement.styles[property] || ''}
          onChange={(e) => onPropertyChange(property, e.target.value)}
          className="flex-1 bg-gray-700 text-gray-100 px-2 py-1 rounded text-xs border border-gray-600"
          placeholder="color"
        />
      </div>
    </div>
  )

  return (
    <div className="h-full bg-gray-800 overflow-auto">
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-white font-semibold">Property Editor</h2>
        <p className="text-gray-400 text-xs mt-1">
          {selectedElement.tagName}
          {selectedElement.classes.length > 0 && `.${selectedElement.classes.join('.')}`}
        </p>
      </div>

      <div className="p-4">
        {/* Spacing Section */}
        <section className="mb-6">
          <h3 className="text-white font-semibold mb-3 pb-2 border-b border-gray-700">Spacing</h3>

          {createSliderInput('Margin Top', 'margin-top', 200)}
          {createSliderInput('Margin Right', 'margin-right', 200)}
          {createSliderInput('Margin Bottom', 'margin-bottom', 200)}
          {createSliderInput('Margin Left', 'margin-left', 200)}

          {createSliderInput('Padding Top', 'padding-top', 200)}
          {createSliderInput('Padding Right', 'padding-right', 200)}
          {createSliderInput('Padding Bottom', 'padding-bottom', 200)}
          {createSliderInput('Padding Left', 'padding-left', 200)}
        </section>

        {/* Colors Section */}
        <section className="mb-6">
          <h3 className="text-white font-semibold mb-3 pb-2 border-b border-gray-700">Colors</h3>

          {createColorInput('Text Color', 'color')}
          {createColorInput('Background', 'background-color')}
          {createColorInput('Border Color', 'border-color')}
        </section>

        {/* Typography Section */}
        <section className="mb-6">
          <h3 className="text-white font-semibold mb-3 pb-2 border-b border-gray-700">Typography</h3>

          {createSliderInput('Font Size', 'font-size', 72)}

          <div className="mb-4">
            <label className="block text-gray-300 text-xs font-semibold mb-2">Font Weight</label>
            <select
              value={selectedElement.styles['font-weight'] || '400'}
              onChange={(e) => onPropertyChange('font-weight', e.target.value)}
              className="w-full bg-gray-700 text-gray-100 px-2 py-1 rounded text-xs border border-gray-600"
            >
              <option value="100">Thin (100)</option>
              <option value="200">Extra Light (200)</option>
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
              <option value="900">Black (900)</option>
            </select>
          </div>

          {createSliderInput('Line Height', 'line-height', 100)}
        </section>

        {/* Layout Section */}
        <section className="mb-6">
          <h3 className="text-white font-semibold mb-3 pb-2 border-b border-gray-700">Layout</h3>

          <div className="mb-4">
            <label className="block text-gray-300 text-xs font-semibold mb-2">Display</label>
            <select
              value={selectedElement.styles['display'] || 'block'}
              onChange={(e) => onPropertyChange('display', e.target.value)}
              className="w-full bg-gray-700 text-gray-100 px-2 py-1 rounded text-xs border border-gray-600"
            >
              <option value="block">Block</option>
              <option value="inline">Inline</option>
              <option value="inline-block">Inline Block</option>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
              <option value="none">None</option>
            </select>
          </div>

          {selectedElement.styles['display'] === 'flex' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-300 text-xs font-semibold mb-2">Flex Direction</label>
                <select
                  value={selectedElement.styles['flex-direction'] || 'row'}
                  onChange={(e) => onPropertyChange('flex-direction', e.target.value)}
                  className="w-full bg-gray-700 text-gray-100 px-2 py-1 rounded text-xs border border-gray-600"
                >
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                  <option value="row-reverse">Row Reverse</option>
                  <option value="column-reverse">Column Reverse</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-xs font-semibold mb-2">Justify Content</label>
                <select
                  value={selectedElement.styles['justify-content'] || 'flex-start'}
                  onChange={(e) => onPropertyChange('justify-content', e.target.value)}
                  className="w-full bg-gray-700 text-gray-100 px-2 py-1 rounded text-xs border border-gray-600"
                >
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="space-between">Space Between</option>
                  <option value="space-around">Space Around</option>
                  <option value="space-evenly">Space Evenly</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-xs font-semibold mb-2">Align Items</label>
                <select
                  value={selectedElement.styles['align-items'] || 'stretch'}
                  onChange={(e) => onPropertyChange('align-items', e.target.value)}
                  className="w-full bg-gray-700 text-gray-100 px-2 py-1 rounded text-xs border border-gray-600"
                >
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="stretch">Stretch</option>
                  <option value="baseline">Baseline</option>
                </select>
              </div>

              {createSliderInput('Gap', 'gap', 100)}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

function rgbToHex(rgb: string): string {
  if (rgb.startsWith('#')) return rgb

  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return '#000000'

  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])

  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}
