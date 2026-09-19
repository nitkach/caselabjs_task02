# Simple API skeleton

A minimal TypeScript project skeleton built around the main backend patterns from the longread: middleware, request validation, centralized error handling and request logging.

## Features

- Express server
- JSON parsing
- request logger middleware
- validation with Zod
- centralized error handling
- `/health` and `/api/users` endpoints

## Run locally

1. Install dependencies:
   npm install
2. Start the dev server:
   npm run dev
3. Open the app:
   - http://localhost:3000/health
   - POST http://localhost:3000/api/users

Example body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "age": 28
}
```

## Build

```bash
npm run build
```

## Start production build

```bash
npm start
```

