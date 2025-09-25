# Krishi Sakhi Frontend

React-based frontend for the Krishi Sakhi farming assistant application.

## Features

- **Responsive Design**: Mobile-first approach optimized for farmers
- **Multilingual Support**: Malayalam and English language support
- **Voice Input**: Speech recognition for easy interaction
- **Offline Support**: Works offline with local storage fallback
- **Progressive Web App**: Can be installed on mobile devices
- **Real-time Chat**: AI-powered farming assistant
- **Activity Logging**: Track daily farming activities
- **Weather Alerts**: Location-based weather notifications

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   ├── styles/         # CSS files
│   ├── utils/          # Utility functions
│   ├── assets/         # Static assets
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/             # Public assets
├── index.html          # HTML template
├── package.json
└── README.md
```

## Key Features

### Multilingual Support
The app supports both Malayalam and English with a context-based translation system.

### Offline Functionality
- Local storage for farm data
- Offline activity logging
- Sync when connection is restored

### Voice Input
- Speech recognition for text input
- Supports both Malayalam and English
- Voice commands for common actions

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Optimized for various screen sizes

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

### Build for Production
```bash
npm run build
```

The build files will be in the `dist` directory.

### Environment Variables
- `VITE_API_URL`: Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Test your changes
5. Submit a pull request

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

Note: Voice recognition requires HTTPS in production.