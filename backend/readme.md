# API Documentation

### Overview

This API provides endpoints for user registration, user profile management, user status retrieval, and user listing. It is built using Django REST Framework and includes various permissions to control access.

## Setup
 1.Clone the repository:
git clone https://github.com/jalis55/FAST-Investment-Back-Office-Software.

2.cd backend


## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install dependencies.

```bash
pip install -r requirements.txt

```
### Apply Migration
```bash
python manage.py migrate

```
### Run Server
```bash
python manage.py runserver

```
## Authentication
This API uses token-based authentication. A valid token must be included in the Authorization header of requests requiring authentication.

### Obtaining a Token
+ Endpoint: /api/token/
+ Method:  GET
#### Request body:
``` json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Response:
  + **200 OK**: Returns the access token and refresh token.
  + Response Body:

``` json
{ 
  "access": "your-access-token",
  "refresh": "your-refresh-token"
}
```
## Using the Token
Include the token in the Authorization header for authenticated requests:
```bash
Authorization: Bearer your-access-token
```

## Api Endpoints
#### User Management
### 1. User Registration
+ Endpoint: /api/user-register/
+ Method: POST
+ Permissions: AllowAny
#### Request body:
``` json
{
  "email": "user@example.com",
  "name": "User  Name",
  "phone": "1234567890",
  "profile_image": "url_to_image",
  "sex": "M/F",
  "bio": "User  bio",
  "dob": "YYYY-MM-DD",
  "password": "yourpassword"
}
```
### 2.User Profile
+ Endpoint: /api/user-profile/
+ Method:  GET, PUT
+ Permissions: IsAuthenticated
#### Request body (for PUT):
``` json
{
  "name": "Updated Name",
  "phone": "0987654321",
  "profile_image": "new_url_to_image",
  "sex": "M/F",
  "bio": "Updated bio",
  "dob": "YYYY-MM-DD",
  "password": "newpassword"  // Optional
}
```

### 3.User Status
+ Endpoint: /api/user-status/
+ Method:  GET
+ Permissions: IsAuthenticated
#### Response:
  + **200 OK**: Returns the status of the authenticated user.
  + Response Body:

``` json
{
  "status": "user/admin/superadmin"
}
```
### 4.User List
+ Endpoint: /api/admin/users/
+ Method:  GET
+ Permissions: IsSuperUser
#### Response:
  + **200 OK**: Returns the status of the authenticated user.
  + Response Body:

``` json
{
  [
  {
    "id": 1,
    "name": "User  Name",
    "email": "user@example.com",
    "is_staff": false,
    "is_active": true
  },
  ...
]
}
```
### 5.Customer List
+ Endpoint: /api/admin/customers/
+ Method:  GET
+ Permissions: IsAdminUser 
#### Response:
  + **200 OK**: Returns the status of the authenticated user.
  + Response Body:

``` json
[
  {
    "id": 2,
    "name": "Customer Name",
    "email": "customer@example.com",
    "is_staff": false,
    "is_active": true
  },
  ...
]
```
### 5.Update User Status
+ Endpoint: /api/admin/users/id/
+ Method:  GET, PUT, DELETE
+ Permissions: IsSuperUser 
#### Responses:
  + **GET**: Returns user details for the specified user ID.
  + **PUT**: Updates user details for the specified user ID.
  + Response Body:

``` json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "is_staff": true,
  "is_active": true
}
```
 + **DELETE**: Deletes the specified user.
 + Response Body (for GET):
```json
{
  "id": 1,
  "name": "User  Name",
  "email": "user@example.com",
  "is_staff": false,
  "is_active": true
}
```

## Error Handling
+ 400 Bad Request: Validation errors or missing fields.
+ 401 Unauthorized: Authentication required.

