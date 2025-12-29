# Resume Builder Backend

A Node.js Express backend for building and managing resumes.

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server will run on port 3000 by default.

## API Endpoints

- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get resume by ID
- `POST /api/resumes` - Create a new resume
- `PUT /api/resumes/:id` - Update a resume
- `DELETE /api/resumes/:id` - Delete a resume

## Development

This is a basic setup. For production, consider adding:

- Database integration (e.g., MongoDB, PostgreSQL)
- Authentication
- Validation
- Error handling
