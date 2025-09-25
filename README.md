# Krishi Sakhi - Digital Farming Assistant

A comprehensive digital farming assistant designed specifically for Kerala farmers, supporting both Malayalam and English languages.

## 🌾 Overview

Krishi Sakhi is a mobile-first web application that helps farmers with:
- **Farm Management**: Track crops, activities, and farm data
- **AI Chat Assistant**: Get farming advice through voice or text
- **Weather Alerts**: Location-based weather notifications
- **Activity Logging**: Record daily farming activities
- **Offline Support**: Works without internet connection
- **Multilingual**: Full support for Malayalam and English

## 🏗️ Architecture

The application follows a modern full-stack architecture:

```
┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │
│   (React SPA)   │◄──►│  (Node.js API)  │
│                 │    │                 │
│ • React 18      │    │ • Express.js    │
│ • Vite          │    │ • MongoDB       │
│ • Context API   │    │ • Mongoose      │
│ • Local Storage │    │ • JWT Auth      │
└─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd krishi-sakhi
```

2. **Set up Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Set up Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
krishi-sakhi/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   ├── utils/           # Utility functions
│   │   └── hooks/           # Custom hooks
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration
│   └── package.json
│
└── README.md
```

## 🔧 Key Features

### Frontend Features
- **Responsive Design**: Mobile-first, works on all devices
- **Voice Input**: Speech recognition in Malayalam and English
- **Offline Support**: Local storage with sync capabilities
- **PWA Ready**: Can be installed as mobile app
- **Multilingual UI**: Complete Malayalam/English support

### Backend Features
- **RESTful API**: Clean, documented API endpoints
- **MongoDB Integration**: Scalable data storage
- **Real-time Chat**: AI-powered farming assistant
- **Weather Integration**: Location-based weather data
- **Security**: Rate limiting, input validation, CORS

## 🌐 API Endpoints

### Farm Management
- `GET /api/farm/profile` - Get farm profile
- `POST /api/farm/profile` - Create/update farm profile
- `GET /api/farm/activities` - Get activities
- `POST /api/farm/activities` - Add activity

### Chat System
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/message` - Send message

### Alerts & Weather
- `GET /api/alerts` - Get alerts
- `GET /api/weather/current` - Get current weather

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js for security headers
- Environment-based configuration

## 📱 Mobile Support

- Touch-friendly interface
- Voice input support
- Offline functionality
- Progressive Web App (PWA)
- Responsive design for all screen sizes

## 🌍 Internationalization

- Malayalam (ml) - Primary language for Kerala farmers
- English (en) - Secondary language
- Context-based translation system
- RTL support ready

## 🔄 Offline Support

- Local storage for critical data
- Background sync when online
- Offline activity logging
- Cached responses for better performance

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Use PM2 or similar process manager for production
```

### Environment Variables

**Backend (.env)**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/krishi-sakhi
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env)**
```
VITE_API_URL=https://your-backend-domain.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Kerala farming community for inspiration
- Open source libraries and tools used
- Contributors and maintainers

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ for Kerala farmers**