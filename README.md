---
title: Vantage
emoji: 
colorFrom: yellow
colorTo: red
sdk: docker
pinned: false
app_port: 7860
---

# 🎯 Vantage - AI Career Command Center

<div align="center">

**Your Complete AI-Powered Platform for Interview Success & Career Growth**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python)](https://python.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Feature Deep Dive](#-feature-deep-dive)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Vantage** (also known as InterviewFlow) is a comprehensive AI-powered career platform that transforms the way you prepare for technical interviews and manage your job search. It combines cutting-edge AI technologies including Large Language Models (LLMs), Computer Vision, Audio Analysis, and Real-time Processing to provide a complete interview preparation and career management solution.

### Why Vantage?

- 🤖 **AI-Powered Mock Interviews**: Practice with realistic AI-generated questions tailored to your target role
- 📊 **Real-time Performance Analysis**: Get instant feedback on technical accuracy, clarity, and confidence
- 🎥 **Multi-Modal Assessment**: Video, audio, and text analysis for comprehensive evaluation
- 💼 **Career Management Hub**: Track applications, research companies, and negotiate offers
- 🎓 **Continuous Learning**: Personalized roadmaps and coding practice platform

---

## ✨ Key Features

### 🎤 AI Mock Interview System
- **Intelligent Question Generation**: Role-specific questions based on job descriptions and resume
- **Real-time Speech-to-Text**: Seamless voice transcription during practice sessions
- **Multi-dimensional Evaluation**: Assessment of technical accuracy, communication clarity, and confidence
- **Adaptive Difficulty**: Questions adapt based on your performance level
- **Comprehensive Feedback**: Detailed reports with areas of improvement and actionable tips

### 📹 Interview HUD (Heads-Up Display)
- **Live Video Feed**: Practice with webcam to simulate real interview conditions
- **Sentiment Analysis Radar**: Real-time emotion and engagement tracking
- **Performance Metrics**: Visual indicators for pace, clarity, and confidence
- **Critical Alerts**: Instant warnings for filler words, long pauses, or negative sentiment
- **Session Recording**: Review your performance post-interview

### 💻 CodeDojo - Live Coding Practice
- **Monaco Editor Integration**: Professional code editor with syntax highlighting
- **Multi-language Support**: Practice in Python, JavaScript, Java, C++, and more
- **Real-time Execution**: Test your code with immediate feedback
- **Algorithm Challenges**: Curated problems from easy to hard difficulty
- **Performance Tracking**: Monitor your coding progress over time

### 🏢 CompanyIntel - Research Assistant
- **Company Deep Dive**: Automated research on target companies
- **Culture Analysis**: Insights into work environment and values
- **Recent News**: Latest developments and company updates
- **Interview Process Intel**: Common questions and interview patterns
- **Salary Benchmarking**: Compensation data for roles and locations

### 📝 Resume Architect
- **PDF Resume Upload**: Parse and analyze your resume
- **ATS Optimization**: Ensure your resume passes applicant tracking systems
- **Multiple Resume Management**: Store and manage different resume versions
- **Keyword Matching**: Compare your resume against job descriptions
- **Default Resume Selection**: Quick access to your primary resume

### 📱 Application Tracker
- **Kanban Board Interface**: Visual pipeline (Applied → Phone Screen → Interview → Offer)
- **Drag-and-drop**: Easy status updates with intuitive UI
- **Application Details**: Track company, role, salary, date applied, and notes
- **Statistics Dashboard**: Visualize your job search progress
- **Deadline Reminders**: Never miss important follow-ups

### 🗺️ PathFinder - Career Roadmap Generator
- **Personalized Learning Paths**: AI-generated roadmaps based on your goals
- **Skill Gap Analysis**: Identify what you need to learn
- **Resource Recommendations**: Curated courses, books, and projects
- **Timeline Planning**: Realistic milestones for career transitions
- **Progress Tracking**: Monitor your learning journey

### 💰 Negotiator - Salary Intelligence
- **Market Rate Analysis**: Data-driven salary insights
- **Negotiation Scripts**: AI-generated templates for various scenarios
- **Counter-offer Guidance**: Strategic advice for negotiations
- **Benefits Comparison**: Evaluate total compensation packages

### 📊 Dashboard & Analytics
- **Performance Metrics**: Track interview scores over time
- **Skill Matrix**: Visual representation of strengths and weaknesses
- **Interview History**: Access all past sessions and feedback
- **Goal Setting**: Set and track career objectives
- **Insights & Trends**: AI-powered analysis of your progress

---

## 🏗️ Architecture

Vantage follows a modern **microservices-inspired architecture** with a clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────────────┐  │
│  │Dashboard│ │Interview │ │CodeDojo│ │ ApplicationTracker│  │
│  │         │ │   HUD    │ │        │ │                  │  │
│  └─────────┘ └──────────┘ └────────┘ └─────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           WebSocket & REST API Client                │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────┬──────────────────────────────────┬──┘
                        │                                  │
                        │ HTTP/WebSocket                   │
                        │                                  │
┌───────────────────────▼──────────────────────────────────▼──┐
│                  Backend (FastAPI + Python)                 │
│                                                              │
│  ┌───────────────┐         ┌──────────────────┐            │
│  │  REST API     │         │  WebSocket API   │            │
│  │  Endpoints    │         │  (Real-time)     │            │
│  └───────┬───────┘         └────────┬─────────┘            │
│          │                          │                       │
│          └──────────┬───────────────┘                       │
│                     │                                       │
│        ┌────────────▼─────────────┐                        │
│        │   Orchestrator Service   │                        │
│        │  (Session Management)    │                        │
│        └────────────┬─────────────┘                        │
│                     │                                       │
│     ┌───────────────┼───────────────┐                      │
│     │               │               │                      │
│  ┌──▼───┐     ┌────▼────┐    ┌────▼────┐                 │
│  │ RAG  │     │   LLM   │    │ Vision  │                 │
│  │Engine│     │  Agent  │    │ Engine  │                 │
│  └──────┘     └─────────┘    └─────────┘                 │
│                                                             │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Audio   │  │  Code    │  │   Recon  │                 │
│  │ Engine  │  │Executor  │  │ Service  │                 │
│  └─────────┘  └──────────┘  └──────────┘                 │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                   ┌──────▼──────┐
                   │  External   │
                   │   Services  │
                   │             │
                   │ • Groq API  │
                   │ • Firebase  │
                   │ • DuckDuckGo│
                   └─────────────┘
```

### Backend Services

1. **Orchestrator**: Central hub managing interview sessions and coordinating services
2. **RAG Engine**: Retrieval-Augmented Generation for context-aware question generation
3. **LLM Agent**: Interface to Groq LLM for answer evaluation and feedback
4. **Vision Engine**: Computer vision analysis of video feed (body language, eye contact)
5. **Audio Engine**: Speech analysis for fluency, pace, filler words detection
6. **Code Executor**: Safe sandbox for running user-submitted code
7. **Recon Service**: Company research and intelligence gathering
8. **Roadmap Service**: Career path generation and skill planning
9. **Tracker**: Application status management and analytics

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.2 with React Router for SPA navigation
- **Build Tool**: Vite for lightning-fast development
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library with Framer Motion animations
- **State Management**: React Hooks and Context API
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Charts**: Recharts for data visualization
- **Drag & Drop**: @hello-pangea/dnd for Kanban board
- **PDF Handling**: react-pdf for resume viewing
- **Authentication**: Firebase Authentication
- **HTTP Client**: Axios for API communication
- **Real-time**: WebSocket client for live interview features

### Backend
- **Framework**: FastAPI (modern, fast Python web framework)
- **ASGI Server**: Uvicorn with WebSocket support
- **AI/ML**:
  - LangChain for LLM orchestration
  - Groq Cloud for inference (ChatGroq)
  - Custom RAG implementation
- **Real-time**: WebSockets for live interview sessions
- **Data Validation**: Pydantic v2 for schema validation
- **Search**: DuckDuckGo API for company research
- **Environment**: python-dotenv for configuration
- **CORS**: Configured for cross-origin requests

### AI & Machine Learning
- **LLM Provider**: Groq (ultra-fast inference)
- **Model**: Llama or Mixtral (configurable)
- **Techniques**: 
  - RAG (Retrieval-Augmented Generation)
  - Prompt Engineering
  - JSON-mode for structured outputs
  - Few-shot learning

### Infrastructure & Deployment
- **Containerization**: Docker with multi-stage builds
- **Platform**: Hugging Face Spaces (configurable)
- **Storage**: Local filesystem (upgradeable to S3/GCS)
- **Database**: JSON file storage (upgradeable to PostgreSQL/MongoDB)

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.13+ (backend)
- **Node.js**: 18+ (frontend)
- **Package Managers**: pip and npm/yarn
- **API Keys**:
  - Groq API key (required for AI features)
  - Firebase credentials (for authentication)
  - Google API key (optional, for enhanced features)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vantage.git
cd vantage
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Optional: Install AI/CV/Audio extensions
pip install -r requirements-ai.txt
pip install -r requirements-cv.txt
pip install -r requirements-audio.txt

# Create .env file
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Edit .env and add your API keys
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Configure Firebase and API endpoint
```

#### 4. Environment Configuration

**Backend `.env`**:
```env
# API Keys
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

# Model Configuration
GROQ_MODEL=llama-3.1-70b-versatile

# Paths
DATA_DIR=backend/data

# Server
HOST=0.0.0.0
PORT=7860
```

**Frontend `.env`**:
```env
VITE_API_URL=http://localhost:7860/api
VITE_WS_URL=ws://localhost:7860/ws
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend**:
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 7860
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:7860`
- API Docs: `http://localhost:7860/docs`

#### Production Build

**Backend**:
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 7860 --workers 4
```

**Frontend**:
```bash
cd frontend
npm run build
npm run preview
```

---

## 🔍 Feature Deep Dive

### Mock Interview Workflow

1. **Setup Phase**:
   - User uploads resume (PDF)
   - Pastes job description
   - Selects role and number of questions
   - Clicks "Start Interview"

2. **Interview Phase**:
   - AI generates personalized questions using RAG
   - User sees question on InterviewHUD
   - Webcam and mic activated
   - User speaks answer (speech-to-text transcription)
   - Real-time sentiment analysis displayed

3. **Evaluation Phase**:
   - Answer sent to LLM agent for evaluation
   - Audio engine analyzes speech patterns
   - Vision engine analyzes body language
   - Composite feedback generated
   - Next question presented

4. **Report Phase**:
   - Complete session summary
   - Scoring breakdown (technical, clarity, confidence)
   - Hiring probability calculation
   - Detailed improvement suggestions
   - Mistakes and tips listed

### Sentiment Analysis

The system tracks multiple emotional dimensions:
- **Confidence**: Based on speech fluency and body language
- **Nervousness**: Detected from filler words and hesitation
- **Engagement**: Eye contact and facial expressions
- **Tone**: Positive, neutral, or negative sentiment

### Code Execution Sandbox

- Secure isolated environment
- Timeout protection (10 seconds max)
- Memory limits
- Supports stdin/stdout
- Error capture and display

---

## 📡 API Documentation

### REST Endpoints

#### Health Check
```http
GET /health
```

#### Resume Management
```http
POST /api/resume/upload
GET /api/resume/list
```

#### Interview Session
```http
POST /api/interview/start
POST /api/interview/{session_id}/answer
POST /api/interview/{session_id}/telemetry
GET /api/interview/{session_id}/report
```

#### Code Execution
```http
POST /api/code/execute
```

#### Company Research
```http
POST /api/recon/search
```

#### Application Tracking
```http
GET /api/tracker/applications
POST /api/tracker/applications
PUT /api/tracker/applications/{id}
DELETE /api/tracker/applications/{id}
```

### WebSocket Endpoints

#### Live Interview
```
WS /ws/interview/{session_id}
```

Events:
- `question`: New question sent to client
- `transcription`: Partial speech-to-text result
- `sentiment`: Real-time emotion analysis
- `feedback`: Answer evaluation
- `completed`: Interview finished

---

## ⚙️ Configuration

### Model Selection

Supported Groq models:
- `llama-3.1-70b-versatile` (recommended, balanced)
- `llama-3.1-8b-instant` (fast, less accurate)
- `mixtral-8x7b-32768` (large context window)
- `gemma-7b-it` (efficient)

### Customization

#### Question Templates
Edit `backend/app/services/rag_engine.py` to customize prompts.

#### Scoring Weights
Modify `backend/app/services/orchestrator.py` to adjust evaluation criteria.

#### UI Theme
Update `frontend/tailwind.config.js` for design changes.

#### Feature Flags
Use environment variables to enable/disable features:
```env
ENABLE_VIDEO_ANALYSIS=true
ENABLE_AUDIO_ANALYSIS=true
ENABLE_CODE_EXECUTION=true
```

---

## 👨‍💻 Development

### Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── api/
│   │   ├── endpoints.py     # REST routes
│   │   └── websockets.py    # WebSocket routes
│   ├── core/
│   │   ├── config.py        # Settings management
│   │   └── state.py         # Shared state
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   └── services/
│       ├── orchestrator.py  # Session management
│       ├── llm_agent.py     # LLM interface
│       ├── rag_engine.py    # Question generation
│       ├── vision_engine.py # Video analysis
│       ├── audio_engine.py  # Speech analysis
│       ├── code_executor.py # Code runner
│       ├── recon_service.py # Company research
│       └── tracker.py       # App tracking
└── backend/data/
    ├── resumes.json         # Resume metadata
    └── uploads/             # Uploaded files

frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx
│   │   ├── InterviewHUD.jsx
│   │   ├── CodeDojo.jsx
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API clients
│   ├── lib/                 # Utilities
│   └── assets/              # Static assets
└── public/
```

### Adding New Features

1. **Backend Service**: Create in `backend/app/services/`
2. **API Endpoint**: Add to `backend/app/api/endpoints.py`
3. **Schema**: Define in `backend/app/models/schemas.py`
4. **Frontend Component**: Create in `frontend/src/components/`
5. **Route**: Add to `frontend/src/App.jsx`

### Testing

```bash
# Backend tests (when implemented)
cd backend
pytest

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Python linting
cd backend
flake8 app/
black app/

# JavaScript linting
cd frontend
npm run lint
npm run format
```

---

## 🐳 Deployment

### Docker Deployment

#### Build Images

```bash
# Backend
docker build -t vantage-backend -f backend/Dockerfile .

# Frontend
docker build -t vantage-frontend -f dockerfile .
```

#### Run Containers

```bash
# Backend
docker run -p 7860:7860 --env-file backend/.env vantage-backend

# Frontend  
docker run -p 5173:5173 --env-file frontend/.env vantage-frontend
```

#### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "7860:7860"
    env_file:
      - backend/.env
    volumes:
      - ./backend/data:/app/backend/data
  
  frontend:
    build: .
    ports:
      - "5173:5173"
    env_file:
      - frontend/.env
    depends_on:
      - backend
```

### Hugging Face Spaces

1. Create new Space on Hugging Face
2. Select "Docker" SDK
3. Push code to Space repository
4. Configure secrets in Settings:
   - `GROQ_API_KEY`
   - `GOOGLE_API_KEY`
   - Firebase credentials

### Cloud Platforms

#### AWS
- **Backend**: ECS/Fargate or EC2
- **Frontend**: S3 + CloudFront
- **Database**: RDS PostgreSQL
- **Storage**: S3 for resumes

#### Google Cloud
- **Backend**: Cloud Run
- **Frontend**: Firebase Hosting
- **Database**: Cloud SQL
- **Storage**: Cloud Storage

#### Azure
- **Backend**: App Service
- **Frontend**: Static Web Apps
- **Database**: Azure SQL
- **Storage**: Blob Storage

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Bug Reports
Open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Feature Requests
Describe:
- Use case
- Proposed solution
- Alternatives considered

### Pull Requests
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- **Python**: Follow PEP 8, use Black formatter
- **JavaScript**: Follow Airbnb style guide, use ESLint
- **Commits**: Use conventional commits format

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq** for ultra-fast LLM inference
- **FastAPI** for excellent web framework
- **React** team for amazing frontend library
- **LangChain** for LLM orchestration tools
- **Hugging Face** for deployment infrastructure
- Open source community for countless contributions

---

## 📞 Support

- **Documentation**: [docs.vantage.dev](https://docs.vantage.dev)
- **Issues**: [GitHub Issues](https://github.com/yourusername/vantage/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/vantage/discussions)
- **Email**: support@vantage.dev

---

## 🗺️ Roadmap

### Q1 2026
- [ ] Video recording and playback
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard

### Q2 2026
- [ ] Integration with job boards (LinkedIn, Indeed)
- [ ] AI resume builder with templates
- [ ] Interview scheduling assistant
- [ ] Peer practice matching

### Q3 2026
- [ ] Multi-language support (Spanish, French, German)
- [ ] Industry-specific interview prep (Finance, Healthcare)
- [ ] Certification exam prep
- [ ] Corporate training platform

### Q4 2026
- [ ] AR/VR interview simulation
- [ ] Voice cloning for mock recruiters
- [ ] Blockchain credentials
- [ ] API marketplace for integrations

---

## 📊 Statistics

- **Languages**: Python, JavaScript, CSS
- **Files**: 50+
- **Lines of Code**: 10,000+
- **Components**: 15+
- **Services**: 9+
- **API Endpoints**: 20+

---

<div align="center">

**Built with ❤️ by the Vantage Team**

[Website](https://vantage.dev) • [Documentation](https://docs.vantage.dev) • [Blog](https://blog.vantage.dev)

</div>


