# Discount Voucher Management System

## Requirements

-   Node.js >= 20.7.x
-   Go >= 1.23.5
-   MySQL Database

## Clone Repository

```bash
git clone https://github.com/ardwiinoo/vdiscount
cd vdiscount
```

## Installation

### 1. Set up the API

Install dependencies:

```bash
cd ./discount-api
go mod tidy
```

### 2. Import the Database

Create a database named `discount_db`.

Import the provided `.sql` file into your MySQL database.

### 3. Set up the App

Install dependencies:

```bash
cd ./discount-app
npm install
```

## Running

### 1. Run the API

```bash
go run ./cmd/main.go
```

### 2. Run the App

```bash
npm run dev
# or
npm run build && npm start
```
