# Assistant Doc README

## Overview
Assistant Doc is a comprehensive solution for doctors to manage clients and health programs. The project consists of a **frontend** built with Angular and a **backend** powered by Node.js and Express. The backend uses Prisma for database management and migrations. Below is a detailed guide for setting up and running the project.

---

## Frontend

### Tech Stack
- **Framework**: Angular
- **Styling**: Angular Material (or specify your styling library)
- **State Management**: RxJS (if applicable)

### Setup Instructions
1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    ng serve
    ```
4. Build for production:
    ```bash
    ng build --prod
    ```

---

## Backend

### Tech Stack
- **Framework**: Node.js with Express
- **Database**: PostgreSQL/MySQL (or specify your database)
- **ORM**: Prisma

### Setup Instructions
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
    - Create a `.env` file in the backend directory.
    - Add the following variables:
      ```
      DATABASE_URL=your_database_connection_string
      PORT=your_server_port
      ```
4. Run the server:
    ```bash
    npm start
    ```

---

## Prisma Migrations

### Steps to Apply Migrations
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Generate Prisma client:
    ```bash
    npx prisma generate
    ```
3. Apply migrations to the database:
    ```bash
    npx prisma migrate dev
    ```
4. View the database schema:
    ```bash
    npx prisma studio
    ```

---

## Folder Structure
```
/frontend
  ├── src
  ├── assets
  └── angular.json
/backend
  ├── prisma
  ├── src
  └── package.json
```

---

## Contribution
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Description of changes"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Create a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).
