#!/bin/bash

# Get admin token
ADMIN_TOKEN=$(curl -s -X POST http://54.234.81.207:8222/auth/login -H 'Content-Type: application/json'  -d '{"email": "admin@gmail.com", "password": "admin"}' | jq -r '.data')

# Get customer token
CUSTOMER_TOKEN=$(curl -s -X POST http://54.234.81.207:8222/auth/login -H 'Content-Type: application/json'  -d '{"email": "david@gmail.com", "password": "customer"}' | jq -r '.data')

# # Add food types
# curl -s -X POST http://54.234.81.207:8222/food-item/type -H 'Content-Type: application/json'  -H "Authorization: Bearer ${ADMIN_TOKEN}" -d '{"foodItemsTypes": [{"type": "Appetizer"},{"type": "Entree"},{"type": "Pizza Topping"}]}'

# # Add food items
# curl -s -X POST http://54.234.81.207:8222/food-item -H 'Content-Type: application/json'  -H "Authorization: Bearer ${ADMIN_TOKEN}" -d '{"foodItems": [{"type": "Appetizer"},{"type": "Entree"},{"type": "Pizza Topping"}]}'

# Create order
ORDER_RESPONSE=$(curl -s -X POST http://54.234.81.207:8222/order -H 'Content-Type: application/json'  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" -d '{"foodItemsIds": ["e2a8fb68-86bc-48d5-a9af-8548aaf885e7", "55644f53-89a4-45f3-85d1-c40eb36a98c3", "1e769fd6-6a38-4e8d-90e7-e1985c991e50"]}')
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