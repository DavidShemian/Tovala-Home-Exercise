## Description

Tovala Home Task implementation by David Shemian. </br>
I decided to create a food ordering service instead of only pizza ordering. </br>
The system provided the ability for an admin (a user with admin privileges) to create food types (Entree, Appetizer, Pizza toping, etc) </br>
and food items based on those food types (Pizza, Wings, Salad, etc). </br>
A client (user with client privileges) can view available food items and their price, </br>
create an order based on those food items, and check his order status. </br>
An admin can also change the order status. </br>
I created this service with the mindset that a Front End application will use it. </br>
I used NestJS, which, in my opinion is a great server-side Node.js Typescript framework, that has some great tools for production usage.</br>
My project is modeled by the Layer system, i.e. there are controllers to handel the incoming requests, services to handel the business logic, and DAL (Data Access Layer) which handles the DB access.</br>
The service uses PostgresSQL as its database.</br>
**Both the service and DB are deployed and running on AWS using EC2 and RDS** </br>
Some of of the features this service includes are: </br>

-   Good coverage of e2e tests, using a separate DB
-   Authentication using JWT
-   Admin protected routes
-   Routes input validation
-   DB constraints to prevent unwanted results
-   Dependency injection
-   Requests logs interceptor
-   Configuration service
-   Custom made error handling
-   Strictly defined eslint, tsconfig, and prettier
-   Swagger for api visualization

This is not production-ready product, but I did try to make it an easy shift to production, if needed.</br>
In case this project was to go to production, here are some of the things I would consider doing are:

-   Add some more unit tests to the already existing e2e tests
-   Add some CI/CD tools
-   Improve JWT authentication
-   Improve the Swagger interface
-   Add currency options
-   Add email validation and password matching pattern mechanism
-   Add forgot my password option
-   Add filter options to routes, such as only getting a specific type of food items

## Requirement

The service is already up and running on AWS </br>
See API description and examples below. </br>
In order to run the service locally, the requirements are:

-   Node.js
-   Postgresql

</br> To allow fot getting started quickly, please add provided .env file (sent over by email), that has all required configuration, to the root of project
</br> The env file has the credentials for the Postgres DB that is hosted on AWS.
</br> All required env configs can be found in the config.ts file
</br> The application will not start without all required configs provided.

## Installation

```bash
$ npm install
```

## Running the app

The Server will start automatically on port 8222 (listed on the .env file)

```bash
$ npm start
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

# Example

I pushed a bash script with the application (example.sh) that includes a basic usage example of the application. </br>
Please note that: </br>

-   The script uses jq to parse the JSON responses
-   The script rely on data that I already inserted to the DB. I did that so the script can run multiple times without interruptions. If the script were, for example, to create a user, on the second run the script will fail because a user with the same email already exist.
    </br>

Please see full API description and examples below

# API Description and examples

**The server public URL is 54.234.81.207:8222**
</br>
**By the variables stated on the provided .env file, the JWT token is valid for 30 days**

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
#Example
curl -s -X POST http://54.234.81.207:8222/auth/register -H 'Content-Type: application/json'  -d '{"email": "newuser@gmail.com", "password": "password", "address": "1021 W Adams St #100, Chicago, IL 60607"}'
```

```bash
#Response
{"message":"Successfully registered user","data":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1MzQ0MzIzLTM1NmUtNDM5Ni05MzVlLWMyYzhjMmEyNGFlYiIsInJ1bGUiOiJjdXN0b21lciIsImlhdCI6MTYzNzAzNTM3MSwiZXhwIjoxNjM5NjI3MzcxfQ.dEJW7O9YDaoKlWvh0uI10FKnR2tUxAP-xkCPan1BEsc"}⏎
```

## Login user

```
POST /auth/login
```

```bash
#Example
curl -s -X POST http://54.234.81.207:8222/auth/login -H 'Content-Type: application/json'  -d '{"email": "newuser@gmail.com", "password": "password"}'
```

```bash
#Response
{"message":"Successfully login user","data":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1MzQ0MzIzLTM1NmUtNDM5Ni05MzVlLWMyYzhjMmEyNGFlYiIsInJ1bGUiOiJjdXN0b21lciIsImlhdCI6MTYzNzAzNTQ3NSwiZXhwIjoxNjM5NjI3NDc1fQ.G69ScK7EyxVCVawBk5H4h-JBawqPSSq1OOEgEBd8Zfw"}⏎
```

## Register admin - only added project testing purposes

```
POST /auth/admin
```

```bash
#Example
curl -s -X POST http://54.234.81.207:8222/auth/register/admin -H 'Content-Type: application/json'  -d '{"email": "newadmin@gmail.com", "password": "password", "address": "1021 W Adams St #100, Chicago, IL 60607"}'
```

