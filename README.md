# Krishi Sakhi v2.0 - Digital Farming Assistant

**Official Kerala Government Agriculture Department Solution**

A comprehensive AI-powered farming assistant designed specifically for Kerala farmers, supporting Malayalam and English languages with government schemes integration, market price board, and admin monitoring capabilities.

## 🌾 Overview

Krishi Sakhi v2.0 is a mobile-first web application commissioned by the Government of Kerala, Department of Agriculture, that helps farmers with:

- **🤖 AI Chat Assistant**: Voice and text-based farming advice in Malayalam/English
- **📝 Activity Logging**: Natural language processing for farm activity tracking
- **🏛️ Government Schemes**: Auto-eligibility matching and application tracking
- **💰 Market Price Board**: Live prices and crop selling platform
- **🌤️ Weather Alerts**: Location-based weather notifications and farming tips
- **👨‍💼 Admin Dashboard**: Government monitoring of farmer progress (view-only)
- **📱 Offline Support**: Works without internet connection
- **🎤 Voice Interface**: Speech recognition and synthesis for low-literacy users

## 🏗️ Architecture

The application follows a modern full-stack architecture with role-based access:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │   Government    │
│   (React SPA)   │◄──►│  (FastAPI)      │◄──►│   Dashboard     │
│                 │    │                 │    │                 │
│ • React 18      │    │ • FastAPI       │    │ • Admin Panel   │
│ • Voice API     │    │ • MongoDB       │    │ • Analytics     │
│ • Context API   │    │ • JWT Auth      │    │ • Monitoring    │
│ • Local Storage │    │ • Role-based    │    │ • Schemes Mgmt  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (v4.4+) or use mock data
- Modern web browser with Speech API support

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd krishi-sakhi
```

2. **Set up Backend (FastAPI)**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn app.main:app --reload --port 8000
```

3. **Set up Frontend (React)**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

4. **Access the application**
- **Farmer Interface**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin (login as admin)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
krishi-sakhi/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Login.jsx           # 🆕 Mobile-first login with OTP
│   │   │   ├── Signup.jsx          # 🆕 Farmer registration
│   │   │   ├── MarketBoard.jsx     # 🆕 Price board & crop selling
│   │   │   ├── AdminDashboard.jsx  # 🆕 Government monitoring
│   │   │   ├── TopBar.jsx          # 🆕 Navigation with govt branding
│   │   │   ├── Dashboard.jsx       # Enhanced with schemes
│   │   │   ├── ChatInterface.jsx   # Enhanced with voice
│   │   │   ├── ActivityLog.jsx     # Enhanced with NLP
│   │   │   ├── AlertsReminders.jsx # Enhanced alerts
│   │   │   ├── FarmSetup.jsx       # Enhanced onboarding
│   │   │   ├── WelcomeScreen.jsx   # Preserved
│   │   │   └── BottomNavigation.jsx # Enhanced navigation
│   │   ├── contexts/        # React contexts
│   │   │   ├── AuthContext.jsx     # 🆕 Authentication state
│   │   │   ├── FarmDataContext.jsx # Enhanced with schemes
│   │   │   └── LanguageContext.jsx # Preserved
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions & constants
│   │   └── styles/          # CSS files
│   └── package.json
│
├── backend/                  # FastAPI backend API
│   ├── app/
│   │   ├── routers/         # API routes
│   │   │   ├── auth.py             # 🆕 Authentication endpoints
│   │   │   ├── schemes.py          # 🆕 Government schemes API
│   │   │   ├── market.py           # 🆕 Market price & listings API
│   │   │   ├── admin.py            # 🆕 Admin monitoring API
│   │   │   ├── farm.py             # Enhanced farm management
│   │   │   ├── chat.py             # Enhanced AI chat
│   │   │   ├── alerts.py           # Enhanced alerts
│   │   │   └── weather.py          # Weather integration
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Authentication middleware
│   │   ├── core/            # Configuration
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

## 🔧 Key Features

