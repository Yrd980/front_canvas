# Frontend Prompt Assistant

A visual editor that helps backend developers generate AI prompts for frontend code adjustments. Instead of struggling to describe spacing and styling changes in words, just tweak the elements visually and get a copy-paste ready prompt!

## Features

### 1. Code Input (Left Panel)
- Paste your HTML/Tailwind code
- Toggle between view and edit mode
- Supports HTML, React JSX, Vue templates

### 2. Live Preview (Center Panel)
- Real-time rendering with Tailwind CSS
- **Hover** over elements to inspect (blue dashed outline)
- **Click** to select elements (green solid outline)
- Shows element path in the header

### 3. Property Editor (Right Panel)
Edit selected elements visually:
- **Spacing**: Adjust margins and padding with sliders (0-200px)
- **Colors**: Pick text color, background, and border colors
- **Typography**: Font size, weight, and line height
- **Layout**: Display type, flex properties, gap, alignment

### 4. Generated Prompt (Bottom Panel)
- Tracks all changes you make
- Generates natural language prompts with full context
- Copy-paste ready for Claude, ChatGPT, or other AI assistants
- Includes element paths and class names for precision

## How to Use

1. **Start the dev server** (already running at http://localhost:5173/)
2. **Paste your code** in the left panel (or modify the example)
3. **Click on elements** in the preview to select them
4. **Adjust properties** using the sliders and color pickers on the right
5. **Copy the generated prompt** from the bottom panel
6. **Paste into your AI assistant** to get the updated code

## Example Workflow

1. You have HTML/Tailwind code from AI but the spacing is off
2. Paste it into the app
3. Click the element that needs adjustment
4. Slide the "Margin Bottom" slider to add more space
5. Click "Copy Prompt"
6. Paste into Claude: "I need you to adjust the following HTML/Tailwind code... Change margin-bottom from '16px' to '32px'"
7. Get perfectly adjusted code back!

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast dev experience
- **Tailwind CSS** for styling
- **Tailwind CDN** for preview rendering

## Future Enhancements

- [ ] Drag-to-select multiple elements
- [ ] Undo/redo functionality
- [ ] Save/load sessions
- [ ] Export modified code directly
- [ ] Support for CSS modules and styled-components
- [ ] Real-time collaboration
- [ ] Visual diff view (before/after)

## License

MIT
