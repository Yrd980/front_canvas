import { useState } from 'react'
import { Change } from '../types'

interface PromptOutputProps {
  changes: Change[]
  originalCode: string
}

export default function PromptOutput({ changes, originalCode }: PromptOutputProps) {
  const [copied, setCopied] = useState(false)

  const generatePrompt = () => {
    if (changes.length === 0) {
      return 'No changes made yet. Start editing elements in the preview!'
    }

    let prompt = "I need you to adjust the following HTML/Tailwind code:\n\n"
    prompt += "```html\n" + originalCode + "\n```\n\n"
    prompt += "Please make these changes:\n\n"

    changes.forEach((change, index) => {
      const elementDesc = `the ${change.elementTag} element${
        change.elementClasses.length > 0
          ? ` with classes "${change.elementClasses.join(' ')}"`
          : ''
      }`

      const propertyName = change.property.replace(/-/g, ' ')

      prompt += `${index + 1}. For ${elementDesc} (${change.elementPath}):\n`
      prompt += `   - Change ${propertyName} from "${change.oldValue}" to "${change.newValue}"\n\n`
    })

    prompt += "Please provide the updated code with these style changes applied."

    return prompt
  }

  const handleCopy = async () => {
    const prompt = generatePrompt()
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    if (confirm('Clear all changes?')) {
      window.location.reload()
    }
  }

  return (
    <div className="h-full bg-gray-800 flex flex-col">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-white font-semibold">Generated Prompt</h2>
          <p className="text-gray-400 text-xs mt-1">
            {changes.length} change{changes.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Clear
          </button>
          <button
            onClick={handleCopy}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Prompt
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <pre className="text-gray-300 font-mono text-xs whitespace-pre-wrap break-words">
          {generatePrompt()}
        </pre>
      </div>
    </div>
  )
}
