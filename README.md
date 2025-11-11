# 🛍️ AI ShopBud - E-Commerce Website 

**ShopBud** is a full-stack e-commerce web application built to deliver a complete online shopping experience.  
Users can explore products, manage their cart, place secure orders, and make real-time payments through Stripe.  
The platform also includes admin features for managing products, orders, and inventory.  
Built with a modern tech stack: **React, Redux, Vite, Node.js, Express, and PostgreSQL** - the app ensures high performance, scalability, and responsive design across all devices.

---

### 🌍 Live Demos  
- **Frontend (User Site)** : [https://shopbud-frontend.vercel.app](https://shopbud-frontend.onrender.com)  
- **Admin Portal** : [https://shopbud-admin.vercel.app](https://shopbud-admin.onrender.com)  
  - **Demo Login**:  
    - Email: `admin@demo.com`  
    - Password: `Admin@1234`
---

## 🧠 Highlights
	•	🧩 AI Product Search - Gemini API filters and sorts products intelligently based on search queries.
	•	💳 Stripe Payment Gateway - Secure checkout and order placement.
	•	☁️ Cloudinary Integration - For product and profile image storage.
	•	📧 Nodemailer - Email service for password reset and order notifications.
	•	🔐 JWT Authentication & Role-Based Access - For admin and user separation.
	•	📦 Fully Functional Admin Dashboard - Track revenue, sales stats, and manage users, orders, and inventory.
	•	🌓 Dark/Light Mode - For a modern, responsive experience on all devices.
	•	📱 Responsive Design - Optimized for both desktop and mobile users.

---

## 🧰 Tech Stack

**Frontend:**  
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)  
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)  

**Backend:**  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)  

