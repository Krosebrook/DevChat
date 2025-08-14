# Figma Integration Guide - Independent Development

## Quick File Locations
```
client/src/components/figma-components/figma-enhanced-section.tsx  ← Main component file
client/src/pages/dashboard.tsx                                    ← Already connected
client/src/index.css                                             ← Add new styles here
```

## Development Commands
```bash
# Open VS Code editor
code .

# View your app (already running)
# Visit the URL shown in your browser

# Check logs
npm run dev

# View file structure
ls -la client/src/components/
```

## Integration Steps
1. Copy Figma code (HTML/CSS/React)
2. Open: `client/src/components/figma-components/figma-enhanced-section.tsx`
3. Replace the placeholder content with your Figma code
4. Convert inline styles to Tailwind classes
5. Use existing components from `@/components/ui/`
6. Save and check browser (auto-reloads)

## Component Pattern
```jsx
// Use existing shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Convert Figma styles to Tailwind
// Instead of: style={{backgroundColor: '#3B82F6'}}
// Use: className="bg-blue-500"
```

## Need Help?
- Only ask Claude for specific conversion help
- Paste problematic code sections
- Ask for specific component recommendations