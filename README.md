# Budget App

A comprehensive Next.js 14 budgeting application designed to replace traditional spreadsheet-based budgeting with a modern, responsive web interface.

## Features

### 🎯 Core Functionality
- **Budget Templates**: Create reusable budget templates for recurring income and expenses
- **Budget Periods**: Generate time-based budget instances from templates
- **Real-time Calculations**: Live updates of category totals and net balance
- **Negative Balance Warning**: Visual alerts when expenses exceed income
- **Paid/Unpaid Tracking**: Mark budget items as paid or unpaid

### 💾 Data Management
- **localStorage Persistence**: All data stored locally with adapter pattern for future backend integration
- **Export/Import**: Export data as JSON or CSV, import from JSON backups
- **Clear All**: Complete data reset functionality

### 📱 User Experience
- **Responsive Design**: Optimized for mobile (< 640px) and desktop (≥ 1024px)
- **Accessible**: Full keyboard navigation, ARIA labels, focus management
- **Smooth Animations**: Framer Motion for delightful interactions
- **Clean UI**: shadcn/ui components with a professional appearance

### 🏗️ Technical Excellence
- **Type Safety**: Full TypeScript implementation
- **Modern React**: Hooks, functional components, and best practices
- **State Management**: Zustand for predictable state updates
- **Testing**: Vitest with Testing Library for reliability
- **Code Quality**: ESLint + Prettier for consistent formatting

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **State**: Zustand
- **Testing**: Vitest + Testing Library
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### 1. Set Up Your Template
- Open the app and expand the **Budget Template** section in the Dashboard view.
- Add your recurring income sources (salary, freelance, etc.)
- Add recurring bills (rent, utilities, subscriptions)
- Add typical expenses (groceries, entertainment)
- Set up savings goals and debt payments

### 2. Create and Manage Budget Periods
- Go to the **Budget** view (now the first menu item)
- Use the inline Period Manager to create, edit, or delete budget periods
- Choose date range (typically aligned with pay periods)
- The system will clone your template items for each new period

### 3. Track Your Budget
- Use the **Budget** view to manage your active period
- Mark items as paid/unpaid as you complete transactions
- Monitor your net balance in real-time
- Get warnings if expenses exceed income

### 4. Dashboard & Data Management
- Expand the **Dashboard** section to view analytics and summaries
- Expand the **Data Management** section to export/import/clear your data

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page (all main views and sections)
├── components/
│   ├── ui/                # Reusable UI components
│   └── budget/            # Budget-specific components
├── lib/
│   ├── storage.ts         # localStorage adapter
│   └── utils.ts           # Utility functions
├── store/
│   └── budget.ts          # Zustand state management
├── types/
│   └── budget.ts          # TypeScript interfaces
└── test/                  # Test files
```

## Architecture Decisions

### Storage Adapter Pattern
The app uses an adapter pattern for data persistence, making it easy to swap localStorage for a backend API without changing application logic.

### State Management
Zustand provides a lightweight, TypeScript-friendly state management solution with clear action definitions and computed values.

### Component Design
Components follow the single responsibility principle with clear prop interfaces and proper TypeScript typing.

### Responsive Strategy
Mobile-first design with CSS Grid and Flexbox for layout, ensuring optimal experience across devices.

### Unified Views
- **Budget**: Manage periods and items in one place, with period creation/editing inline.
- **Dashboard**: Analytics, template management, and data management are all accessible as collapsible sections.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest

## Testing

Run the test suite:
```bash
npm run test
```

Tests cover:
- Storage adapter functionality
- Utility functions
- Component behavior
- State management logic

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Ensure TypeScript types are properly defined
4. Test responsive design on multiple screen sizes
5. Verify accessibility with keyboard navigation

## License

This project is open source and available under the [MIT License](LICENSE).
