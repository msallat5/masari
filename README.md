# Masari (مساري) - Job Application Tracker

Masari is a fully responsive, RTL-first job application tracker built with React and Ant Design UI, featuring light/dark themes, language toggle (Arabic/English), rich workflows, and analytics.

## Features

- **RTL-First Design**: Built with Arabic as the default language and Right-to-Left layout.
- **Responsive**: Adapts to mobile, tablet, and desktop displays with different navigation patterns.
- **Localization**: Seamlessly switch between Arabic and English.
- **Theming**: Toggle between dark and light modes with preferences saved to localStorage.
- **Modern UI**: Clean, minimalist design with Ant Design components.
- **Job Tracking**: Create, read, update, and delete job applications with custom statuses.
- **Dashboard**: View analytics on your job search with KPI cards and charts.

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Library**: Ant Design
- **State Management**: Redux Toolkit (or Context API + Hooks)
- **Routing**: React Router v6
- **Styling**: Styled Components + Ant Design's theming
- **Localization**: i18next

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/masari.git
cd masari
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Shared UI components
├── features/           # Redux slices & domain modules
├── hooks/              # Custom React hooks
├── locales/            # Localization files
├── pages/              # Route-based components
├── services/           # API/service layer
├── themes/             # Theme configuration
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and constants
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [React Router](https://reactrouter.com/)
- [i18next](https://www.i18next.com/)
