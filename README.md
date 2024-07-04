# Socially App

## Table of Contents

1. [Overview](#overview)
2. [Low-Level Design Document](#low-level-design-document)
    1. [Detailed Description of Each Component](#detailed-description-of-each-component)
    2. [Diagram Illustrating the System Architecture](#diagram-illustrating-the-system-architecture)
3. [Database Schema](#database-schema)
    1. [Table/Collection Definitions and Relationships](#tablecollection-definitions-and-relationships)
4. [API Documentation](#api-documentation)
    1. [Endpoint Definitions](#endpoint-definitions)
    2. [Request/Response Format](#requestresponse-format)
5. [Microservice Based Infrastructure](#microservice-based-infrastructure)

## Overview

### Socially App Overview

**Socially** is a vibrant social networking platform that connects users in an engaging environment. Users can quickly sign up, log in, search for and follow other members, and stay updated on their activities. The app allows users to create posts with text or images, comment on, like, and reply to posts and comments. Users can modify or delete their posts and comments, track post view counts, and use hashtags to search for specific content. Socially fosters a dynamic community where sharing, connecting, and interacting are effortless.
## Low-Level Design Document

### Detailed Description of Each Component

1. **User Component**
    - Handles user authentication (signup/login).
    - Manages user profiles, including updating and deleting users.
    - Allows users to follow other users and search for users by name.

2. **Discussion Component**
    - Manages creating, updating, and deleting discussions.
    - Handles commenting on discussions and replying to comments.
    - Manages liking posts and comments.
    - Tracks the view count of discussions.
    - Allows searching for discussions by hashtags and text content.

3. **Middleware**
    - `auth.js`: Middleware for authenticating requests using JSON Web Tokens (JWT).

4. **Routes**
    - `userRoutes.js`: Defines routes for user-related operations.
    - `discussionRoutes.js`: Defines routes for discussion-related operations.

5. **Database Models**
    - `User.js`: Defines the user schema and model.
    - `Discussion.js`: Defines the discussion schema and model.

### Diagram Illustrating the System Architecture

```plaintext
                        +-----------------------+
                        |      User Client      |
                        +-----------+-----------+
                                    |
                                    |
                                    v
                        +-----------+-----------+
                        |     Express Server    |
                        |  (Node.js + Express)  |
                        +-----------+-----------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            |                                               |
+-----------v-----------+                       +-----------v-----------+
|    User Component     |                       |  Discussion Component |
+-----------+-----------+                       +-----------+-----------+
            |                                               |
            |                                               |
+-----------v-----------+                       +-----------v-----------+
|     User Routes       |                       |  Discussion Routes    |
+-----------+-----------+                       +-----------+-----------+
            |                                               |
            |                                               |
+-----------v-----------+                       +-----------v-----------+
|    User Controller    |                       | Discussion Controller |
+-----------+-----------+                       +-----------+-----------+
            |                                               |
            |                                               |
+-----------v-----------+                       +-----------v-----------+
|   User Model (DB)     |                       |  Discussion Model (DB)|
+-----------------------+                       +-----------------------+
```

## Database Schema

### Table/Collection Definitions and Relationships

#### User Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "mobileNo": String,
  "email": String,
  "password": String,
  "following": [ObjectId]  // Array of User IDs
}
```

#### Discussion Collection

```json
{
  "_id": ObjectId,
  "user": ObjectId,  // References User
  "text": String,
  "image": String,
  "hashtags": [String],
  "createdOn": Date,
  "likes": [ObjectId],  // Array of User IDs
  "comments": [
    {
      "_id": ObjectId,
      "user": ObjectId,  // References User
      "text": String,
      "likes": [ObjectId],  // Array of User IDs
      "replies": [
        {
          "_id": ObjectId,
          "user": ObjectId,  // References User
          "text": String
        }
      ]
    }
  ],
  "viewCount": Number
}
```

## API Documentation

### Endpoint Definitions

#### User Endpoints

1. **Sign Up**
    - `POST /signup`
    - Request Body: `{ "name": "string", "mobileNo": "string", "email": "string", "password": "string" }`
    - Response: `201 Created` with user object and JWT token

2. **Log In**
    - `POST /login`
    - Request Body: `{ "email": "string", "password": "string" }`
    - Response: `200 OK` with user object and JWT token

3. **Update User**
    - `PATCH /user/me`
    - Request Body: `{ "name": "string", "mobileNo": "string", "email": "string", "password": "string" }`
    - Response: `200 OK` with updated user object

4. **Delete User**
    - `DELETE /user/me`
    - Response: `200 OK` with deleted user object

5. **Search User**
    - `GET /users?name=string`
    - Response: `200 OK` with array of user objects

6. **Follow User**
    - `POST /user/follow/:id`
    - Response: `200 OK` with updated user object

#### Discussion Endpoints

1. **Create Discussion**
    - `POST /discussion`
    - Request Body: `{ "text": "string", "image": "string", "hashtags": ["string"] }`
    - Response: `201 Created` with discussion object

2. **Update Discussion**
    - `PATCH /discussion/:id`
    - Request Body: `{ "text": "string", "image": "string", "hashtags": ["string"] }`
    - Response: `200 OK` with updated discussion object

3. **Delete Discussion**
    - `DELETE /discussion/:id`
    - Response: `200 OK` with deleted discussion object

4. **Comment on Discussion**
    - `POST /discussion/:id/comment`
    - Request Body: `{ "text": "string" }`
    - Response: `201 Created` with updated discussion object

5. **Like Discussion**
    - `POST /discussion/:id/like`
    - Response: `200 OK` with updated discussion object

6. **Like Comment**
    - `POST /discussion/:discussionId/comment/:commentId/like`
    - Response: `200 OK` with updated discussion object

7. **Reply to Comment**
    - `POST /discussion/:discussionId/comment/:commentId/reply`
    - Request Body: `{ "text": "string" }`
    - Response: `201 Created` with updated discussion object

8. **Increment View Count**
    - `GET /discussion/:id/view`
    - Response: `200 OK` with updated discussion object

9. **Search Discussion by Tag**
    - `GET /discussions/tag?tag=string`
    - Response: `200 OK` with array of discussion objects

10. **Search Discussion by Text**
    - `GET /discussions/text?text=string`
    - Response: `200 OK` with array of discussion objects

### Request/Response Format

- **Request Format**: JSON
- **Response Format**: JSON

## Microservice Based Infrastructure

While the above implementation is a monolithic application, it can be refactored into a microservice-based architecture. Each component (User, Discussion) can be separated into its own service.

### Suggested Microservices

1. **User Service**
    - Handles user-related operations such as authentication, profile management, and following users.

2. **Discussion Service**
    - Manages discussions, including creating, updating, deleting discussions, and handling comments and likes.

### Communication

- **API Gateway**: A single entry point for clients to interact with various services.
- **Service Discovery**: Automatically detects and manages microservice instances.
- **Message Broker**: Facilitates communication between services (e.g., RabbitMQ or Apache Kafka).

### Benefits

- **Scalability**: Services can be scaled independently.
- **Maintainability**: Easier to manage and update individual services.
- **Resilience**: Failure in one service does not necessarily impact others.

This detailed documentation should help in understanding and developing the Socially App, including its components, database schema, API endpoints, and potential microservice architecture.
