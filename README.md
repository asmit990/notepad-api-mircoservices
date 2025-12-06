# NotesVerb - Microservices Note-Taking Application

A modern, scalable note-taking application built with microservices architecture using Node.js, TypeScript, and PostgreSQL.

## 🏗️ Architecture Overview

NotesVerb follows a microservices architecture pattern with the following services:

- **API Gateway** (Port 8080) - Central entry point, routing, and authentication
- **Auth Service** (Port 3001) - User authentication and JWT token management
- **User Service** (Port 3002) - User profile management
- **Notes Service** (Port 3003) - Note creation, retrieval, and management
- **Tags Service** (Port 3004) - Tag management and organization

Each service has its own PostgreSQL database following the database-per-service pattern.

## 🚀 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Security**: Helmet, CORS, bcrypt

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)
- Git

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/fiston-user/notesverb-yt.git
cd notesverb-yt
```

### 2. Environment Setup

Copy the environment example files and configure them:

```bash
# Root environment file
cp .env.example .env

# API Gateway
cp api-gateway/.env.example api-gateway/.env

# Services
cp services/auth-service/.env.example services/auth-service/.env
cp services/user-service/.env.example services/user-service/.env
cp services/notes-service/.env.example services/notes-service/.env
cp services/tags-service/.env.example services/tags-service/.env
```

### 3. Update Environment Variables

Edit the `.env` files and update the following critical values:

- `JWT_SECRET` - Use a strong, random secret (minimum 256 bits)
- `JWT_REFRESH_SECRET` - Use a different strong, random secret
- Database passwords (if not using default Docker setup)

**Generate secure secrets:**

```bash
# Generate JWT secrets
openssl rand -base64 32
```

### 4. Start the Database

```bash
docker-compose up postgres -d
```

### 5. Install Dependencies

```bash
# Install dependencies for all services
npm install

# Or install individually
cd api-gateway && npm install
cd ../services/auth-service && npm install
cd ../user-service && npm install
cd ../notes-service && npm install
cd ../tags-service && npm install
cd ../shared && npm install
```

### 6. Database Setup

Run Prisma migrations for each service:

```bash
# Auth Service
cd services/auth-service
npx prisma migrate dev
npx prisma generate

# User Service
cd ../user-service
npx prisma migrate dev
npx prisma generate

# Notes Service
cd ../notes-service
npx prisma migrate dev
npx prisma generate

# Tags Service
cd ../tags-service
npx prisma migrate dev
npx prisma generate
```

### 7. Start the Services

Start each service in development mode:

```bash
# Terminal 1 - Auth Service
cd services/auth-service
npm run dev

# Terminal 2 - User Service
cd services/user-service
npm run dev

# Terminal 3 - Notes Service
cd services/notes-service
npm run dev

# Terminal 4 - Tags Service
cd services/tags-service
npm run dev

# Terminal 5 - API Gateway
cd api-gateway
npm run dev
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh tokens
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Notes

- `POST /api/notes` - Create a note
- `GET /api/notes` - Get user's notes
- `GET /api/notes/:id` - Get specific note

### Tags

- `POST /api/tags` - Create a tag
- `GET /api/tags` - Get user's tags

## 🧪 Testing

Run tests for each service:

```bash
# Auth Service
cd services/auth-service
npm test

# User Service
cd services/user-service
npm test

# Notes Service
cd services/notes-service
npm test
```

## 🐳 Docker Deployment

### Full Stack with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secrets**: Use strong, unique secrets in production
3. **Database Credentials**: Use secure passwords and restrict access
4. **CORS**: Configure appropriate origins for your frontend
5. **HTTPS**: Use HTTPS in production environments

## 📁 Project Structure

```
notesverb/
├── api-gateway/          # API Gateway service
├── services/
│   ├── auth-service/     # Authentication service
│   ├── user-service/     # User management service
│   ├── notes-service/    # Notes management service
│   └── tags-service/     # Tags management service
├── shared/               # Shared utilities and types
├── docker-compose.yml    # Docker services configuration
├── init-database.sql     # Database initialization
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3001-3004 and 8080 are available
2. **Database connection**: Verify PostgreSQL is running and credentials are correct
3. **JWT errors**: Ensure JWT_SECRET is consistent across all services
4. **CORS issues**: Check CORS_ORIGIN configuration matches your frontend URL

### Health Checks

Each service provides a health check endpoint:

- API Gateway: `http://localhost:8080/health`
- Auth Service: `http://localhost:3001/health`
- User Service: `http://localhost:3002/health`
- Notes Service: `http://localhost:3003/health`
- Tags Service: `http://localhost:3004/health`
