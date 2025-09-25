# Krishi Sakhi Backend

Backend API for the Krishi Sakhi farming assistant application.

## Features

- RESTful API for farm management
- Real-time chat with AI assistant
- Weather-based alerts and notifications
- Activity logging and tracking
- Offline-first architecture with sync capabilities
- MongoDB integration with Mongoose ODM
- Input validation and error handling
- Rate limiting and security middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Morgan

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB service

4. Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Farm Management
- `GET /api/farm/profile` - Get farm profile
- `POST /api/farm/profile` - Create/update farm profile
- `GET /api/farm/activities` - Get activities
- `POST /api/farm/activities` - Add activity
- `DELETE /api/farm/activities/:id` - Delete activity

### Chat System
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/message` - Send message
- `DELETE /api/chat/history` - Clear chat history

### Alerts & Notifications
- `GET /api/alerts` - Get alerts
- `PATCH /api/alerts/:id/read` - Mark alert as read
- `PATCH /api/alerts/read-all` - Mark all alerts as read
- `POST /api/alerts/generate` - Generate new alerts
- `DELETE /api/alerts/:id` - Delete alert

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── server.js       # Main server file
├── package.json
└── README.md
```

## Environment Variables

See `.env.example` for all available configuration options.

## Development

```bash
# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up proper logging
4. Use process manager like PM2
5. Set up reverse proxy (nginx)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request