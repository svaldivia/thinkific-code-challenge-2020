# Thinkific Coding Challenge

## Contents

- [Notes](#notes)
- [App Information](#app-information)

# Notes

### Date

Dec 5, 2020

### Location of deployed application

https://thinkific-challenge-2020.herokuapp.com/

### Time spent

~8 hours

### Assumptions made

- Every user has their own count. As a result, each request with a user's token returns their own count.
- API returns token in payload
- API endpoints that access count require a valid token

### Shortcuts/Compromises made

#### General

- Didn't spend too much time setting up eslint, prettier and tsconfig, I mostly based it out of previous configurations I've used. These have to be revised to ensure that there are no extra config files and it aligns with teams code style.
- Decided to bundle client and server together for simplicity. In the real-world, these would live in separate repos.
- Environment variables should be setup in the sever and in dev. The `.env` files should never be in github. I pushed it for testing purposes.

#### BE

- Token secret should be stored in an env variable. I had problems validating the JWT token when I did this so I decided to leave it as a string.
- Use node sessions to keep track of user sessions: login and logout. I opted out of using sessions in favor of using the JWT token; however, we could leverage nodeJS sessions to keep track which user is logged in. I am not familiar with using JWT and sessions using passport and node so decided it was best not to try for this project.
- JWT invalidation: I only added expiry dates so that they will eventually become invalid.
- Send JWT in an `httponly` cookie: This improves the JWT handling in the FE because I would not have to store the JWT in memory. I decided not to do this because I understood from the instructions that the token should be in the payload.
- Break up the route api definition for clarity: I defined all routes in the same file because the business logic was simple. In a real app, I would separate route definition from business logic. This is also applicable to the tests, I would separate by routes for clarity.

#### FE

- Clean up unnecessary files created by create-react-app
- Add unit test with testing library for hooks and components: I focused on doing the tests for the BE with a mocked mongodb instead. I didn't write these because of time constraints.
- Build own components rather than using grommet: I used grommet to facilitate UI development. In a real application, there might be a particular aestethic desired by designers and in order to achieve it we need to build our own components.

### Stretch goals attempted

- Deploy Service (Heroku)

The main complication was getting typescript to compile correctly and produce the right build files. Once that was done, it went smoothly,

- Create SPA for server

I created the app with create-react-app. I managed to organize the components as I wanted and used Grommet as a styling library. I ended up deciding not to add tests to the components because I felt I had spent too much time on the project already and wanted to focus on adding tests to the BE endpoints instead. I wanted to add unit tests to all the components and hooks in the `/components` folder.

### Instructions to run assignment locally

Install Dependencies

`yarn setup`

Run Locally

`yarn dev`

Note: Mongodb is hosted in Mongo Atlas. It is set to receive all incoming requests (temporarily) so that any one can test this app locally.

Run server tests

`cd server`

`yarn test`

### What did you not include in your solution that you want us to know about?

The most important thing I didn't add to this project was FE tests. I was very hesitant because tests are **very** valuable; however, I felt I already invested too much time on this project. I did add tests for the BE.

# App Information

## Features

- Used passportJs strategies to create and validate endpoints using a JWT token
- Created React application that consumes the endpoint
- Added API unit tests using in memory mongo db
- Connected to cloud deployment of mongodb using Mongo Atlas.
- Used Typescript for type validation
- Encoded passwords in db using `bcrypt`
- Deployed to Heroku

## API Endpoints

### Register User

**[POST]** `/api/signup`

Registers a user based on the credentials provided in the payload.

**Payload:**

```json
{
  "email": "awesome@email.com",
  "password": "SomethingSecure1"
}
```

**Returns**
The newly created user object

### Login User

**[POST]** `/api/login`

Logs in a user based on the credentials provided in the payload.

**Payload:**

```json
{
  "email": "awesome@email.com",
  "password": "SomethingSecure1"
}
```

**Returns**
A signed JWT token for the user

### Get Current Count

**[GET]** `/api/current`

Get user's count from the database.

**Header:**

```
Authorization: "Bearer <JWT Token>",
```

**Returns**
The user's current count

### Increment Count

**[GET]** `/api/next`

Increment user's count in the database and retrieve the new value.

**Header:**

```
Authorization: "Bearer <JWT Token>",
```

**Returns**
The user's new current count

### Reset Count

**[PUT]** `/api/reset`

Update user's count in the database based on the provided count

**Header:**

```
Authorization: "Bearer <JWT Token>",
```

**Payload:**

```json
{
  "count": 9001
}
```

**Returns**
The user's new current count
