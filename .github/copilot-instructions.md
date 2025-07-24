<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Budget App Development Guidelines

This is a Next.js 14 budgeting application with TypeScript, App Router, and modern React patterns.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Testing**: Vitest with Testing Library
- **Storage**: localStorage with adapter pattern

## Architecture Patterns
- **Storage Adapter Pattern**: All data persistence goes through a storage adapter interface for easy backend integration
- **Zustand Store**: Centralized state management with actions and computed values
- **Component Composition**: Reusable UI components with clear prop interfaces
- **Responsive Design**: Mobile-first approach with breakpoints

## Code Style Guidelines
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components focused and single-purpose
- Use TypeScript interfaces for all data structures
- Implement proper error handling and loading states
- Follow accessibility best practices (ARIA labels, keyboard navigation)

## Key Features
- **Budget Templates**: Reusable budget structures
- **Budget Periods**: Time-based budget instances
- **Real-time Calculations**: Live updates of totals and net balance
- **Data Management**: Export/import functionality
- **Responsive UI**: Mobile and desktop optimized
- **Accessibility**: Keyboard navigation and screen reader support

## File Organization
- `/src/types/` - TypeScript interfaces and types
- `/src/lib/` - Utility functions and adapters
- `/src/store/` - Zustand state management
- `/src/components/ui/` - Reusable UI components
- `/src/components/budget/` - Budget-specific components
- `/src/app/` - Next.js App Router pages and layouts

## Testing Strategy
- Unit tests for utilities and adapters
- Component tests for UI interactions
- Integration tests for state management
- Use Vitest with jsdom environment

When working on this project, prioritize type safety, accessibility, and maintainable code structure.
