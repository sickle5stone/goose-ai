# LLM Text Formatter

A comprehensive React component system for formatting LLM (Large Language Model) responses with support for markdown-like syntax, bullet points, bold text, code snippets, and more.

## Features

- **Bold Text**: `**text**` → Bold styling with customizable colors
- **Questions**: `**question?**` → Special styling for questions
- **Bullet Points**: `* item` → Formatted bullet lists
- **Parenthetical Text**: `(text)` → Italic gray styling
- **Code Snippets**: `` `code` `` → Monospace with background
- **Typewriter Effect**: Progressive text rendering with formatting
- **Customizable Styling**: Full control over colors and appearance

## Quick Start

### Basic Usage

```tsx
import { formatLLMResponse } from './utils/textFormatter';

const MyComponent = () => {
  const llmText = "Here's a **bold statement** with * bullet points and `code`!";
  
  return (
    <div>
      {formatLLMResponse(llmText)}
    </div>
  );
};
```

### With Typewriter Effect

```tsx
import Typewriter from './Typewriter';

const MyComponent = () => {
  const llmText = "This text will appear with a typewriter effect and formatting!";
  
  return (
    <Typewriter 
      text={llmText}
      delay={50}
      onUpdate={() => console.log('Text updated')}
    />
  );
};
```

### Custom Styling

```tsx
import { formatLLMResponse, TextFormatterOptions } from './utils/textFormatter';

const customOptions: TextFormatterOptions = {
  bulletColor: 'text-green-500',
  boldColor: 'text-red-600',
  questionColor: 'text-purple-700',
  parentheticalColor: 'text-gray-500',
  codeBackgroundColor: 'bg-yellow-100'
};

const MyComponent = () => {
  const llmText = "**Custom styled text** with * colored bullets";
  
  return (
    <div>
      {formatLLMResponse(llmText, customOptions)}
    </div>
  );
};
```

## API Reference

### `formatLLMResponse(text, options?)`

Quick utility function for formatting text.

**Parameters:**
- `text` (string): The text to format
- `options` (TextFormatterOptions, optional): Custom styling options

**Returns:** React.ReactElement

### `TextFormatter` Class

Advanced formatter with full customization.

```tsx
import { TextFormatter } from './utils/textFormatter';

const formatter = new TextFormatter({
  bulletColor: 'text-blue-500',
  boldColor: 'text-blue-600'
});

const formattedText = formatter.formatText("Your text here");
```

### `Typewriter` Component

Progressive text rendering with formatting.

**Props:**
- `text` (string): Text to display
- `delay` (number): Base delay between characters
- `onUpdate` (function, optional): Callback on text updates
- `formatterOptions` (TextFormatterOptions, optional): Custom styling

### `TextFormatterOptions`

```tsx
interface TextFormatterOptions {
  bulletColor?: string;        // Default: 'text-blue-500'
  boldColor?: string;          // Default: 'text-blue-600'
  parentheticalColor?: string; // Default: 'text-gray-600'
  questionColor?: string;      // Default: 'text-purple-600'
  emphasisColor?: string;      // Default: 'text-green-600'
  codeBackgroundColor?: string;// Default: 'bg-gray-100'
}
```

## Supported Formatting

### Bold Text
```
**This is bold text**
```
Renders as bold text with customizable color.

### Questions
```
**Is this a question?**
```
Questions (bold text ending with ?) get special styling.

### Bullet Points
```
* First bullet point
* Second bullet point
* Third bullet point
```
Creates formatted bullet lists with custom bullet styling.

### Parenthetical Text
```
This is regular text (this is parenthetical)
```
Text in parentheses gets italic gray styling.

### Code Snippets
```
Use the `formatText` function to format your text.
```
Code in backticks gets monospace font with background.

## Examples

### Complex LLM Response
```tsx
const complexText = `
Okay. Is there anything specific you'd like to know or discuss regarding the number 123? For example:

* **Are you curious about its mathematical properties?** (e.g., is it prime, composite, divisible by certain numbers?)
* **Do you want to know if it has any special significance in a particular context?** (e.g., a code, a year, a street address)
* **Are you just looking for random facts about it?**

You can use the \`formatLLMResponse\` function to handle this formatting automatically.
`;

return <div>{formatLLMResponse(complexText)}</div>;
```

### With Custom Theme
```tsx
const darkTheme: TextFormatterOptions = {
  bulletColor: 'text-cyan-400',
  boldColor: 'text-white',
  questionColor: 'text-yellow-400',
  parentheticalColor: 'text-gray-400',
  codeBackgroundColor: 'bg-gray-800'
};

return (
  <div className="bg-gray-900 p-4">
    {formatLLMResponse(llmText, darkTheme)}
  </div>
);
```

## Integration with Existing Components

The formatter is designed to work seamlessly with existing React components and styling systems. It uses Tailwind CSS classes by default but can be customized to work with any CSS framework.

## Performance Considerations

- The parser processes text character by character for accurate formatting
- Segments are memoized with unique keys for efficient React rendering
- The typewriter effect includes performance optimizations for smooth animation

## Contributing

To extend the formatter with new formatting types:

1. Add the new type to the `FormattedSegment` interface
2. Implement parsing logic in `parseTextToSegments`
3. Add rendering logic in `renderSegment`
4. Update the options interface if needed

## License

This component is part of the AI Aggregator project. 