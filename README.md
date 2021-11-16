## Description

Fetch Reward Home Challenge implementation by David Shemian. </br>
This is not production-ready product, but I did try to make it an easy shift to production, if needed.</br>
I used NestJS, which, in my opinion is a great server-side Node.js Typescript framework, that has some great tools for production usage.</br>
My project is modeled by the Layer system, i.e. there are controllers to handel the incoming requests, services to handel the business logic, and DAL (Data Access Layer) which handles the DB access.</br>
For this project, I'm using sqlite3 as a simple-in memory SQL DB. </br>
In case this project was to go to production, here are some of the things I would think about doing:

-   Use an environment configuration system, instead of hard coding the configurations as it is right now.
-   Use a production-suited, well indexed DB such as PostgreSQL, MySQL, or MongoDB
-   Add some more unit tests to the already existing e2e tests
-   Add some CI/CD tools such as Husky
-   If needed, add an Auth system
-   Improve error handling system, including custom made exception classes
-   Improve the Swagger interface

## Requirement

-   Node.js

## Installation

```bash
$ npm install
```

## Running the app

The Server will start automatically on port 3000

```bash
$ npm start
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

# Example

# REST API

**The server public URL is 54.234.81.207:8222**

## Swagger - API visualization

```
GET /api
```

```
curl -i -X GET http://54.234.81.207:8222/api
```

## Register customer

```
POST /auth/register
```

```bash
#Body
{
    email: String,
    password: String,
    address: String
}
```

```bash
#Example
curl -s -X POST http://54.234.81.207:8222/auth/register -H 'Content-Type: application/json'  -d '{"email": "newuser@gmail.com", "password": "password", "address": "1021 W Adams St #100, Chicago, IL 60607"}'
```

```bash
#Response
{"message":"Successfully registered user","data":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhhNzM2OTRjLTM4MTAtNDI4Zi05YjIwLTNhYTNhMWZhNWY5MyIsInJ1bGUiOiJjdXN0b21lciIsImlhdCI6MTYzNzAyNTUwMCwiZXhwIjoxNjM3MDYxNTAwfQ.PelqnnBQBSiePwSUFvlcnMh-Gs6IsmmkdQPohNJ-WXk"}⏎
```

## Login user

```
POST /auth/login
```

```bash
#Body
{
    email: String,
    password: String
}
```

```bash
#Example
curl -s -X POST http://54.234.81.207:8222/auth/login -H 'Content-Type: application/json'  -d '{"email": "newuser@gmail.com", "password": "password"}'
```

```bash
#Response
{"message":"Successfully login user","data":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhhNzM2OTRjLTM4MTAtNDI4Zi05YjIwLTNhYTNhMWZhNWY5MyIsInJ1bGUiOiJjdXN0b21lciIsImlhdCI6MTYzNzAyNjI1MiwiZXhwIjoxNjM3MDYyMjUyfQ.TJu0FWHSpgIdCC67QK41hL4Ng8A3OC4nlT-ywBHd10s"}⏎
```

## Register admin

```
POST /auth/admin
```

```bash
#Body
{
    email: String,
    password: String,
    address: String
}
```

```bash
#Example
curl -s -X POST http://54.234.81.207:8222/auth/register/admin -H 'Content-Type: application/json'  -d '{"email": "newadmin@gmail.com", "password": "password", "address": "1021 W Adams St #100, Chicago, IL 60607"}'
```

```bash
#Response
{"message":"Successfully registered user","data":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjU0M2E5LWJhZDMtNDQ3Ny1iOTM3LWFhNWM2ZTdiODVjYyIsInJ1bGUiOiJhZG1pbiIsImlhdCI6MTYzNzAyNjM4MiwiZXhwIjoxNjM3MDYyMzgyfQ.qVD4vomWVJ2VbMs7o8L7uC5NgsrTB0RAX3cu9PfGPfE"}
```

## Create food items (admin route)

```
POST /food-item/type
```

```bash
#Example
curl -i -X GET http://localhost:3000/points
```

```bash
#Response
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-AX/xy3oiNSpIkUz3EfhBUERBA4Y"
Date: Sat, 06 Nov 2021 15:28:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Successfully returned points balance","data":{"DANNON":800}}⏎
```
