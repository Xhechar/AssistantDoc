# Backend Project

## Overview
This project serves as the backend for a assistant doc application. It provides APIs and handles logic, database interactions, and other server-side operations.

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A database (e.g., PostgreSQL, MongoDB)

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Xhechar/AssistantDoc.git
    cd backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and configure the following variables:
    ```
    DATABASE_URL=<your-database-url>
    PORT=3000
    JWT_SECRET=<your-secret-key>
    ```

4. **Run database migrations (if applicable):**
    ```bash
    npm run migrate
    # or
    yarn migrate
    ```

5. **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. **Access the API:**
    The server will be running at `http://localhost:3000`.

## Scripts

- `npm run dev` - Start the development server.
- `npm run build` - Build the project for production.
- `npm start` - Start the production server.
- `npm test` - Run tests.

## Folder Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   └── routes/
├── tests/
├── .env
├── package.json
└── README.md
```

## Contributing
Feel free to submit issues or pull requests to improve the project.

## License
This project is licensed under the [MIT License](LICENSE).