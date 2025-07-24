
'use client';

import React, { useState } from 'react';

const TABS = [
  { id: 'overview', label: '📋 Overview' },
  { id: 'structure', label: '📁 Structure' },
  { id: 'features', label: '⚡ Features' },
  { id: 'setup', label: '🛠️ Setup Guide' },
  { id: 'components', label: '🧩 Components' },
  { id: 'state', label: '🔄 State Management' },
  { id: 'exports', label: '📤 Export System' },
  { id: 'recreation', label: '🔄 Recreation Steps' },
];

// All tab content is now rendered directly below, using Tailwind and app card/container styles
const tabContent: Record<string, React.ReactNode> = {
  overview: (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-4">📊 Project Overview</h2>
      <div className="bg-blue-100 border border-blue-200 text-blue-900 rounded-lg p-4 mb-6">
        <strong>Budget App</strong> - A comprehensive Next.js 14 budgeting application built with modern React patterns, TypeScript, and a focus on user experience and maintainability.
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-2">🎯 Core Purpose</h3>
      <ul className="list-disc list-inside mb-6">
        <li><strong>Template System:</strong> Create reusable budget structures</li>
        <li><strong>Period Management:</strong> Organize budgets by time periods</li>
        <li><strong>Category Organization:</strong> Income, Bills, Expenses, Savings, Debt</li>
        <li><strong>Data Export:</strong> Multiple export formats (Markdown, CSV, JSON)</li>
        <li><strong>Real-time Analytics:</strong> Live budget calculations and insights</li>
      </ul>
      <h3 className="text-xl font-semibold mt-8 mb-2">🚀 Tech Stack</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Next.js 14</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">TypeScript</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">React 18</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Zustand</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Tailwind CSS</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">shadcn/ui</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Framer Motion</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Radix UI</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Vitest</span>
        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Lucide Icons</span>
      </div>
      {/* ...continue converting all HTML for this tab, using Tailwind and app card styles... */}
    </section>
  ),
  structure: (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-4">📁 Complete Project Structure Analysis</h2>
      <div className="bg-blue-50 border border-blue-100 text-blue-900 rounded-lg p-4 mb-6">
        <strong>🎯 Structure Philosophy:</strong> This Next.js 14 app follows modern React patterns with clear separation of concerns, feature-based organization, and scalable architecture principles.
      </div>
      <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto mb-6"><code>{`
BudgetApp/
├── .git/                      # Git version control
├── .next/                     # Next.js build output (auto-generated)
├── .vscode/                   # VS Code workspace settings
│   └── tasks.json             # Build/dev tasks configuration
├── node_modules/              # Dependencies (auto-generated)
│
├── public/                    # Static assets served at root
│   ├── favicon.ico            # Browser tab icon
│   └── images/                # App images and icons
│
├── src/                       # Source code (everything we build)
│   │
│   ├── app/                   # 🚀 Next.js 14 App Router
│   │   ├── layout.tsx         # Root layout with providers & metadata
│   │   ├── page.tsx           # Main homepage (our SPA entry point)
│   │   ├── globals.css        # Global styles + Tailwind imports
│   │   ├── loading.tsx        # Loading UI for page transitions
│   │   └── not-found.tsx      # 404 error page
│   │
│   ├── components/            # 🧩 React Components Library
│   │   │
│   │   ├── ui/                # 🎨 Base UI Components (Design System)
│   │   │   ├── button.tsx     # Reusable button with variants
│   │   │   ├── card.tsx       # Container with header/content/footer
│   │   │   ├── input.tsx      # Form input with validation styling
│   │   │   ├── select.tsx     # Dropdown with search & multi-select
│   │   │   ├── label.tsx      # Accessible form labels
│   │   │   ├── checkbox.tsx   # Checkbox with indeterminate state
│   │   │   └── dropdown-menu.tsx # Context menu component
│   │   │
│   │   ├── budget/            # 💰 Budget-Specific Business Components
│   │   │   │
│   │   │   ├── dashboard.tsx              # 📊 Analytics & overview with charts
│   │   │   ├── budget-summary.tsx         # 📈 Real-time calculations & totals
│   │   │   ├── budget-category-section.tsx # 📋 Category container with CRUD
│   │   │   ├── budget-item-row.tsx        # 💳 Individual item display & actions
│   │   │   ├── template-item-picker.tsx   # 🎯 Template selection interface
│   │   │   ├── period-manager.tsx         # 📅 Period CRUD operations
│   │   │   ├── template-manager.tsx       # 📝 Template CRUD operations
│   │   │   ├── data-management.tsx        # 📤 Export/Import functionality
│   │   │   ├── template-upload.tsx        # 📁 Template file upload UI
│   │   │   │
│   │   │   └── forms/         # 📝 Category-Specific Input Forms
│   │   │       ├── index.ts               # Form exports & types
│   │   │       ├── income-form.tsx        # 💰 Income entry (no paid status)
│   │   │       ├── bill-form.tsx          # 📄 Bills with due dates & frequency
│   │   │       ├── expense-form.tsx       # 🛒 Expenses with frequency tracking
│   │   │       ├── savings-form.tsx       # 🏦 Savings goals & amounts
│   │   │       └── debt-form.tsx          # 💳 Debt payments & tracking
│   │   │
│   │   ├── theme-provider.tsx  # 🌙 Dark/light theme context provider
│   │   └── theme-toggle.tsx    # 🔄 Theme switcher UI component
│   │
│   ├── lib/                   # 🛠️ Utility Functions & Business Logic
│   │   ├── utils.ts           # 🔧 General utility functions & helpers
│   │   ├── storage.ts         # 💾 Storage adapter pattern for data persistence
│   │   ├── export-utils.ts    # 📤 Advanced export functionality (MD/CSV/JSON)
│   │   ├── template-data.ts   # 📋 Template data models & example data
│   │   └── template-upload.ts # 📁 Template upload/validation logic
│   │
│   ├── store/                 # 🏪 Global State Management
│   │   └── budget.ts          # 🧠 Zustand store with actions & computed values
│   │
│   ├── types/                 # 📝 TypeScript Type Definitions
│   │   └── budget.ts          # 🎯 All interfaces, types & enums
│   │
│   └── test/                  # 🧪 Testing Infrastructure
│       ├── setup.ts           # ⚙️ Test environment configuration
│       └── storage.test.ts    # 🔬 Storage adapter unit tests
│
├── package.json               # 📦 Dependencies, scripts & project metadata
├── package-lock.json          # 🔒 Exact dependency versions (auto-generated)
├── tsconfig.json              # ⚙️ TypeScript compiler configuration
├── tailwind.config.js         # 🎨 Tailwind CSS customization & theme
├── postcss.config.js          # 🔧 CSS processing configuration
├── next.config.js             # ⚙️ Next.js build & runtime configuration
├── next-env.d.ts              # 📝 Next.js TypeScript definitions
├── vitest.config.ts           # 🧪 Testing framework configuration
├── .eslintrc.json             # 📏 Code linting rules & standards
├── .prettierrc                # 💄 Code formatting rules
├── .gitignore                 # 🚫 Files to ignore in version control
├── README.md                  # 📖 Project documentation
└── investigate.html           # 🔍 This analysis file!
`}</code></pre>
      {/* ...continue for all other tabs, converting each section from investigate.html to JSX with Tailwind/app styles... */}
    </section>
  ),
  features: (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-4">⚡ Features</h2>
      <div className="bg-blue-100 border border-blue-200 text-blue-900 rounded-lg p-4 mb-6">
        <strong>�� Feature Philosophy:</strong> The Budget App prioritizes simplicity, usability, and maintainability. Each feature is designed to be intuitive and easy to use, while also being robust and reliable.
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-2">🚀 Core Features</h3>
      <ul className="list-disc list-inside mb-6">
        <li><strong>Budget Creation:</strong> Easily create new budgets with customizable categories and time periods.</li>
        <li><strong>Real-time Calculations:</strong> All budget calculations are performed instantly, ensuring accurate and up-to-date financial data.</li>
        <li><strong>Data Persistence:</strong> Budget data is automatically saved and loaded, so you can continue working on your budgets even if you close the app.</li>
        <li><strong>Multiple Export Options:</strong> Export your budgets in Markdown, CSV, or JSON formats for easy sharing and backup.</li>
        <li><strong>Responsive Design:</strong> The app is fully responsive and works on any device, from desktop to mobile.</li>
      </ul>
      <h3 className="text-xl font-semibold mt-8 mb-2">🧠 State Management</h3>
      <div className="bg-blue-50 border border-blue-100 text-blue-900 rounded-lg p-4 mb-6">
        <strong>🎯 State Management Philosophy:</strong> The Budget App uses Zustand for global state management, ensuring that all components have access to the latest data and can react to changes efficiently.
      </div>
    </section>
  ),
  setup: (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-4">🛠️ Setup Guide</h2>
      <div className="bg-blue-100 border border-blue-200 text-blue-900 rounded-lg p-4 mb-6">
        <strong>🎯 Setup Philosophy:</strong> The Budget App is designed to be easy to set up and run. You&apos;ll need a few basic tools and a few minutes to get started.
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-2">🚀 Prerequisites</h3>
      <ul className="list-disc list-inside mb-6">
        <li><strong>Node.js:</strong> Ensure Node.js is installed on your machine. You can download it from <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="underline">nodejs.org</a>.</li>
        <li><strong>Git:</strong> If you plan to use version control, Git is required. You can download it from <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer" className="underline">git-scm.com</a>.</li>
        <li><strong>VS Code:</strong> A modern code editor like VS Code is recommended for development. You can download it from <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="underline">code.visualstudio.com</a>.</li>
      </ul>
      <h3 className="text-xl font-semibold mt-8 mb-2">🔧 Installation Steps</h3>
      <ol className="list-decimal list-inside mb-6">
        <li>Clone the repository to your local machine:</li>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto mb-6"><code>{`
git clone https://github.com/your-username/budget-app.git
`}</code></pre>
        <li>Navigate to the project directory:</li>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto mb-6"><code>{`
cd budget-app
`}</code></pre>
        <li>Install dependencies:</li>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto mb-6"><code>{`
npm install
`}</code></pre>
        <li>Start the development server:</li>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto mb-6"><code>{`
npm run dev
`}</code></pre>
        <li>Open your browser and navigate to <code>http://localhost:3000</code> to see the app in action.</li>
      </ol>
      <h3 className="text-xl font-semibold mt-8 mb-2">🔄 Development Workflow</h3>
      <ul className="list-disc list-inside mb-6">
        <li>The app uses Next.js 14 with App Router, TypeScript, and Tailwind CSS for styling.</li>
        <li>Components are organized in the <code>src/components</code> directory, with a clear separation of concerns.</li>
        <li>State management is handled by Zustand, ensuring efficient data access and updates.</li>
        <li>The app includes a robust testing infrastructure (Vitest) and linting (ESLint, Prettier).</li>
        <li>You can run tests with <code>npm run test</code> and format code with <code>npm run format</code>.</li>
      </ul>
    </section>
  ),
  components: (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-4">🧩 Components</h2>
      <div className="bg-blue-100 border border-blue-200 text-blue-900 rounded-lg p-4 mb-6">
        <strong>🎯 Component Philosophy:</strong> The Budget App uses a modular component architecture, leveraging shadcn/ui for base UI elements and building custom components for specific functionality.
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-2">🚀 Base Components</h3>
      <ul className="list-disc list-inside mb-6">
        <li><strong>Button:</strong> Reusable button components with variants (primary, secondary, outline, etc.).</li>
        <li><strong>Card:</strong> Flexible container for content with header, footer, and optional full-width content.</li>
        <li><strong>Input:</strong> Form inputs with validation styling and placeholder text.</li>
        <li><strong>Select:</strong> Dropdown select with search and multi-select options.</li>
        <li><strong>Label:</strong> Accessible form labels for input fields.</li>
        <li><strong>Checkbox:</strong> Checkbox with indeterminate state for list items.</li>
        <li><strong>Dropdown Menu:</strong> Context menu component for actions.</li>
      </ul>
      <h3 className="text-xl font-semibold mt-8 mb-2">🧠 Custom Components</h3>
      <ul className="list-disc list-inside mb-6">
        <li><strong>Budget Summary:</strong> Displays total income, expenses, savings, and debt with charts.</li>
        <li><strong>Category Section:</strong> Container for budget items grouped by category.</li>
        <li><strong>Budget Item Row:</strong> Individual item display with actions (edit, delete, add sub-item).</li>
        <li><strong>Template Item Picker:</strong> Interface for selecting and applying budget templates.</li>
        <li><strong>Period Manager:</strong> CRUD operations for managing time periods (months, quarters, years).</li>
        <li><strong>Template Manager:</strong> CRUD operations for managing budget templates.</li>
        <li><strong>Data Management:</strong> Export/Import functionality for budget data.</li>
        <li><strong>Template Upload:</strong> UI for uploading budget template files.</li>
      </ul>
      <h3 className="text-xl font-semibold mt-8 mb-2">🔄 State Management</h3>
      <div className="bg-blue-50 border border-blue-100 text-blue-900 rounded-lg p-4 mb-6">
        <strong>🎯 State Management Philosophy:</strong> The Budget App uses Zustand for global state management, ensuring that all components have access to the latest data and can react to changes efficiently.
      </div>
    </section>
  ),
  state: (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-4">🔄 State Management</h2>
      <div className="bg-blue-100 border border-blue-200 text-blue-900 rounded-lg p-4 mb-6">
        <strong>🎯 State Management Philosophy:</strong> The Budget App uses Zustand for global state management, ensuring that all components have access to the latest data and can react to changes efficiently.
      </div>
    </section>
  ),
  exports: (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-4">📤 Export System</h2>
      <div className="bg-blue-100 border border-blue-200 text-blue-900 rounded-lg p-4 mb-6">
        <strong>🎯 Export System Philosophy:</strong> The Budget App provides robust export functionality to allow users to save and share their budgets in various formats.
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-2">🚀 Export Features</h3>
      <ul className="list-disc list-inside mb-6">
        <li><strong>Multiple Formats:</strong> Export budgets in Markdown, CSV, or JSON formats.</li>
        <li><strong>Data Integrity:</strong> All exported data is fully functional and can be imported back into the app.</li>
        <li><strong>Real-time Data:</strong> Exported data reflects the current state of the budget, including all calculations and items.</li>
      </ul>
      <h3 className="text-xl font-semibold mt-8 mb-2">🧠 Data Export Process</h3>
      <div className="bg-blue-50 border border-blue-100 text-blue-900 rounded-lg p-4 mb-6">
        <strong>🎯 Data Export Process Philosophy:</strong> The Budget App uses a modular and extensible export system that can easily integrate with new formats or modify existing ones.
      </div>
    </section>
  ),
  recreation: (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-4">🔄 Recreation Steps</h2>
      <div className="bg-blue-100 border border-blue-200 text-blue-900 rounded-lg p-4 mb-6">
        <strong>🎯 Recreation Philosophy:</strong> The Budget App is designed to be easy to set up and run. You&apos;ll need a few basic tools and a few minutes to get started.
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-2">🚀 Prerequisites</h3>
      <ul className="list-disc list-inside mb-6">
        <li><strong>Node.js:</strong> Ensure Node.js is installed on your machine. You can download it from <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="underline">nodejs.org</a>.</li>
        <li><strong>Git:</strong> If you plan to use version control, Git is required. You can download it from <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer" className="underline">git-scm.com</a>.</li>
        <li><strong>VS Code:</strong> A modern code editor like VS Code is recommended for development. You can download it from <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="underline">code.visualstudio.com</a>.</li>
      </ul>
      <h3 className="text-xl font-semibold mt-8 mb-2">🔧 Installation Steps</h3>
      <ol className="list-decimal list-inside mb-6">
        <li>Clone the repository to your local machine:</li>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto mb-6"><code>{`
git clone https://github.com/your-username/budget-app.git
`}</code></pre>
        <li>Navigate to the project directory:</li>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto mb-6"><code>{`
cd budget-app
`}</code></pre>
        <li>Install dependencies:</li>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto mb-6"><code>{`
npm install
`}</code></pre>
        <li>Start the development server:</li>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto mb-6"><code>{`
npm run dev
`}</code></pre>
        <li>Open your browser and navigate to <code>http://localhost:3000</code> to see the app in action.</li>
      </ol>
      <h3 className="text-xl font-semibold mt-8 mb-2">🔄 Development Workflow</h3>
      <ul className="list-disc list-inside mb-6">
        <li>The app uses Next.js 14 with App Router, TypeScript, and Tailwind CSS for styling.</li>
        <li>Components are organized in the <code>src/components</code> directory, with a clear separation of concerns.</li>
        <li>State management is handled by Zustand, ensuring efficient data access and updates.</li>
        <li>The app includes a robust testing infrastructure (Vitest) and linting (ESLint, Prettier).</li>
        <li>You can run tests with <code>npm run test</code> and format code with <code>npm run format</code>.</li>
      </ul>
    </section>
  ),
};

export default function LeanritPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const currentDate = new Date().toLocaleDateString();
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🚀 Budget App Investigation</h1>
          <p className="text-lg text-muted-foreground">Complete Next.js 14 Application Analysis & Recreation Guide</p>
        </div>
        <div className="bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-wrap border-b border-border bg-muted">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-primary border-b-2 border-primary bg-background' : 'text-muted-foreground hover:text-primary'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-6 min-h-[400px]">
            {tabContent[activeTab]}
          </div>
        </div>
        <div className="text-center text-muted-foreground mt-8">
          <p>🔥 Created with ❤️ for learning Next.js and modern React development</p>
          <p>📅 Generated: <span>{currentDate}</span></p>
        </div>
      </div>
    </main>
  );
}
