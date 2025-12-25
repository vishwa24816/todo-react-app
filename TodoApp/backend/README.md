# Todo App Backend API

A RESTful API built with Node.js, Express, TypeScript, and MongoDB for the Todo App mobile application.

## Features

- User authentication (register/login)
- JWT token-based authentication
- Task management (CRUD operations)
- Task filtering and sorting
- Input validation
- Rate limiting
- Security headers

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todoapp
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. Make sure MongoDB is running on your system

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `{ "message": "User registered successfully", "token": "...", "user": {...} }`

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `{ "message": "Login successful", "token": "...", "user": {...} }`

### Tasks

#### Get All Tasks
- **GET** `/api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `filter`, `sortBy`, `sortOrder`, `page`, `limit`
- **Response**: `{ "tasks": [...], "currentPage": 1, "totalPages": 5 }`

#### Create Task
- **POST** `/api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "Task title", "description": "Task description", "deadline": "2024-12-31", "priority": "medium", "category": "Work" }`

#### Update Task
- **PUT** `/api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "Updated title", "status": "completed" }`

#### Delete Task
- **DELETE** `/api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`

## Data Models

### User
```typescript
interface User {
  email: string;
  password: string; // Hashed
  createdAt: Date;
}
```

### Task
```typescript
interface Task {
  title: string;
  description?: string;
  createdAt: Date;
  deadline: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  category?: string;
  userId: string;
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- Security headers with Helmet
- CORS configuration

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (no token)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License
