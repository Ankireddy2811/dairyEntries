# dairyEntries

# dairyEntries


# Introduction

# The Travel Diary Platform backend is built using Node.js and Express.js, with SQLite as the database system. It provides a secure and efficient API for managing user accounts and travel diary entries.


Setup


# Clone the repository: git clone https://github.com/Ankireddy2811/dairyEntries.git
# Navigate to the project directory: cd myapp
# Install dependencies: npm install


used packages 

# Express.js: A minimalist web framework for Node.js
# SQLite: A lightweight relational database management system
# Bcrypt: A library for hashing passwords
# JSON Web Token (JWT): For authentication and authorization
# Dotenv: For loading environment variables from a .env file
# Nodemon: For automatically restarting the server during development

Database

# The backend uses SQLite as the database system. The database is initialized and connected using the sqlite package in Node.js.


Models


# -----> models/Users.js
#   Manages user authentication, registration, and profile management.

# -----> models/DairyEntry.js
#  Handles CRUD operations like create,read,update,delete for travel diary entries.


Routes
The following routes are available:

# /register: POST endpoint for user registration
# /login: POST endpoint for user login
# /createDairyEntry: POST endpoint to create a new diary entry
# /updateDairyEntry/:id: PUT endpoint to update an existing diary entry
# /deleteDairyEntry/:id: DELETE endpoint to delete a diary entry
# /getDairyEntries: GET endpoint to retrieve all diary entries


Middleware

# Middleware is implemented for authentication using JWT. Routes requiring authentication are protected using this middleware.

