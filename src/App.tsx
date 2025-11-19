import { useState } from 'react'
import CodeEditor from './components/CodeEditor'
import LivePreview from './components/LivePreview'
import PropertyEditor from './components/PropertyEditor'
import PromptOutput from './components/PromptOutput'
import { Change, SelectedElement } from './types'

function App() {
  const [code, setCode] = useState(`<div class="min-h-screen bg-gray-100 p-8">
  <header class="bg-white shadow-md rounded-lg p-6 mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Welcome to My App</h1>
    <p class="text-gray-600 mt-2">This is a sample page for editing</p>
  </header>

  <main class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Main Content</h2>
    <p class="text-gray-600 mb-4">Click on any element to edit its properties.</p>

    <div class="flex gap-4">
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Primary Button
      </button>
      <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
        Secondary Button
      </button>
    </div>
  </main>
</div>`)

  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [changes, setChanges] = useState<Change[]>([])

  const handleElementSelect = (element: SelectedElement) => {
    setSelectedElement(element)
  }

  const handlePropertyChange = (property: string, value: string) => {
    if (!selectedElement) return

    const change: Change = {
      elementPath: selectedElement.path,
      elementTag: selectedElement.tagName,
      elementClasses: selectedElement.classes,
      property,
      oldValue: selectedElement.styles[property] || 'initial',
      newValue: value,
      timestamp: Date.now()
    }

    setChanges(prev => [...prev, change])

    // Update selected element styles
    setSelectedElement(prev => prev ? {
      ...prev,
      styles: { ...prev.styles, [property]: value }
    } : null)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Frontend Prompt Assistant</h1>
        <p className="text-gray-400 text-sm">Visual editor that generates AI prompts for your frontend changes</p>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="w-1/3 border-r border-gray-700">
          <CodeEditor code={code} onChange={setCode} />
        </div>

        {/* Center Panel - Live Preview */}
        <div className="flex-1">
          <LivePreview
            code={code}
            selectedElement={selectedElement}
            onElementSelect={handleElementSelect}
            changes={changes}
          />
        </div>

        {/* Right Panel - Property Editor */}
        <div className="w-80 border-l border-gray-700">
          <PropertyEditor
            selectedElement={selectedElement}
            onPropertyChange={handlePropertyChange}
          />
        </div>
      </div>

      {/* Bottom Panel - Prompt Output */}
      <div className="h-48 border-t border-gray-700">
        <PromptOutput changes={changes} originalCode={code} />
      </div>
    </div>
  )
}

export default App
