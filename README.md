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

## Create admin user

```bash
#CURL
curl -i -X POST http://54.234.81.207:8222/auth/register/admin -H 'Content-Type: application/json'  -d '{"email": "david@gmail.com", "password": "password", "address": "address"}'

#Response
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 259
ETag: W/"103-bycqRDxD8rb6y2/aCoypPt/tiC8"
Date: Mon, 15 Nov 2021 23:52:07 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Successfully registered user","data":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2ZDRjYzUyLTJhMDUtNGI3Zi04YTlmLWFhZjUxODQ3ZjI3NyIsInJ1bGUiOiJhZG1pbiIsImlhdCI6MTYzNzAyMDMyNywiZXhwIjoxNjM3MDU2MzI3fQ.qNohHKaQN8sdCtV0d9l_hrrwV7ZUM7bT6jkCWdb5sfU"}⏎
```

---

## Use admin token to add food items

```bash
#CURL
curl -i -X POST http://54.234.81.207:8222/auth/register/admin -H 'Content-Type: application/json'  -d '{"email": "david@gmail.com", "password": "password", "address": "address"}'

#Response
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 259
ETag: W/"103-bycqRDxD8rb6y2/aCoypPt/tiC8"
Date: Mon, 15 Nov 2021 23:52:07 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Successfully registered user","data":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2ZDRjYzUyLTJhMDUtNGI3Zi04YTlmLWFhZjUxODQ3ZjI3NyIsInJ1bGUiOiJhZG1pbiIsImlhdCI6MTYzNzAyMDMyNywiZXhwIjoxNjM3MDU2MzI3fQ.qNohHKaQN8sdCtV0d9l_hrrwV7ZUM7bT6jkCWdb5sfU"}⏎
```

# REST API

## Swagger - API visualization

```
GET /api
```

```
curl -i -X GET http://localhost:3000/api
```

## Create transaction

```
POST /transactions
```

```bash
#Body
{
    payer: String,
    points: Integer,
    timestamp: ISO8601 Date String
}
```

```bash
#Example
curl -i -X POST http://localhost:3000/transactions -H 'Content-Type: application/json'  -d '{"payer":"DANNON", "points":1000, "timestamp":"2020-11-02T14:00:00Z"}'
```

```bash
#Response
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 49
ETag: W/"31-ZbI033DSvx1cDteiJeLs9fLZtPI"
Date: Sat, 06 Nov 2021 15:04:28 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Successfully added new transactions"}⏎
```

## Spend points

```
POST /points/spend
```

```bash
#Body
{
    points: Positive Integer
}
```

```bash
#Example
curl -i -X POST http://localhost:3000/points/spend -H 'Content-Type: application/json'  -d '{"points":200}'
```

```bash
#Response
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-7Cv2wXSWw/pXI8cgRDVrNr+wZbI"
Date: Sat, 06 Nov 2021 15:23:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Successfully spent points","data":[{"payer":"DANNON","points":-200}]}⏎
```

## Get Points Balance

```
GET /points
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