### **For Farmers (Malayalam-First Interface)**

#### **1. Authentication & Onboarding**
- **Mobile OTP Login**: Secure authentication with phone verification
- **Farm Profile Setup**: Land size, crops, soil type, location
- **Government Scheme Matching**: Auto-eligibility for PM-KISAN, Kerala schemes

#### **2. AI-Powered Chat Assistant**
- **Voice Input**: "ഇന്ന് എന്ത് ചെയ്യണം?" (What should I do today?)
- **Malayalam Support**: Full conversation in native language
- **Context-Aware**: Responses based on crop, weather, and farm data
- **Offline Fallback**: Basic responses when internet is unavailable

#### **3. Natural Language Activity Logging**
- **Voice/Text Input**: "ഇന്നലെ നെല്ലിന് യൂറിയ ഇട്ടു" (Applied urea to paddy yesterday)
- **Auto-Parsing**: Extracts crop, activity, date, and location
- **Timeline View**: Visual activity history with icons
- **Photo Attachment**: Add images to activity logs

#### **4. Government Schemes Integration**
- **Auto-Eligibility**: Matches farmer profile to available schemes
- **Application Tracking**: Status of scheme applications
- **Deadline Alerts**: Reminders for application deadlines
- **Document Guidance**: Required documents for each scheme

#### **5. Market Price Board**
- **Live Prices**: Real-time crop prices from Kerala markets
- **Sell Crops**: List crops for sale with expected prices
- **Buyer Inquiries**: Connect with potential buyers
- **Price Alerts**: Notifications when prices increase