```bash
#Response
{"message":"Successfully registered user","data":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5ZDFlN2Y4LTUyMDMtNGViZi04OTcyLWQ4MThhMDYzYTkyMiIsInJ1bGUiOiJhZG1pbiIsImlhdCI6MTYzNzAzNTY0NiwiZXhwIjoxNjM5NjI3NjQ2fQ.dq3HSIeRBniinghNEDI_n_nRE4fp5qM2Hbnd1lK6-ic"}
```

## Create food item types (admin route)

```
POST /food-item/type
```

```bash
#Example - using admin token
curl -s -X POST http://54.234.81.207:8222/food-item/type -H 'Content-Type: application/json'  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5ZDFlN2Y4LTUyMDMtNGViZi04OTcyLWQ4MThhMDYzYTkyMiIsInJ1bGUiOiJhZG1pbiIsImlhdCI6MTYzNzAzNTY0NiwiZXhwIjoxNjM5NjI3NjQ2fQ.dq3HSIeRBniinghNEDI_n_nRE4fp5qM2Hbnd1lK6-ic" -d '{"foodItemsTypes": [{"type": "Appetizer"},{"type": "Entree"},{"type": "Pizza Topping"}]}'
```

```bash
#Response
{
    "message": "Successfully added foodItems to db"
}⏎
```

## Get all food item types (admin route)

```
GET /food-item/type
```

```bash
#Example - using admin token
curl -s -X GET http://54.234.81.207:8222/food-item/type -H 'Content-Type: application/json'  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5ZDFlN2Y4LTUyMDMtNGViZi04OTcyLWQ4MThhMDYzYTkyMiIsInJ1bGUiOiJhZG1pbiIsImlhdCI6MTYzNzAzNTY0NiwiZXhwIjoxNjM5NjI3NjQ2fQ.dq3HSIeRBniinghNEDI_n_nRE4fp5qM2Hbnd1lK6-ic"
```

```bash
#Response
{
    "message": "Successfully got all food item types",
    "data": [
        {
            "createDateTime": "2021-11-16T04:08:03.769Z",
            "id": "191cc308-6962-4972-8643-5fd00088de4b",
            "lastChangedDateTime": "2021-11-16T04:08:03.769Z",
            "type": "Appetizer"
        },
        {
            "createDateTime": "2021-11-16T04:08:03.769Z",
            "id": "5595d795-031f-47e6-8ce4-b8b1784914fe",
            "lastChangedDateTime": "2021-11-16T04:08:03.769Z",
            "type": "Entree"
        },
        {
            "createDateTime": "2021-11-16T04:08:03.769Z",
            "id": "a2ad9259-a5fe-40fe-aa4d-2ef9ce510f5f",
            "lastChangedDateTime": "2021-11-16T04:08:03.769Z",
            "type": "Pizza Topping"
        }
    ]
}
```

## Create food items (admin route)

```
POST /food-item
```

```bash
#Example - using admin token
curl -s -X POST http://54.234.81.207:8222/food-item -H 'Content-Type: application/json'  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5ZDFlN2Y4LTUyMDMtNGViZi04OTcyLWQ4MThhMDYzYTkyMiIsInJ1bGUiOiJhZG1pbiIsImlhdCI6MTYzNzAzNTY0NiwiZXhwIjoxNjM5NjI3NjQ2fQ.dq3HSIeRBniinghNEDI_n_nRE4fp5qM2Hbnd1lK6-ic" -d '{
    "foodItems": [
        {
                    "name": "Pizza - L",
                    "price": 12,
                    "foodItemTypeEntity": {"id": "5595d795-031f-47e6-8ce4-b8b1784914fe"}
        },
        {
                    "name": "Pepperoni",
                    "price": 1.5,
                    "foodItemTypeEntity": {"id": "a2ad9259-a5fe-40fe-aa4d-2ef9ce510f5f"}
        },
        {
                    "name": "Buffalo Wings",
                    "price": 3,
                    "foodItemTypeEntity": {"id": "191cc308-6962-4972-8643-5fd00088de4b"}
        }
    ]
}'
```

```bash
#Response
{
    "message": "Successfully added foodItemsTypes to db"
}⏎
```

## Get all food items

```
GET /food-item
```

```bash
#Example - using customer token
curl -s -X GET http://54.234.81.207:8222/food-item -H 'Content-Type: application/json'  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1MzQ0MzIzLTM1NmUtNDM5Ni05MzVlLWMyYzhjMmEyNGFlYiIsInJ1bGUiOiJjdXN0b21lciIsImlhdCI6MTYzNzAzNTQ3NSwiZXhwIjoxNjM5NjI3NDc1fQ.G69ScK7EyxVCVawBk5H4h-JBawqPSSq1OOEgEBd8Zfw"
```

