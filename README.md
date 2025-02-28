# FILE: /nodejs-mongodb-project/nodejs-mongodb-project/README.md
# Node.js MongoDB Project

This project is a simple Node.js application that uses Express and MongoDB with Mongoose for data management. It includes user authentication, item management, booking functionality, and review capabilities.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Models](#models)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd nodejs-mongodb-project
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your MongoDB connection URI:
   ```
   MONGODB_URI=<your_mongodb_connection_uri>
   ```

5. You can refer to the `.env.example` file for the required environment variables.

## Usage

To start the server, run:
```
npm start
```
or for development with auto-reload:
```
npm run dev
```

The server will be running on `http://localhost:3000`.

## Models

- **User**: Represents a user in the system with fields for name, email, hashed password, and role (Admin or User).
- **Item**: Represents an item with fields for name, description, photo URLs, pricing, availability, geo-location, and a reference to the owner (User).
- **Booking**: Represents a booking with references to the User and Item, along with startDate, endDate, and booking status.
- **Review**: Represents a review with references to the User and Item, along with rating and review text.

## License

This project is licensed under the ISC License.