#### **6. Smart Alerts & Reminders**
- **Weather-Based**: "മഴ വരുന്നു—ഇന്ന് സ്പ്രേ ചെയ്യരുത്" (Rain coming - don't spray today)
- **Crop Calendar**: Timely reminders for farming operations
- **Pest Alerts**: Local pest outbreak notifications
- **Scheme Deadlines**: Government scheme application reminders

### **For Government Administrators**

#### **7. Admin Dashboard (View-Only Monitoring)**
- **Farmer Progress**: Activity frequency, adoption rates
- **Scheme Analytics**: Application statistics, utilization rates
- **Geographic Distribution**: District-wise farmer mapping
- **Alert Effectiveness**: Response rates to weather/pest alerts
- **Market Monitoring**: Price trends and farmer listings

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/send-otp` - Send OTP to mobile number
- `POST /api/auth/signup` - Register new farmer
- `POST /api/auth/login` - Login with OTP verification

### **Farm Management**
- `GET /api/farm/profile` - Get farm profile
- `POST /api/farm/profile` - Create/update farm profile
- `GET /api/farm/activities` - Get activities with NLP parsing
- `POST /api/farm/activities` - Add activity (supports natural language)

### **Government Schemes**
- `GET /api/schemes/` - Get all available schemes
- `GET /api/schemes/eligible` - Get schemes eligible for current user
- `POST /api/schemes/{scheme_id}/apply` - Apply for a scheme
- `GET /api/schemes/applications/my` - Get user's applications

### **Market Integration**
- `GET /api/market/prices` - Get current market prices
- `GET /api/market/listings` - Get crop listings from farmers
- `POST /api/market/listings` - Create new crop listing
- `POST /api/market/listings/{id}/inquire` - Inquire about a listing

### **Admin Monitoring**
- `GET /api/admin/farmers` - Get farmers overview (admin only)
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/schemes/analytics` - Get scheme statistics
- `GET /api/admin/alerts/monitoring` - Get alert monitoring data

### **AI Chat & Alerts**
- `POST /api/chat/message` - Send message to AI assistant
- `GET /api/chat/history` - Get chat history
- `GET /api/alerts` - Get personalized alerts
- `GET /api/weather/current` - Get weather data

## 🔒 Security & Authentication

- **JWT-based authentication** with role-based access control
- **OTP verification** for mobile number validation
- **Rate limiting** to prevent API abuse
- **Input validation** and sanitization
- **CORS configuration** for secure cross-origin requests
- **Admin-only routes** protected with role verification

## 📱 Mobile & Voice Support

### **Voice Interface**
- **Speech Recognition**: Browser SpeechRecognition API
- **Speech Synthesis**: Text-to-speech in Malayalam
- **Voice Commands**: "പറയൂ എന്താണ് ചെയ്യേണ്ടത്?" (Tell me what to do)
- **Offline Voice**: Basic voice responses cached locally

### **Mobile Optimization**
- **Touch-friendly**: Large buttons, easy navigation
- **Responsive Design**: Works on all screen sizes
- **PWA Ready**: Can be installed as mobile app
- **Offline Support**: Core features work without internet

## 🌍 Internationalization

- **Malayalam (ml)** - Primary language for Kerala farmers
- **English (en)** - Secondary language
- **Context-based translation** system
- **Voice support** in both languages
- **Government terminology** in Malayalam

## 🔄 Offline Support & Data Sync

- **Local Storage** for critical farm data
- **Background Sync** when connection is restored
- **Offline Activity Logging** with later synchronization
- **Cached AI Responses** for common queries
- **Progressive Web App** capabilities

## 🚀 Deployment

### **Frontend Deployment**
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### **Backend Deployment**
```bash
cd backend
# Set production environment variables
uvicorn app.main:app --host 0.0.0.0 --port 8000
# Use gunicorn or similar for production
```

### **Environment Variables**

**Backend (.env)**
```env
ENVIRONMENT=production
PORT=8000
MONGODB_URI=mongodb://localhost:27017/krishi-sakhi
SECRET_KEY=your-super-secret-key-here
IBM_API_KEY=your-ibm-granite-api-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
WEATHER_API_KEY=your-openweather-api-key
ALLOWED_ORIGINS=["https://your-frontend-domain.com"]
```

**Frontend (.env)**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🧪 Testing & Demo

### **Demo User Accounts**
```
Farmer Login:
Mobile: 9876543210
OTP: 123456

Admin Login:
Mobile: 9876543211
OTP: 123456
```

### **Demo Flow**
1. **Farmer Journey**:
   - Signup → Farm Setup → Dashboard
   - Chat: "ഇന്ന് എന്ത് ചെയ്യണം?" (What should I do today?)
   - Log Activity: "ഇന്നലെ നെല്ലിന് യൂറിയ ഇട്ടു" (Applied urea to paddy yesterday)
   - Check Market Prices → List Crop for Sale
   - View Government Schemes → Apply for PM-KISAN

2. **Admin Journey**:
   - Admin Login → Dashboard
   - Monitor Farmer Progress
   - View Scheme Analytics
   - Check Alert Effectiveness

### **Testing Commands**
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest

# API testing
curl -X POST http://localhost:8000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "9876543210"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow Malayalam-first design principles
4. Test with low-literacy user scenarios
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏛️ Government Partnership

**Commissioned by**: Government of Kerala, Department of Agriculture  
**Target Users**: Smallholder farmers in rural Kerala  
**Languages**: Malayalam (primary), English (secondary)  
**Accessibility**: Designed for low-literacy, non-tech-savvy users  
**Compliance**: Follows Kerala Government digital service guidelines  

## 🙏 Acknowledgments

- **Kerala farming community** for inspiration and feedback
- **Government of Kerala** for commissioning this solution
- **Department of Agriculture** for domain expertise
- **Open source libraries** and tools used in development
- **Contributors and maintainers** of the project

## 📞 Support

For support and questions:
- **Technical Issues**: Create an issue on GitHub
- **Government Queries**: Contact Kerala Agriculture Department
- **Farmer Support**: WhatsApp helpline (integrated in app)
- **Documentation**: Check `/docs` endpoint for API documentation

---

**Made with ❤️ for Kerala farmers by the Government of Kerala**

*"Empowering Kerala's farmers through technology and tradition"*