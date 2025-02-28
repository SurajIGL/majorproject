# Rental App API - Postman Collection

This directory contains a Postman collection for testing the Rental App API endpoints.

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the `RentalApp.postman_collection.json` file into Postman.
3. The collection uses environment variables for flexibility. Set up the following variables:
   - `base_url`: Your API base URL (e.g., `http://localhost:5000`)
   - `auth_token`: After logging in, set this to the JWT token you receive

## Available Endpoints

### Authentication
- **User Registration**: Register a new user
- **User Login**: Login and receive authentication token

### Items
- **Create Item Listing**: Add a new item for rent
- **Geo-location Search**: Find items near a specific location

### Payments
- **Initiate Payment**: Create a payment for renting an item

### Bookings
- **Book Rental**: Make a booking for an item

### Reviews
- **Add Review**: Leave a review after renting an item

## Usage Tips

1. Start by registering a user or logging in to get an authentication token.
2. Copy the token from the login response and set it as the `auth_token` environment variable.
3. All authenticated requests will automatically use this token.
4. The collection includes sample request bodies that you can modify as needed.

## Testing Workflow

A typical testing workflow would be:

1. Register a user or login
2. Create an item listing
3. Search for items around a location
4. Initiate payment for an item
5. Book a rental
6. Add a review after the rental period

Each request includes examples of the expected input data and descriptions of the endpoints.
