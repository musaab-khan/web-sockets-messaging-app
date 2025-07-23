# Web Sockets Messaging App

This project is a web sockets-based messaging app built with Node.js, Express, WebSockets, BullMQ, MongoDB, and Redis.

## Technology Stack

- **Backend**: Node.js with Express, WebSockets, and BullMQ.
- **Database**: MongoDB with Mongoose.
- **Cache**: Redis.
- **Authentication**: JSON Web Token (JWT).
- **Environment Variables**: Managed with `dotenv`.

## Key Features

- User signup and login with JWT authentication.
- Sending messages in real-time using WebSockets.
- Queue processing with BullMQ for handling messages.
- Redis caching to store user and group information.

## Code Structure

### Entry Points

- **`src/index.ts`**: Initializes the Express app, connects to the database, sets up routers, and starts WebSocket and worker services.
- **`src/ws.ts`**: Handles WebSocket connections and messaging.

### Models

- **User Model**: Defines users with fields for username, email, and password.
- **Message Model**: Stores personal messages between users.
- **Group Model**: Defines user groups.
- **Friend Model**: Manages friend relationships.
- **FriendRequest Model**: Handles friend requests.
- **GroupMessage Model**: Stores group messages.

### Controllers

- **UserController**: Handles user operations like signup and login.
- **MessageController**: Manages message creation and retrieval.
- **GroupController**: Administers group-related actions.

### Helpers

- **Redis Helpers**: Save group/member IDs in Redis for caching.
- **WebSocket Helpers**: Manage WebSocket message sending.

### Routes

- **User Router**: `/users`
- **Message Router**: `/messages`
- **Group Router**: `/groups`
- **Middleware**: JWT Token authentication.

### Other Components

- **BullMQ**: Message queue setup.
- **Redis Client**: Manages Redis connections.

## Flow Diagram

```flowchart
graph TD;
  A[User] -->|Registers/Login| B[Express API];
  B -->|JWT| A;
  B -->|REST API| C[Mongoose/MongoDB];
  B -->|WebSocket| D[WebSocket Server];
  D --> E[User WebSocket];
  E -->|Sends Message| F[BullMQ Worker];
  F --> C;
  F --> G[Redis Cache];
```

## Environment Variables

- **MONGO_URI**: MongoDB connection string.
- **PORT**: Server port.
- **JWT_SIGN_SECRET**: Secret for signing JWT tokens.

## Setup Instructions

1. **Clone the Repo**: `git clone <repo-url>`
2. **Install Dependencies**: `npm install`
3. **Run the Server**: `npm run dev`

## Conclusion

This README serves as a comprehensive introduction to navigating and understanding the codebase.