```bash
#Response
{
    "message": "Successfully got all food items",
    "data": [
        {
            "createDateTime": "2021-11-16T04:09:29.176Z",
            "id": "3704451a-754b-4d17-9cc1-e018a96c656c",
            "lastChangedDateTime": "2021-11-16T04:09:29.176Z",
            "inStock": true,
            "name": "Buffalo Wings",
            "price": 3,
            "foodItemTypeEntity": {
                "createDateTime": "2021-11-16T04:08:03.769Z",
                "id": "191cc308-6962-4972-8643-5fd00088de4b",
                "lastChangedDateTime": "2021-11-16T04:08:03.769Z",
                "type": "Appetizer"
            }
        },
        {
            "createDateTime": "2021-11-16T04:09:29.176Z",
            "id": "e6bec7c8-cd39-497c-99b2-7c405e50e8ac",
            "lastChangedDateTime": "2021-11-16T04:09:29.176Z",
            "inStock": true,
            "name": "Pizza - L",
            "price": 12,
            "foodItemTypeEntity": {
                "createDateTime": "2021-11-16T04:08:03.769Z",
                "id": "5595d795-031f-47e6-8ce4-b8b1784914fe",
                "lastChangedDateTime": "2021-11-16T04:08:03.769Z",
                "type": "Entree"
            }
        },
        {
            "createDateTime": "2021-11-16T04:09:29.176Z",
            "id": "9e26852a-75db-467a-b24e-d175b0650cdc",
            "lastChangedDateTime": "2021-11-16T04:09:29.176Z",
            "inStock": true,
            "name": "Pepperoni",
            "price": 1.5,
            "foodItemTypeEntity": {
                "createDateTime": "2021-11-16T04:08:03.769Z",
                "id": "a2ad9259-a5fe-40fe-aa4d-2ef9ce510f5f",
                "lastChangedDateTime": "2021-11-16T04:08:03.769Z",
                "type": "Pizza Topping"
            }
        }
    ]
}
```

## Create order

```
POST /order
```

```bash
#Example - using customer token
curl -s -X POST http://54.234.81.207:8222/order -H 'Content-Type: application/json'  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1MzQ0MzIzLTM1NmUtNDM5Ni05MzVlLWMyYzhjMmEyNGFlYiIsInJ1bGUiOiJjdXN0b21lciIsImlhdCI6MTYzNzAzNTQ3NSwiZXhwIjoxNjM5NjI3NDc1fQ.G69ScK7EyxVCVawBk5H4h-JBawqPSSq1OOEgEBd8Zfw" -d '{"foodItemsIds": ["3704451a-754b-4d17-9cc1-e018a96c656c", "e6bec7c8-cd39-497c-99b2-7c405e50e8ac", "9e26852a-75db-467a-b24e-d175b0650cdc"]}'
```

```bash
#Response
{
    "message": "Successfully submitted new order",
    "data": {
        "foodItems": [
            {
                "inStock": true,
                "name": "Pizza - L",
                "price": 12
            },
            {
                "inStock": true,
                "name": "Pepperoni",
                "price": 1.5
            },
            {
                "inStock": true,
                "name": "Buffalo Wings",
                "price": 3
            }
        ],
        "price": 16.5,
        "status": "preparing",
        "user": {
            "id": "f5344323-356e-4396-935e-c2c8c2a24aeb"
        },
        "createDateTime": "2021-11-16T04:10:49.908Z",
        "id": "9715e03e-c7f1-4631-90dc-c0d8e615ab14",
        "lastChangedDateTime": "2021-11-16T04:10:49.908Z"
    }
}⏎
```

## Get order status

```
GET /order/status
```

```bash
#Example - using customer token and order id
curl -s -X GET http://54.234.81.207:8222/order/status/9715e03e-c7f1-4631-90dc-c0d8e615ab14 -H 'Content-Type: application/json'  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1MzQ0MzIzLTM1NmUtNDM5Ni05MzVlLWMyYzhjMmEyNGFlYiIsInJ1bGUiOiJjdXN0b21lciIsImlhdCI6MTYzNzAzNTQ3NSwiZXhwIjoxNjM5NjI3NDc1fQ.G69ScK7EyxVCVawBk5H4h-JBawqPSSq1OOEgEBd8Zfw"
```

```bash
#Response
{
    "message": "Successfully got order status",
    "data": {
        "status": "preparing"
    }
}⏎
```

## Update order status (admin route)

```
PUT /order/status
```

```bash
#Example - using admin token and order id
curl -s -X PUT http://54.234.81.207:8222/order/status/9715e03e-c7f1-4631-90dc-c0d8e615ab14 -H 'Content-Type: application/json'  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5ZDFlN2Y4LTUyMDMtNGViZi04OTcyLWQ4MThhMDYzYTkyMiIsInJ1bGUiOiJhZG1pbiIsImlhdCI6MTYzNzAzNTY0NiwiZXhwIjoxNjM5NjI3NjQ2fQ.dq3HSIeRBniinghNEDI_n_nRE4fp5qM2Hbnd1lK6-ic" -d '{"status": "shipped"}'
```

```bash
#Response
{
    "message": "Successfully update order status",
    "data": {
        "id": "9715e03e-c7f1-4631-90dc-c0d8e615ab14",
        "status": "shipped",
        "lastChangedDateTime": "2021-11-16T04:12:01.335Z"
    }
}⏎
```
