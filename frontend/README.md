# AutoDeploy.AI Frontend

Modern React + TypeScript frontend for AutoDeploy.AI system.

## Features

- Beautiful dark theme UI
- Real-time deployment monitoring
- AI-generated Dockerfile viewer
- Interactive analytics dashboard
- Responsive mobile-first design

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- Lucide Icons
- Vite

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Update VITE_API_URL if needed
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── MetricCard.tsx
│   │   └── LogViewer.tsx
│   ├── pages/           # Page components
│   │   ├── Landing.tsx
│   │   ├── Analysis.tsx
│   │   ├── Deploy.tsx
│   │   └── Dashboard.tsx
│   ├── hooks/           # Custom hooks
│   │   └── usePolling.tsx
│   ├── utils/           # Utility functions
│   │   └── validation.ts
│   ├── api/             # API client
│   │   └── client.ts
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── tailwind.config.js   # Tailwind configuration
└── vite.config.ts       # Vite configuration
```

## Pages

### Landing
- GitHub URL input
- Repository analysis trigger
- Feature showcase

### Analysis
- Tech stack detection results
- Dependencies display
- Generated Dockerfile preview
- Deploy button

### Deploy
- Animated deployment progress
- Stage-by-stage updates
- Success/error handling

### Dashboard
- Live container logs
- Real-time metrics (CPU, Memory, Uptime)
- Deployment URL
- Actions (Redeploy, View Dockerfile)

## Styling

- **Theme**: Dark mode with gradient accents
- **Colors**: 
  - Primary: #00E0FF (Cyan)
  - Secondary: #9D00FF (Purple)
- **Animations**: Smooth transitions with Framer Motion
- **Typography**: Inter + JetBrains Mono

## Environment Variables

```env
VITE_API_URL=http://localhost:5000
```

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```





