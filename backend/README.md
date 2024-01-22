# 🌟 Let's Play CRUD API 🌟

## 📝 Table of Contents

1. [Overview](#-overview)
2. [Technologies Used](#-technologies-used)
3. [Installation Steps](#-installation-steps)
   1. [Install MongoDB](#install-mongodb)
   2. [Start MongoDB Server](#start-mongodb-server)
   3. [Build and Run Project](#build-and-run-project)
4. [Usage](#-usage)
5. [Contributors](#-contributors)
6. [Endpoints](#endpoints)
   1. [Auth](#auth)
      1. [Get JWT from user](#end-point-get-jwt-from-user)
      2. [Get JWT from admin](#end-point-get-jwt-from-admin)
   2. [Products](#products)
      1. [View all products](#end-point-view-all-products)
      2. [Get User 1 product](#end-point-get-user-1-product)
      3. [Create Antons product](#end-point-create-Antons-product)
      4. [Modify Antons product](#end-point-modify-Antons-product)
      5. [Delete Antons product](#end-point-delete-Antons-product)
   3. [Users](#users)
      1. [View all users](#end-point-view-all-users)
      2. [Get Anton](#end-point-get-Anton)
      3. [Create Anton](#end-point-create-Anton)
      4. [Modify Anton](#end-point-modify-Anton)
      5. [Delete Anton](#end-point-delete-Anton)

## 📌 Overview

The **Let's Play CRUD API** is a Spring Boot application that demonstrates the basic CRUD (Create, Read, Update, Delete) operations using MongoDB as the database. Designed and developed by Anton during their tenure at Grit:lab, dated 2023-09-26, this project aims to serve as an efficient template for CRUD-based APIs.

## 🛠 Technologies Used

- **Programming Language** : Java
- **Framework** : Spring Boot
- **Database** : MongoDB

## 📥 Installation Steps

### Install MongoDB

1. Please make sure to download and install MongoDB following your system's guidelines.

### Start MongoDB Server

Run the following command to start your MongoDB server.

```bash

mongod
```

### Build and Run Project

1. Clone the repository to your local machine.
2. Navigate to the project directory and run the following Maven command to build the project.

```bash

mvn clean install
```

1. Start the Spring Boot application using the following command.

```bash

mvn spring-boot:run
```

## 🔧 Usage

To interact with the API, you may utilize either Postman or curl to send API requests. Ensure that the application is running, and direct your API calls accordingly.

# Endpoints

# Auth

These endpoints are used to POST user credentials to the server and get back a JWT.

## End-point: Get JWT from user

This is a user with the "ROLE_CLIENT" which is created by the DatabaseSeeder.

### Method: POST

> ```
> https://localhost:8080/api/auth
> ```

### Body (**raw**)

```json
{
  "username": "user",
  "password": "password"
}
```

### Response: 200

```json
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNjk1NTgyNDcwLCJleHAiOjE2OTU1ODQyNzB9.9D54B0tbaNrVVjKZkSxbNbbgKpKqiQxDdZHD0j_rWl0
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get JWT from admin

This is a user with the "ROLE_SELLER" which is created by the DatabaseSeeder.

### Method: POST

> ```
> https://localhost:8080/api/auth
> ```

### Body (**raw**)

```json
{
  "username": "admin",
  "password": "password"
}
```

### Response: 200

```json
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY5NTczOTkwMiwiZXhwIjoxNjk1NzQxNzAyfQ.grlFECmuNmRnGHl8P_5tezpsMPU68Qy8M9hHf0LN1n4
```

# Products

These endpoints are used for CRUD operations in the product collection.

# 📁 Collection: Public

## End-point: View all products

Get all the products in the database.

### Method: GET

> ```
> https://localhost:8080/api/products
> ```

### Body (**raw**)

```json

```

### 🔑 Authentication noauth

| Param | value | Type |
| ----- | ----- | ---- |

### Response: 200

```json
[
  {
    "id": "1",
    "name": "Product 1",
    "description": "This is product 1",
    "price": 100,
    "userid": "1",
    "productid": "1"
  },
  {
    "id": "2",
    "name": "Product 2",
    "description": "This is product 2",
    "price": 200,
    "userid": "2",
    "productid": "2"
  },
  {
    "id": "Antonsproduct",
    "name": "Antons new product",
    "description": "This is a great product from Anton",
    "price": 8934,
    "userid": "Anton",
    "productid": "Antonsproduct"
  }
]
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get User 1 product

Get a specific product from the database, in this case it is "Antonsproduct" which is not created by the DatabaseSeeder thus needing creation in order to not get a 404 Response.

### Method: GET

> ```
> https://localhost:8080/api/products/Antonsproduct
> ```

### Body (**raw**)

```json

```

### Response: 200

```json
{
  "id": "1",
  "name": "Product 1",
  "description": "This is product 1",
  "price": 100,
  "productid": "1",
  "userid": "1"
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: User access

## End-point: Create Antons product

Create a product with this endpoint, it is filled with Antons product for demonstrative purposes.

### Method: POST

> ```
> https://localhost:8080/api/products
> ```

### Body (**raw**)

```json
{
  "id": "Anton",
  "name": "nice",
  "description": "This is a great product from Anton",
  "price": "8934",
  "userid": "Anton"
}
```

### 🔑 Authentication bearer

| Param | value | Type   |
| ----- | ----- | ------ |
| token |       | string |

### Response: 409

```json
User not found!
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Admin access only

## End-point: Modify Antons product

Endpoint for modifying a product, it is filled with Antons new product for demonstrative purposes, use this after creating Antons product, else it returns a 404.

### Method: PUT

> ```
> https://localhost:8080/api/products/PRODUCTS_ID
> ```

### Body (**raw**)

```json
{
   "id": "Antonsproduct",
   "name": "Antons new product",
   "description": "This is a new great product from Anton",
   "price": "8934",
   "userId": "Anton"
}
```

### 🔑 Authentication bearer

| Param | value                    |
| ----- |--------------------------|
| Authorization | Bearer YOUR_BEARER_TOKEN |

### Response: 404

```json
Product with 6512e78d80b2e5543c11d7b2 not found!
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete Antons product

Endpoint for deleting a product with a certain ID, right now targeting Antonsproduct, remember to create the product before, else returns 404.

### Method: DELETE

> ```
> https://localhost:8080/api/products/PRODUCTS_ID
> ```

### Body (**raw**)

```json

```

### 🔑 Authentication bearer

| Param | value                    |
| ----- |--------------------------|
| Authorization | Bearer YOUR_BEARER_TOKEN |

### Response: 404

```json
Product with Anton not found!
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# Users

These endpoints are used for CRUD operations in the Users collection.

# 📁 Collection: User access

## End-point: View all users

Endpoint to view all users, will return a stripped down model of the Users with only ID, name and role.

### Method: GET

> ```
> https://localhost:8080/api/users
> ```

### Body (**raw**)

```json

```

### 🔑 Authentication bearer

| Param | value                    |
| ----- |--------------------------|
| Authorization | Bearer YOUR_BEARER_TOKEN |

### Response: 200

```json
[
  {
    "id": "1",
    "name": "user",
    "role": "ROLE_CLIENT"
  },
  {
    "id": "2",
    "name": "admin",
    "role": "ROLE_SELLER"
  }
]
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Anton

Endpoint to view a specific user using ID, in this case Anton, will return a stripped down model of the User with only ID, name and role. If a user is not created, it will return 404.

### Method: GET

> ```
> https://localhost:8080/api/users/Anton
> ```

### 🔑 Authentication bearer

| Param | value                    |
| ----- |--------------------------|
| Authorization | Bearer YOUR_BEARER_TOKEN |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Admin access only

## End-point: Create Anton

Endpoint to create a user, in this case, it is filled with Anton for demonstrative purposes.

### Method: POST

> ```
> https://localhost:8080/api/users
> ```

### Body (**raw**)

```json
{
  "id": "Anton",
  "name": "Anton",
  "email": "Anton@hotmale.com",
  "password": "Antonrocks",
  "role": "ROLE_SELLER"
}
```

### 🔑 Authentication bearer

| Param | value                    |
| ----- |--------------------------|
| Authorization | Bearer YOUR_BEARER_TOKEN |

### Response: 401

```json
null
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Modify Anton

Endpoint to modify a specific user using ID, in this case, it is modifying Anton for demonstrative purposes.

### Method: PUT

> ```
> https://localhost:8080/api/users/Anton
> ```

### Body (**raw**)

```json
{
   "name": "NotAnton2",
   "email": "notemail@example.com",
   "password": "notyourpassword",
   "role": "ROLE_SELLER"
}
```

### Response: 401

```json
null
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete Anton

Endpoint to delete a specific user using ID, in this case Anton is deleted for demonstrative purposes.

### Method: DELETE

> ```
> https://localhost:8080/api/users/Anton
> ```

### Body (**raw**)

```json

```

### 🔑 Authentication bearer

| Param | value                    |
| ----- |--------------------------|
| Authorization | Bearer YOUR_BEARER_TOKEN |

### Response: 401

```json
null
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
