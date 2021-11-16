#!/bin/bash

# Get admin token
ADMIN_TOKEN=$(curl -s -X POST http://54.234.81.207:8222/auth/login -H 'Content-Type: application/json'  -d '{"email": "newadmin@gmail.com", "password": "password"}' | jq -r '.data')

# Get customer token
CUSTOMER_TOKEN=$(curl -s -X POST http://54.234.81.207:8222/auth/login -H 'Content-Type: application/json'  -d '{"email": "newuser@gmail.com", "password": "password"}' | jq -r '.data')

# Create order
ORDER_RESPONSE=$(curl -s -X POST http://54.234.81.207:8222/order -H 'Content-Type: application/json'  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" -d '{"foodItemsIds": ["e6bec7c8-cd39-497c-99b2-7c405e50e8ac", "9e26852a-75db-467a-b24e-d175b0650cdc", "3704451a-754b-4d17-9cc1-e018a96c656c"]}')
echo "Order response:"
echo $ORDER_RESPONSE

# Get order status from response
ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.data.id')

# Check order status
ORDER_STATUS=$(curl -s -X GET http://54.234.81.207:8222/order/status/${ORDER_ID} -H 'Content-Type: application/json'  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" | jq -r '.data.status')
echo "Order status:"
echo $ORDER_STATUS

# Update order status by admin
UPDATE_STATUS_RESULT=$(curl -s -X PUT http://54.234.81.207:8222/order/status/${ORDER_ID} -H 'Content-Type: application/json'  -H "Authorization: Bearer ${ADMIN_TOKEN}" -d '{"status": "shipped"}')

# Check order status
UPDATED_ORDER_STATUS=$(curl -s -X GET http://54.234.81.207:8222/order/status/${ORDER_ID} -H 'Content-Type: application/json'  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" | jq -r '.data.status')
echo "Updated order status:"
echo $UPDATED_ORDER_STATUS