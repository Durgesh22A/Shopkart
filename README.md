# ShopKart

ShopKart is a full-stack e-commerce web application developed as part of Engineering Labs 1–6. It lets users register and log in, explore products, manage a wishlist and cart, place orders, and complete test payments through Razorpay.

## Features

- User registration, login, logout, profile access, JWT authentication, and secure cookies
- Product catalog with product details and stock information
- Wishlist: add, view, and remove favourite products
- Shopping cart: add products, update quantity, remove items, and calculate totals
- Checkout flow with shipping information and order history
- Razorpay test-mode payment order creation and signature verification
- Responsive React interface with protected routes
- Deployment-ready configuration for Vercel (frontend), Render (backend), and MongoDB Atlas

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas with Mongoose
- **Authentication:** JWT, bcrypt, cookie-parser
- **Payments:** Razorpay Test Mode
- **Deployment:** Vercel and Render

## Project Structure

```text
Shopkart/
├── Client/                 # React + Vite frontend
│   ├── src/pages/          # Login, products, wishlist, cart, checkout, orders
│   ├── src/components/     # Shared UI components
│   └── src/context/        # Cart state management
├── server/                 # Express API
│   ├── controllers/        # Authentication, catalog, wishlist, cart, orders
│   ├── models/             # Customer, Product, Order schemas
│   ├── routes/             # API routes
│   └── middlewares/        # JWT authentication middleware
└── README.md
```

## Run Locally

### 1. Clone and install dependencies

```bash
git clone https://github.com/Durgesh22A/Shopkart.git
cd Shopkart

cd server
npm install

cd ../Client
npm install
```

### 2. Configure environment variables

Create `server/.env.local` using `server/.env.example` as a reference:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Create `Client/.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

Never commit real passwords, MongoDB URIs, JWT secrets, or Razorpay secret keys.

### 3. Start the application

In one terminal:

```bash
cd server
npm run dev
```

In another terminal:

```bash
cd Client
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Overview

| Module | Main endpoints |
| --- | --- |
| Customers | `POST /customers/register`, `POST /customers/login`, `GET /customers/me`, `POST /customers/logout` |
| Products | `GET /products`, `GET /products/:id`, `POST /products` |
| Wishlist | `GET /wishlist`, `POST /wishlist/:productId`, `DELETE /wishlist/:productId` |
| Cart | `GET /cart`, `POST /cart/:productId`, `PATCH /cart/:productId`, `DELETE /cart/:productId` |
| Orders | `POST /orders/create-payment-order`, `POST /orders/verify-payment`, `GET /orders`, `GET /orders/:id` |

Protected endpoints require a logged-in user.

## Deployment Notes

- Deploy the `Client` folder to **Vercel** and set `VITE_API_URL` to the deployed Render API URL.
- Deploy the `server` folder to **Render** and add the variables listed in `server/.env.example`.
- Set Render's `CLIENT_URL` to the deployed Vercel URL.
- MongoDB Atlas must permit the deployment server to connect through Network Access.
- `Client/vercel.json` contains an SPA rewrite so direct refreshes on routes such as `/cart` or `/orders` do not return a 404 page.

## Learning Outcomes

This project provided practical experience with the MERN stack, REST APIs, JWT authentication, database design, global frontend state, online payment workflow, environment-variable security, CORS, and cloud deployment.

