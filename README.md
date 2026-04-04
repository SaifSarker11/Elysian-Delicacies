# 🍕 Elysian Delicacies — Food Delivery Application

A **full-stack food delivery web application** built with Java, featuring both **SOAP** and **REST** APIs, **XML-based data persistence**, and a modern single-page application (SPA) frontend. This project demonstrates the integration of Object-Oriented design, web service technologies, and client-side rendering into a cohesive, working product.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start — Running the Application](#quick-start--running-the-application)
5. [Using the Application](#using-the-application)
6. [Demo Accounts](#demo-accounts)
7. [REST API Reference](#rest-api-reference)
8. [SOAP Web Services](#soap-web-services)
9. [Project Structure](#project-structure)
10. [Coupon Codes](#coupon-codes)
11. [Troubleshooting](#troubleshooting)

---

## Overview

**Elysian Delicacies** is a food delivery platform that allows:

- **Customers** to browse restaurants, view menus, add items to cart, place orders with coupon discounts, and track deliveries in real-time.
- **Restaurant Owners** to register restaurants, manage menus (add/edit/delete items), and process incoming orders (accept, prepare, hand off).

### Key Technologies

| Layer           | Technology                                                  |
| --------------- | ----------------------------------------------------------- |
| Language        | Java 22                                                     |
| Build Tool      | Apache Maven 3.9.x                                          |
| REST API        | `com.sun.net.httpserver.HttpServer` (built into the JDK)    |
| SOAP Services   | Jakarta XML Web Services (JAX-WS 4.0) + JAXB               |
| JSON Handling   | Google Gson 2.11                                            |
| Data Storage    | XML files (JAXB marshalling/unmarshalling)                  |
| Frontend        | Vanilla HTML / CSS / JavaScript (SPA with hash-based routing) |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     Frontend SPA (Browser)                       │
│        HTML + CSS + JavaScript  (hash-based router)             │
│   Pages: Home, Restaurants, Menu, Cart, Checkout, Tracking, …   │
└────────────────────────┬────────────────────────────────────────┘
                         │  HTTP (port 8080)
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Java Backend Server                         │
│                                                                  │
│  ┌─────────────────────┐      ┌──────────────────────────────┐  │
│  │   REST API Handlers  │      │   SOAP Web Services          │  │
│  │   (port 8080)        │      │   (port 8081)                │  │
│  │   /api/auth          │      │   /ws/restaurant-search      │  │
│  │   /api/restaurants   │      │   /ws/order-tracking         │  │
│  │   /api/menu          │      │   /ws/delivery-info          │  │
│  │   /api/orders        │      │   /ws/menu-query             │  │
│  │   /api/payments      │      └──────────────────────────────┘  │
│  │   /api/delivery      │                                        │
│  │   /api/coupons       │                                        │
│  └──────────┬──────────┘                                         │
│             │                                                    │
│  ┌──────────▼──────────┐      ┌──────────────────────────────┐  │
│  │   Service Layer      │      │   Utility Classes            │  │
│  │   (business logic)   │      │   JsonUtil, IdGenerator,     │  │
│  │                      │      │   DistanceCalculator         │  │
│  └──────────┬──────────┘      └──────────────────────────────┘  │
│             │                                                    │
│  ┌──────────▼──────────┐                                         │
│  │   XmlDataStore       │◄────── data/*.xml  (XML files)        │
│  │   (persistence)      │                                        │
│  └─────────────────────┘                                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before running this application, make sure you have the following installed on your machine:

### 1. Java Development Kit (JDK) 22 or later

The project is compiled with Java 22. You need a JDK (not just a JRE).

**Check if Java is installed:**

```bash
java -version
```

You should see output like `java version "22.x.x"` or `openjdk version "22.x.x"`.

**If not installed:**

- Download from [Oracle JDK 22](https://www.oracle.com/java/technologies/downloads/) or [Eclipse Adoptium](https://adoptium.net/).
- During installation, ensure the **"Add to PATH"** option is checked.
- Set the `JAVA_HOME` environment variable to your JDK installation directory (e.g., `C:\Program Files\Java\jdk-22`).

### 2. Apache Maven 3.9.x

Maven is the build tool used to compile and run the project. The project includes a **bundled Maven** installation under the `tools/` directory, but you can also use a system-wide installation.

**Check if Maven is installed:**

```bash
mvn -version
```

**If not installed (Option A — Use the bundled Maven):**

The project ships with Maven at `tools/apache-maven-3.9.8/`. Simply use its path directly (see the run instructions below).

**If not installed (Option B — Install globally):**

- Download from [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
- Unzip and add the `bin/` directory to your system `PATH`.

### 3. A Modern Web Browser

- Google Chrome, Mozilla Firefox, or Microsoft Edge (latest versions).

### 4. Free Ports

The application uses **two ports**. Make sure they are not occupied by other programs:

| Port   | Used By                   |
| ------ | ------------------------- |
| `8080` | REST API + Frontend (HTTP)|
| `8081` | SOAP Web Services         |

---

## Quick Start — Running the Application

### Step 1: Open a Terminal

Open **Command Prompt**, **PowerShell**, or **Windows Terminal** and navigate to the project root directory:

```powershell
cd "C:\Users\HP\OneDrive\Desktop\OOC II Assignment\Elysian-Delicacies"
```

> Replace the path above with the actual location of the project folder on your machine.

### Step 2: Build the Project

Use Maven to compile all source code and package the application.

**If you have Maven installed globally:**

```bash
mvn clean compile
```

**If you are using the bundled Maven:**

```powershell
.\tools\apache-maven-3.9.8\bin\mvn.cmd clean compile
```

Wait until you see `BUILD SUCCESS` in the output. This downloads all dependencies on the first run, which may take a few minutes.

### Step 3: Run the Application

**If you have Maven installed globally:**

```bash
mvn exec:exec
```

**If you are using the bundled Maven:**

```powershell
.\tools\apache-maven-3.9.8\bin\mvn.cmd exec:exec
```

You should see the following startup output in the console:

```
  ╔══════════════════════════════════════════╗
  ║     🍕 Food Delivery Application 🍕     ║
  ║           Version 1.0.0                  ║
  ╚══════════════════════════════════════════╝

  ==============================================
    SOAP Web Services published on port 8081
    WSDL URLs:
      http://localhost:8081/ws/restaurant-search?wsdl
      http://localhost:8081/ws/order-tracking?wsdl
      http://localhost:8081/ws/delivery-info?wsdl
      http://localhost:8081/ws/menu-query?wsdl
  ==============================================
  ==============================================
    HTTP API Server started on port 8080
    Frontend: http://localhost:8080
    REST API: http://localhost:8080/api/
  ==============================================

  ✅ Application started successfully!
  🌐 Open http://localhost:8080 in your browser
```

### Step 4: Open in Browser

Open your web browser and go to:

```
http://localhost:8080
```

You will see the **Elysian Delicacies** homepage.

### Step 5: Stopping the Server

Press **`Ctrl + C`** in the terminal where the application is running.

---

## Alternative: Build & Run as a Standalone JAR

If you want to build a single executable JAR (fat JAR) that bundles all dependencies:

```bash
mvn clean package
```

Then run it directly:

```bash
java -jar target/food-delivery-app-1.0.0.jar
```

---

## Using the Application

### 🏠 Home Page

When you first open `http://localhost:8080`, you land on the **Home** page. From here, you can:

- Browse featured restaurants.
- Search by cuisine type or area.
- Sign up or log in.

---

### 👤 Registration & Login

#### Register a New Account

1. Click the **Sign Up** button in the navigation bar.
2. Fill in your details:
   - **Name**, **Email**, **Password**, **Phone Number**
   - **Role**: Choose either `Customer` or `Restaurant Owner`
   - **Address**: Area, Street, City
3. Click **Register**.
4. You are automatically logged in after registration.

#### Login with an Existing Account

1. Click the **Log In** button in the navigation bar.
2. Enter your **Email** and **Password**.
3. Click **Login**.

---

### 🍽️ Browsing Restaurants (Customer)

1. After logging in as a **Customer**, click **Restaurants** in the navigation bar.
2. You will see a list of all available restaurants, each showing:
   - Name, cuisine type, rating, delivery fee, and estimated delivery time.
3. Click on a restaurant card to view its **menu**.

---

### 📋 Viewing a Menu & Adding Items to Cart

1. On a restaurant's menu page, items are grouped by category (Main Course, Appetizer, Dessert, Beverages, etc.).
2. Each item shows its name, description, price, and available add-ons.
3. Click **"Add to Cart"** on any item.
4. Adjust the **quantity** if needed.
5. A cart badge appears on the navigation bar showing the number of items.

> **Note:** All items in the cart must be from the **same restaurant**. If you add an item from a different restaurant, the cart will be cleared first.

---

### 🛒 Cart & Checkout

1. Click the **Cart** icon in the navigation bar.
2. Review your items, adjust quantities, or remove items.
3. Click **"Proceed to Checkout"**.
4. On the checkout page:
   - Review your order summary.
   - (Optional) Enter a **coupon code** and click **Apply** (see [Coupon Codes](#coupon-codes)).
   - Enter your **delivery address**.
   - Choose a **payment method** (Cash on Delivery, bKash, Nagad, or Card).
5. Click **"Place Order"**.
6. You will be redirected to the **Order Tracking** page.

---

### 📦 Order Tracking (Customer)

After placing an order, the tracking page shows:

- **Order Status**: `PLACED` → `CONFIRMED` → `PREPARING` → `READY` → `PICKED_UP` → `DELIVERED`
- **Order Details**: Items, quantities, prices, delivery fee, and discount.
- **Rider Information**: Once a rider is assigned, their name, phone, and vehicle type are displayed.

You can also view all of your past orders from the **Dashboard** page.

---

### 🏪 Restaurant Owner Dashboard

After logging in as a **Restaurant Owner**, you can:

1. **Register a New Restaurant**: Click **"Register Restaurant"** in the navigation bar, fill in the details (name, cuisine, address, delivery fee, hours), and submit.
2. **View Your Restaurants**: The **Owner Dashboard** shows all restaurants you own with their current status.
3. **Manage Menu**: Click on a restaurant to add, edit, toggle availability, or delete menu items.
4. **Process Orders**: Click **"View Orders"** on a restaurant to see incoming orders and update their status:
   - `PLACED` → Click **Confirm** to accept
   - `CONFIRMED` → Click **Preparing** when you start cooking
   - `PREPARING` → Click **Ready** when the food is done
   - `READY` → A delivery rider is assigned automatically
   - And so on through the delivery lifecycle.

---

## Demo Accounts

The application comes pre-loaded with seed data. You can use these accounts to explore the app immediately:

| Role              | Email             | Password   |
| ----------------- | ----------------- | ---------- |
| Customer          | ahmed@email.com   | `password123` |
| Customer          | sara@email.com    | `password123` |
| Restaurant Owner  | karim@email.com   | `password123` |
| Restaurant Owner  | fatima@email.com  | `password123` |
| Restaurant Owner  | rahim@email.com   | `password123` |

> **Password for all demo accounts is: `password123`**

### Pre-loaded Restaurants

| Restaurant         | Cuisine   | Owner             | Area      |
| ------------------ | --------- | ----------------- | --------- |
| Spice Garden       | Bengali   | Karim Ali         | Banani    |
| Pizza Paradise     | Italian   | Fatima Begum      | Uttara    |
| Dragon Wok         | Chinese   | Rahim Uddin       | Gulshan   |
| Burger Barn        | American  | Karim Ali         | Dhanmondi |
| Sushi Sensation    | Japanese  | Fatima Begum      | Gulshan   |

Each restaurant has a full menu with items, prices, and add-ons already configured.

---

## REST API Reference

The REST API is available at `http://localhost:8080/api/`. All requests and responses use **JSON**.

### Authentication

| Method | Endpoint             | Description         | Request Body                                      |
| ------ | -------------------- | ------------------- | ------------------------------------------------- |
| POST   | `/api/auth/register` | Register a new user | `{ "name", "email", "password", "phone", "role", "address": { "area", "street", "city", "latitude", "longitude" } }` |
| POST   | `/api/auth/login`    | Login               | `{ "email", "password" }`                         |
| GET    | `/api/auth/{userId}` | Get user by ID      | —                                                 |

### Restaurants

| Method | Endpoint                         | Description                 | Request Body / Params            |
| ------ | -------------------------------- | --------------------------- | -------------------------------- |
| GET    | `/api/restaurants`               | List all restaurants        | Query: `?area=`, `?cuisine=`     |
| GET    | `/api/restaurants/{id}`          | Get restaurant by ID        | —                                |
| POST   | `/api/restaurants`               | Create a new restaurant     | `{ "name", "ownerId", "cuisineType", "description", ... }` |
| PUT    | `/api/restaurants/{id}`          | Update restaurant details   | `{ ...fields to update }`       |
| PUT    | `/api/restaurants/{id}/status`   | Toggle open/closed status   | `{}`                             |

### Menu

| Method | Endpoint                         | Description                    | Request Body / Params            |
| ------ | -------------------------------- | ------------------------------ | -------------------------------- |
| GET    | `/api/menu?restaurantId={id}`    | Get all menu items for a restaurant | —                           |
| GET    | `/api/menu?search={keyword}`     | Search menu items by name      | —                                |
| POST   | `/api/menu`                      | Add a new menu item            | `{ "restaurantId", "name", "category", "price", "description", ... }` |
| PUT    | `/api/menu/{id}`                 | Update a menu item             | `{ ...fields to update }`       |
| PUT    | `/api/menu/{id}/availability`    | Toggle item availability       | `{}`                             |
| DELETE | `/api/menu/{id}`                 | Delete a menu item             | —                                |

### Orders

| Method | Endpoint                         | Description                    | Request Body / Params            |
| ------ | -------------------------------- | ------------------------------ | -------------------------------- |
| POST   | `/api/orders`                    | Place a new order              | `{ "customerId", "restaurantId", "items": [...], "deliveryAddress": {...}, ... }` |
| GET    | `/api/orders/{id}`               | Get order by ID                | —                                |
| GET    | `/api/orders?customerId={id}`    | Get all orders for a customer  | —                                |
| GET    | `/api/orders?restaurantId={id}`  | Get all orders for a restaurant| —                                |
| PUT    | `/api/orders/{id}/status`        | Update order status            | `{ "status": "CONFIRMED" }`     |
| PUT    | `/api/orders/{id}/rider`         | Assign a rider                 | `{ "riderId": "rider001" }`     |

### Payments

| Method | Endpoint             | Description              | Request Body                      |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/payments`      | Process a payment        | `{ "orderId", "amount", "method" }` |
| GET    | `/api/payments/{orderId}` | Get payment for an order | —                             |

### Delivery

| Method | Endpoint                         | Description                    | Params                           |
| ------ | -------------------------------- | ------------------------------ | -------------------------------- |
| GET    | `/api/delivery/riders`           | Get available riders           | `?area=Gulshan`                  |
| GET    | `/api/delivery/estimate`         | Get delivery time estimate     | `?restaurantId=rest001&lat=23.79&lon=90.40` |

### Coupons

| Method | Endpoint                | Description            | Request Body                      |
| ------ | ----------------------- | ---------------------- | --------------------------------- |
| GET    | `/api/coupons`          | List all active coupons| —                                 |
| POST   | `/api/coupons/validate` | Validate a coupon code | `{ "code": "WELCOME50", "orderAmount": 500 }` |

---

## SOAP Web Services

SOAP services are available at `http://localhost:8081/ws/`.  
Each service exposes a WSDL descriptor that clients (e.g., SoapUI, Postman) can consume.

| Service               | WSDL URL                                               | Operations                                         |
| ---------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| Restaurant Search      | `http://localhost:8081/ws/restaurant-search?wsdl`       | `searchByArea`, `searchByCuisine`, `getRestaurantDetails` |
| Order Tracking         | `http://localhost:8081/ws/order-tracking?wsdl`          | `trackOrder`, `getOrderHistory`, `getOrderDetails` |
| Delivery Info          | `http://localhost:8081/ws/delivery-info?wsdl`           | `getAvailableRiders`, `getDeliveryEstimate`, `getRiderInfo` |
| Menu Query             | `http://localhost:8081/ws/menu-query?wsdl`              | `getMenuByRestaurant`, `searchMenuItems`, `getMenuItemDetails` |

### Testing SOAP Services

You can test SOAP endpoints using tools like **SoapUI** or **Postman**:

1. Open SoapUI → **File → New SOAP Project**.
2. Enter the WSDL URL (e.g., `http://localhost:8081/ws/restaurant-search?wsdl`).
3. SoapUI will auto-generate request templates.
4. Fill in the parameters and click the green **play** button to send the request.

**Example SOAP Request** (searching restaurants by area):

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:soap="http://soap.fooddelivery.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <soap:searchByArea>
         <area>Gulshan</area>
      </soap:searchByArea>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## Project Structure

```
OOC II Assignment/
├── pom.xml                          # Maven project configuration
├── mvnw.cmd                         # Maven wrapper script (Windows)
├── README.md                        # This file
│
├── data/                            # XML data files (persistence layer)
│   ├── users.xml                    #   User accounts (customers & owners)
│   ├── restaurants.xml              #   Restaurant profiles
│   ├── menus.xml                    #   Menu items with add-ons
│   ├── orders.xml                   #   Placed orders
│   ├── payments.xml                 #   Payment records
│   ├── coupons.xml                  #   Discount coupons
│   └── riders.xml                   #   Delivery riders
│
├── src/
│   ├── main/java/com/fooddelivery/
│   │   ├── FoodDeliveryApp.java     # ★ Main entry point — starts both servers
│   │   │
│   │   ├── model/                   # Data model (POJOs with JAXB annotations)
│   │   │   ├── User.java
│   │   │   ├── Restaurant.java
│   │   │   ├── MenuItem.java
│   │   │   ├── MenuAddOn.java
│   │   │   ├── Order.java
│   │   │   ├── OrderItem.java
│   │   │   ├── Payment.java
│   │   │   ├── DeliveryRider.java
│   │   │   ├── Coupon.java
│   │   │   └── Address.java
│   │   │
│   │   ├── storage/                 # XML data persistence
│   │   │   └── XmlDataStore.java    #   Singleton; reads/writes all XML files
│   │   │
│   │   ├── service/                 # Business logic layer
│   │   │   ├── UserService.java
│   │   │   ├── RestaurantService.java
│   │   │   ├── MenuService.java
│   │   │   ├── OrderService.java
│   │   │   ├── PaymentService.java
│   │   │   ├── DeliveryService.java
│   │   │   └── CouponService.java
│   │   │
│   │   ├── rest/                    # REST API handlers
│   │   │   ├── BaseHandler.java     #   Abstract base with CORS, routing, JSON helpers
│   │   │   ├── UserHandler.java
│   │   │   ├── RestaurantHandler.java
│   │   │   ├── MenuHandler.java
│   │   │   ├── OrderHandler.java
│   │   │   ├── PaymentHandler.java
│   │   │   ├── DeliveryHandler.java
│   │   │   └── CouponHandler.java
│   │   │
│   │   ├── soap/                    # SOAP web service implementations
│   │   │   ├── RestaurantSearchServiceImpl.java
│   │   │   ├── OrderTrackingServiceImpl.java
│   │   │   ├── DeliveryInfoServiceImpl.java
│   │   │   └── MenuQueryServiceImpl.java
│   │   │
│   │   ├── server/                  # Server infrastructure
│   │   │   ├── HttpApiServer.java   #   Configures REST routes + static file serving
│   │   │   ├── SoapServicePublisher.java  # Publishes all SOAP endpoints
│   │   │   └── StaticFileHandler.java     # Serves frontend HTML/CSS/JS files
│   │   │
│   │   └── util/                    # Utility classes
│   │       ├── JsonUtil.java
│   │       ├── IdGenerator.java
│   │       └── DistanceCalculator.java
│   │
│   └── frontend/                    # Single-page application (SPA)
│       ├── index.html               #   Main HTML entry point
│       ├── css/
│       │   └── style.css            #   All application styles
│       └── js/
│           ├── api.js               #   API client, Cart, Session, & Toast utilities
│           ├── app.js               #   SPA router & initialization
│           ├── components/          #   Reusable UI components
│           │   ├── navbar.js
│           │   ├── restaurant-card.js
│           │   ├── menu-item-card.js
│           │   ├── order-card.js
│           │   └── modal.js
│           └── pages/               #   Page renderers
│               ├── home.js
│               ├── restaurant-list.js
│               ├── restaurant-menu.js
│               ├── cart.js
│               ├── checkout.js
│               ├── order-tracking.js
│               ├── customer-dashboard.js
│               ├── restaurant-dashboard.js
│               ├── restaurant-register.js
│               └── restaurant-orders.js
│
└── tools/                           # Bundled tools
    └── apache-maven-3.9.8/          #   Pre-packaged Maven installation
```

---

## Coupon Codes

Use these coupon codes during checkout to get discounts:

| Code        | Discount          | Min. Order | Max Discount | Valid Until  |
| ----------- | ----------------- | ---------- | ------------ | ------------ |
| `WELCOME50` | 50% off           | ৳100       | ৳200         | 2026-12-31   |
| `SAVE20`    | 20% off           | ৳500       | ৳150         | 2026-12-31   |
| `FREEDEL`   | Free delivery     | ৳300       | ৳60          | 2026-06-30   |
| `FEAST15`   | 15% off           | ৳200       | ৳100         | 2026-12-31   |

---

## Troubleshooting

### ❌ `java` is not recognized as a command

- **Cause:** Java is not installed or not added to your system `PATH`.
- **Fix:** Install JDK 22+ and add its `bin/` directory to your system `PATH`. Restart your terminal after making changes.

### ❌ `mvn` is not recognized as a command

- **Cause:** Maven is not installed globally.
- **Fix:** Either install Maven globally, or use the bundled version:
  ```powershell
  .\tools\apache-maven-3.9.8\bin\mvn.cmd clean compile
  .\tools\apache-maven-3.9.8\bin\mvn.cmd exec:java
  ```

### ❌ `Address already in use` error on startup

- **Cause:** Port `8080` (REST API) or `8081` (SOAP) is already occupied — usually by a previous run of this app that wasn't stopped cleanly.
- **Fix (PowerShell — run as Administrator if needed):**

  **Step 1 — Find what's using each port:**
  ```powershell
  netstat -ano | findstr ":8080"
  netstat -ano | findstr ":8081"
  ```
  Note the **PID** (last column) for any `LISTENING` entry.

  **Step 2 — Kill the process by PID:**
  ```powershell
  taskkill /PID <PID> /F
  ```
  Replace `<PID>` with the actual number from Step 1. Repeat for each conflicting PID.

  **One-liner to kill everything on port 8080 and 8081 at once:**
  ```powershell
  @(8080, 8081) | ForEach-Object { $port = $_; netstat -ano | Select-String ":$port " | ForEach-Object { ($_ -split '\s+')[-1] } | Where-Object { $_ -match '\d+' } | Select-Object -Unique | ForEach-Object { taskkill /PID $_ /F } }
  ```

  **⚡ One-liner to clear ports AND launch the app immediately (recommended):**
  Make sure you are inside the `Elysian-Delicacies` directory before running this command:
  ```powershell
  @(8080, 8081) | ForEach-Object { $port = $_; netstat -ano | Select-String ":$port " | ForEach-Object { ($_ -split '\s+')[-1] } | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique | ForEach-Object { taskkill /PID $_ /F } }; .\tools\apache-maven-3.9.8\bin\mvn.cmd exec:exec
  ```
  > If no process is using those ports, the kill step is silently skipped and the app starts normally. Safe to run every time.

  **Step 3 — Re-run the application:**
  ```powershell
  .\tools\apache-maven-3.9.8\bin\mvn.cmd exec:exec
  ```

### ❌ `BUILD FAILURE` during `mvn clean compile`

- **Cause:** Dependencies could not be downloaded (network issue) or wrong Java version.
- **Fix:**
  - Check your internet connection (Maven needs to download dependencies the first time).
  - Verify Java version is 22+: `java -version`.
  - Clear Maven cache and retry: `mvn clean compile -U`.

### ❌ Frontend shows blank page or "Server is not reachable"

- **Cause:** The backend server is not running.
- **Fix:** Make sure you ran `mvn exec:java` and saw the `✅ Application started successfully!` message. Keep that terminal window open.

### ❌ Login fails with demo credentials

- **Cause:** The password hash in the seed data corresponds to `password123`.
- **Fix:** Use `password123` as the password for all demo accounts listed above.

---

## License

This project was built as an academic assignment for **OOC II** coursework.

## Credits

1. Claude's Opus 4.6
2. Claude's Sonnect 4.6
3. Gemini 3.1 Pro
I was a vibe coder in this project as I'm a newbie to JS
