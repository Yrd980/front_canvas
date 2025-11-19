import { useState } from 'react'

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-white font-semibold">Code Input</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isEditing ? (
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-3 rounded border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
            spellCheck={false}
          />
        ) : (
          <pre className="text-gray-300 font-mono text-xs whitespace-pre-wrap break-words">
            {code}
          </pre>
        )}
      </div>

      <div className="p-3 border-t border-gray-700 text-gray-400 text-xs">
        Paste your HTML/Tailwind code here
      </div>
    </div>
  )
}
