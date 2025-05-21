# Policy Management System

A full-stack application for managing security and compliance policies, built with FastAPI and React.

## Features

- Create, read, update, and delete policies
- Manage policy rules and configurations
- Policy categorization and prioritization
- Status tracking and auditing
- User authentication and authorization (currently disabled for development)

## Tech Stack

### Backend
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Docker

### Frontend
- React
- Material-UI
- TypeScript
- Axios

## Prerequisites

- Docker and Docker Compose
- Node.js (for local frontend development)
- Python 3.9+ (for local backend development)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd new-policy
```

2. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development

### Backend Development

The backend is a FastAPI application that provides a RESTful API for policy management. Key features include:

- Policy CRUD operations
- Rule management
- Audit logging
- User authentication (currently disabled for development)

### Frontend Development

The frontend is a React application that provides a user interface for managing policies. Features include:

- Policy creation wizard
- Policy listing and filtering
- Rule management
- Status toggling

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core functionality
│   │   ├── crud/           # Database operations
│   │   ├── db/             # Database configuration
│   │   ├── models/         # Database models
│   │   └── schemas/        # Pydantic schemas
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## API Documentation

The API documentation is available at http://localhost:8000/docs when running the application. It provides detailed information about all available endpoints, request/response schemas, and authentication requirements.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 