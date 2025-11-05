# Warehouse Management System

Our web-based warehouse management application is designed to streamline inventory tracking and management. This system enables efficient recording, organization, and monitoring of warehouse stock with an intuitive user interface.

## Team

- Daniel Töpel
- Abidin Deniz Altun
- Emrullah Arac

## Overview

The Warehouse Management System provides a fundamental solution for managing inventory operations. Users can add, edit, view, and delete products while maintaining accurate stock levels and location tracking. The application features real-time search capabilities, sortable data views, and paginated product listings for efficient data management.

## Technology Stack

### Backend
- **Spring Boot** - Java framework for building the REST API
- **MongoDB** - NoSQL database for flexible data storage

### Frontend
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript for better code quality
- **Vite** - Modern build tool for faster development
- **Axios** - HTTP client for API communication

### CI/CD and Code Quality
- **GitHub Actions** - Automated build and test workflows
- **SonarQube** - Static code analysis and quality checks
- **Docker** - Application containerization
- **Coolify** - Self-hosted deployment platform on VPS

## Architecture

### Backend Structure

```
backend/
├── controller/     - REST API endpoints
├── service/        - Business logic layer
├── repository/     - MongoDB data access
├── model/          - Domain models and DTOs
└── exceptions/     - Global error handling
```

### Frontend Structure

```
frontend/
├── components/     - React components (AddProduct, EditProduct, Pagination, etc.)
├── service/        - API client services
├── types/          - TypeScript type definitions
└── App.tsx         - Main application component
```

## Features

### Core Functionality
- Display all products in a searchable, sortable table
- Add new products with details
- Edit existing products with pre-filled forms
- View product information including timestamps
- Delete products with the confirmation dialog
- Search products by name, SKU, or stock location
- Sort products by price or stock quantity (ascending/descending)
- Paginated product listings for better performance
- Responsive design for mobile and desktop use

### Product Attributes
- Product name
- Stock Keeping Unit (SKU)
- Storage location
- Price
- Quantity in stock
- Creation timestamp
- Last update timestamp

## API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Retrieve all products |
| GET | `/api/products/{id}` | Retrieve product by ID |
| POST | `/api/products/add` | Create new product |
| PUT | `/api/products/{id}` | Update existing product |
| DELETE | `/api/products/{id}` | Delete product |

### Example Request

```bash
# Get all products
curl -X GET http://localhost:8080/api/products

# Create new product
curl -X POST http://localhost:8080/api/products/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "USB Cable",
    "stockKeepingUnit": "USB-001",
    "location": "A1-R02-B03",
    "price": 5.99,
    "quantity": 100
  }'
```

## Development Setup

### Prerequisites
- Java 21 or higher
- Maven 3.6 or higher
- Node.js 20 or higher
- MongoDB 5.0 or higher
- Docker (optional)

### Backend Setup

1. Start MongoDB using Docker:
```bash
docker run -d -p 27017:27017 --name mongo mongo
```

2. Build and run the Spring Boot application:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Deployment

### Coolify Deployment on VPS

This application is deployed using Coolify, a self-hosted PaaS alternative to services like Heroku or Render.

#### Prerequisites
- VPS with Docker installed
- Coolify installed and configured
- Domain name (optional but recommended)

#### Setup Steps

1. **Connect GitHub Repository to Coolify**
    - In Coolify dashboard, create a new project
    - Connect your GitHub repository
    - Select the branch (master/main)

2. **Configure Build Settings**
    - Build Type: Docker Compose
    - Dockerfile Path: `./Dockerfile`
    - Docker Compose Path: `./docker-compose.yml`

3. **Set Environment Variables in Coolify**
   ```
   DOCKER_IMAGE_TAG=your-dockerhub-username/warehouse-management:latest
   PORT=8080
   ```

4. **Configure Webhook (Optional)**
    - In Coolify, get the webhook URL for your application
    - Add it to GitHub repository secrets as `COOLIFY_WEBHOOK_URL`
    - This enables automatic deployment on push to master

5. **Deploy**
    - Click "Deploy" in Coolify dashboard
    - Or push to master branch (if webhook configured)

#### Docker Compose Deployment

The application uses Docker Compose with two services:
- **MongoDB**: Database container with persistent volume
- **Application**: Spring Boot app with embedded React frontend

```bash
# Deploy using Docker Compose directly
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Manual Docker Deployment

```bash
# Build Docker image
docker build -t warehouse-management .

# Run with Docker
docker run -d \
  --name warehouse-app \
  -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI=mongodb://your-mongo-host:27017/warehouse \
  warehouse-management
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. **Pull Request Creation**
    - Automated unit tests run
    - SonarQube code quality analysis
    - Minimum one reviewer approval required

2. **Merge to Master Branch**
    - Frontend build process
    - Backend build with embedded frontend
    - Docker image creation and push to Docker Hub
    - Automatic deployment to Coolify via webhook

### GitHub Secrets Required

Configure these secrets in your GitHub repository:

```
DOCKER_HUB_USERNAME - Your Docker Hub username
DOCKER_HUB_TOKEN - Your Docker Hub token
DOCKER_IMAGE_TAG - Full image tag (e.g., username/warehouse-management)
COOLIFY_WEBHOOK_URL - Webhook URL from Coolify (optional)
```

### Workflow File

The CI/CD workflow is defined in `.github/workflows/deploy.yml`

## Code Quality

The project uses SonarQube for static code analysis. Quality gates are configured to ensure:
- Code coverage above threshold
- No critical or blocker issues
- Maintainability rating of A or B
- Security hotspots reviewed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

This project was developed as part of a collaborative learning experience focusing on full-stack web development, DevOps practices, and modern software engineering principles.
