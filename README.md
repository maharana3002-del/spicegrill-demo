# Spice Grill — Restaurant Website Concept

> **Unofficial Demo / Concept Project**  
> This website is a restaurant website concept created for demonstration and portfolio purposes. It is **not affiliated with, endorsed by, or operated by Spice Grill**.

## 🍽️ About the Project

Spice Grill is a modern restaurant website concept designed to demonstrate how a restaurant could present its menu, ordering experience, reservations, and administrative tools through a responsive web application.

The project includes both a **customer-facing restaurant storefront** and an **admin dashboard**, connected through a Node.js REST API.

The website uses sample/demo content and is intended for **portfolio presentation and UI/UX demonstration**.

---

## ✨ Features

### Customer Website

- Modern responsive restaurant homepage
- Interactive menu browsing
- Category-based menu filtering
- Add items to cart
- Increase/decrease item quantities
- Automatic subtotal calculation
- Delivery calculation
- Simulated checkout/order flow
- Reservation/booking interface
- Mobile-friendly navigation drawer
- Custom modals and interactive UI elements
- Responsive design for desktop, tablet, and mobile
- Smooth animations and modern visual styling

### Admin Dashboard

- Admin authentication
- Protected admin routes
- Menu management
- Add, update, and delete menu items
- Category management
- Order management
- Reservation management
- Restaurant statistics
- Basic analytics
- Dashboard overview

---

## 🛠️ Technology Stack

### Frontend

- HTML5
- Tailwind CSS v3
- Vanilla JavaScript (ES6+)
- Fetch API
- REST API integration
- Asynchronous JavaScript
- Lucide Icons
- Google Fonts

### Backend

- Node.js
- Express.js v5
- REST API
- MVC-style structure
- Express middleware
- CORS
- dotenv
- JWT authentication
- bcryptjs

### Database

- SQLite
- better-sqlite3
- Foreign key relationships
- Transactions
- WAL mode
- Automatic database schema/seed setup

---

## 🏗️ Architecture

The project follows a simple full-stack architecture:

```text
Customer Storefront
        │
        │ HTTP / JSON
        ▼
   REST API
        │
        ▼
Node.js + Express.js
        │
        ├── Authentication
        ├── Controllers
        ├── Routes
        ├── Business Logic
        └── Middleware
        │
        ▼
 better-sqlite3
        │
        ▼
    SQLite Database
```

The project also includes a separate admin portal for managing demo restaurant data.

---

## 🔌 API Structure

The backend provides REST API endpoints for the main application functionality.

Example API areas include:

```text
/api/menu
/api/orders
/api/reservations
/api/admin
/api/stats
```

The frontend communicates with the backend using asynchronous HTTP requests and JSON data.

---

## 🔐 Authentication & Security

The demo backend includes:

- JWT-based authentication
- Password hashing with bcryptjs
- Protected admin endpoints
- Authentication middleware
- Environment variables for sensitive configuration
- CORS configuration
- Local database protection

Sensitive environment files and local database files are excluded from the public repository.

---

## 🤖 AI-Assisted Development

This project was developed using an **AI-assisted development workflow**.

AI tools were used to assist with generating and modifying project code and files based on my requirements, prompts, implementation direction, and requested improvements.

My contribution included:

- Defining the project concept and direction
- Planning features and functionality
- Providing prompts and implementation requirements
- Reviewing generated code and project output
- Requesting changes and improvements
- Testing website functionality
- Making project and feature decisions
- Reviewing the overall user experience
- Setting up the Git repository
- Managing Git commits
- Setting up and managing the GitHub repository
- Preparing the project for deployment

This project demonstrates an **AI-assisted approach to full-stack web development**, combined with human planning, review, testing, and decision-making.

---

## 📁 Project Structure

```text
Spice Grill Website/
│
├── admin/
│   ├── index.html
│   ├── admin.js
│   └── admin.css
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── data/
│   ├── server.js
│   └── ...
│
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 🎨 Design

The interface focuses on a modern restaurant experience with:

- Premium visual presentation
- Responsive layouts
- Restaurant-focused typography
- Interactive menu experience
- Clear call-to-action sections
- Mobile-first usability
- Customer ordering flow
- Admin management interface

---

## 🧪 Demo Safety

This project is presented as a **concept/demo website**.

It uses:

- Sample menu content
- Sample pricing
- Demo address information
- Conceptual restaurant information
- Simulated ordering functionality
- Demo reservation functionality

It is not intended to process real customer orders, payments, or reservations.

> **Unofficial Demo — Not affiliated with or endorsed by the restaurant.**

---

## 🎯 Project Purpose

The purpose of this project is to demonstrate practical experience with:

- Frontend web development
- Full-stack application structure
- REST API integration
- Backend development
- Database integration
- Authentication
- Admin dashboards
- Responsive UI design
- Git and GitHub workflow
- AI-assisted software development
- Deployment preparation

---

## 🚀 Future Improvements

Possible future improvements include:

- Production database integration
- Online payment integration
- Real-time order tracking
- Email notifications
- WhatsApp order notifications
- Advanced admin analytics
- Customer accounts
- Order history
- Image management
- Production-grade deployment architecture

---

## 👩‍💻 managed by

**Pakeeza**