**Payment & Services:**  
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)  
![Cloudinary](https://img.shields.io/badge/Cloudinary-DB0D8B?style=for-the-badge&logo=cloudinary&logoColor=white)  
![Nodemailer](https://img.shields.io/badge/Nodemailer-D14836?style=for-the-badge&logo=nodemailer&logoColor=white)  

**Authentication & Others:**  
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)  
![Bcrypt](https://img.shields.io/badge/Bcrypt-FF8800?style=for-the-badge)  
![dotenv](https://img.shields.io/badge/Dotenv-000000?style=for-the-badge&logo=dotenv&logoColor=white)  
![cors](https://img.shields.io/badge/CORS-4D4D4D?style=for-the-badge)  
![express-fileupload](https://img.shields.io/badge/Express--FileUpload-6DB33F?style=for-the-badge)  

---

## ✨ Key Features  

### 🛍️ Frontend 
- 🗝️ **Authentication** - Register, Login, Logout, Forgot & Reset Password  
- 👤 **Profile Management** - Update profile, profile picture, and password
- 🛍️ **Wishlist & Cart** - Add/remove items, adjust quantities
- 🌙 **Dark/Light Mode** - Automatic theme switching
- 🔖 **Product Categories** - Electronics, Fashion, Home & Garden, Sports and Outdoor, Books, Beauty, Automotive, and Kids & Baby.
- 🆕 **New Arrivals** & **Top Rated Products**
- 🔍 **AI Product Search** — Powered by **Gemini API**, instantly filters and recommends relevant items  
- ⭐ **Product Reviews and Ratings** — Add, update, delete, or view reviews and ratings
- ❇️ **Product Catalog** — Browse, search, filter, share, and sort by price, category, rating, or availability
- 🏷️ **Product Tags** - **New**, **Top Rated**, **In Stock**, **Limited Stock**, **Out Of Stock**
- 📦 **My Orders** - View order details, and Track order
- 📝 **Orders Management** — Track order status: *Processing, Shipped, Delivered, Cancelled*
- 📄 **Order Details Page** — Full summary with items, prices, shipping info, and estimated delivery
- 💳 **Checkout & Payment** — Secure **Stripe** integration  
- 🖥️ **Responsive Design** — Optimized for all devices  

### 🧑‍💼 Admin Panel
- 🔑 **Admin Authentication**
    - Login
    - Logout
    - Forgot & Reset Password
- 📊 **Dashboard Analytics**
  - Today’s and monthly revenue  
  - Revenue growth rate  
  - Total orders, sales, users, new customers  
  - Monthly sales graph and order status pie chart  
  - Top-selling and low-stock products  
- 🛒 **Products Management**
  - Create, update, delete products  
  - Manage stock, price, ratings, and description  
- 📦 **Orders Management**
  - View all orders with full details  
  - Update order status (*Processing, Shipped, Delivered, Cancelled*)  
  - Delete orders  
- 👥 **Users Management**
  - View all registered users  
  - Delete users  
- 👤 **Profile Section**
  - Update admin details, profile picture and password  

---

## 🧠 AI Product Search  
Users can type a natural-language query like  
> *“Show me budget gaming laptops under $1000 with 16GB RAM”*  
and the **AI engine (Gemini API)** intelligently filters and displays matching products.

---

## 🗄️ Database Design 
**Tables:**
- `users` - Users info, roles, credentials  
- `products` - product details, Category, stock, rating, price, tags (new, top-rated)
- `product_reviews` - Reviews and Ratings 
- `orders` - Orders placed by users
- `order_items - Products in each order
- `payment` - Payment info for orders
- `shipping_info` - Shipping addresses 

---

## 💳 Payment Integration  
- Secure checkout using **Stripe**  
- Dynamic order summaries  
- Post-payment order confirmation and invoice generation  

---

## 📊 Admin Dashboard Overview  
- **Today’s Revenue** vs Yesterday  
- **All-Time & Monthly Sales Graph**  
- **Order Status Pie Chart**  
- **Top Selling Products Table**  
- **Summary Cards**  
  - Total Sales This Month  
  - Total Orders  
  - Top Selling Product  
  - Low Stock Alerts  
  - Revenue Growth Rate  
  - New Customers  

---

## ⚡ APIs Implemented  

**Product APIs**
- Create, Update, Delete, Fetch all, Fetch single Product 
- AI Filtered Products  
- Add / Delete / Update Review  

**Order APIs**
- Place New Order  
- Fetch Single / My Orders / All Orders  
- Update Order Status  
- Delete Order  

**User APIs**
- Register, Login, Logout  
- Forgot & Reset Password  
- Update Profile & Password  
- Get User / Delete User  

**Admin APIs**
- Get All Users
- Delete User
- Dashboard Stats (revenue, charts, trends, mini summary)

---

## 🧭 Navigation  

| Page | Description |
|------|--------------|
| **Home** | Home Slider with quick navigation, Shop By Category, New Arrivals, Top Rated Products, Feature Section |
| **Products** | All products with advanced filters and AI Search and Product Details |
| **Cart** | Add, update, or remove products |
| **Wishlist** | Manage favorite items |
| **My Orders** | Track and view detailed order history |
| **Profile** | Manage personal info, password, and profile picture |
| **About / FAQ / Contact** | Informational pages |

---
## 🚀 Deployment  
- **Frontend**: Render  
- **Admin Dashboard**: Render  
- **Backend**: Render  
- **Database**: PostgreSQL (Render)  
- **Cloud Storage**: Cloudinary  

---

## 🧰 Installation & Setup  

### 1️⃣ Clone the repo  
```bash
git clone https://github.com/Ritupagar12/ai_shopbud_ecommerce_website.git
cd ai_shopbud_ecommerce_website
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```

### create .env file
```bash
PORT=4000
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30
JWT_SECRET_KEY=YOUR_JWT_SECRET

SMTP_SERVICE=gmail
SMTP_MAIL=YOUR_EMAIL
SMTP_PASSWORD=YOUR_EMAIL_PASSWORD
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
CLOUDINARY_CLIENT_NAME=YOUR_CLOUDINARY_NAME
CLOUDINARY_CLIENT_API=YOUR_CLOUDINARY_API
CLOUDINARY_CLIENT_SECRET=YOUR_CLOUDINARY_SECRET

STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
STRIPE_FRONTEND_KEY=YOUR_STRIPE_FRONTEND_KEY

DB_USER=YOUR_DB_USER
DB_HOST=YOUR_DB_HOST
DB_NAME=YOUR_DB_NAME
DB_PASSWORD=YOUR_DB_PASSWORD
DB_PORT=5432

EXCHANGE_API=YOUR_EXCHANGE_API_URL
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 4️⃣ Admin Setup
```bash
cd admin
npm install
npm run dev
```
---
## 📦 Required packages
```bash
npm install bcrypt cloudinary cookie-parser cors dotenv express express-fileupload jsonwebtoken nodemailer pg stripe
```
---

### 🧑‍💻 Author
- Developed by Ritu Pagar    
- Full end-to-end development: Frontend + Admin + Backend + Database + Deployment.

---

### 📌 Notes
- Make sure to add your .env file with keys for Stripe, Cloudinary, JWT, Email (Nodemailer), Exchange Rate API.
- Roles:  Admin and User with different permissions
- Errors handled via centralized middleware.

---

# 🛍️ ShopBud brings the intelligence of AI to e-commerce, combining smooth design with deep functionality.

