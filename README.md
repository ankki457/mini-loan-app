# Mini Loan App

## Overview

The **Mini Loan App** is a web-based application for managing loan applications, approvals, and repayments. Customers can apply for loans, view their own loans, and make repayments, while admins can approve loans. The app supports minimal frontend functionality with a fully functional REST API backend.

---

## Features

### Customer Functionality
1. **Create a Loan**  
   - Customers submit a loan request with the required amount and term.  
   - Example:  
     Request amount of $10,000 with a 3-week term on `7th Feb 2022`. The app will schedule repayments:  
       - `14th Feb 2022` → $3,333.33  
       - `21st Feb 2022` → $3,333.33  
       - `28th Feb 2022` → $3,333.34  

   - Loan and repayments are created in a `PENDING` state.

2. **View Loans**  
   - Customers can view only their own loans.  
   - Policy ensures no unauthorized access to other customers' loans.

3. **Make Repayments**  
   - Customers can make repayments for their loans.  
   - Repayments must cover the scheduled amount or more.  
   - Repayments will update their status to `PAID`.  
   - Once all repayments for a loan are `PAID`, the loan status is automatically updated to `PAID`.

### Admin Functionality
1. **Approve Loans**  
   - Admins can change loans from `PENDING` to `APPROVED`.
   - Admin User Name - admin@example.com
   - Admin Password - admin123

---

## Technical Stack
- **Frontend**: HTML5, CSS, React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based authentication

---

## Project Structure

```
MiniLoanApp/
├── client/ (Frontend)
│   ├── public/
│   ├── src/
│       ├── components/
│       │   ├── Login.jsx
│       │   ├── Home.jsx
│       │   ├── CreateLoan.jsx
│       │   ├── AdminDashboard.jsx
│       ├── App.jsx
│       ├── index.js
│   ├── package.json
├── server/ (Backend)
│   ├── controllers/
│   │   ├── loanController.js
│   │   ├── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   ├── models/
│   │   ├── Loan.js
│   │   ├── Repayment.js
│   │   ├── User.js
│   ├── routes/
│   │   ├── loanRoutes.js
│   │   ├── userRoutes.js
│   ├── server.js
│   ├── package.json
├── README.md
```

---

## API Endpoints

### Authentication
- **POST** `/api/v1/auth/login` → Login for customers and admins.
- **POST** `/api/v1/auth/register` → Register a new user.

### Loan Management
- **GET** `/api/v1/loans` → Fetch all loans (Admin) or user-specific loans (Customer).
- **POST** `/api/v1/loans/create` → Create a new loan request.
- **PATCH** `/api/v1/loans/update-status` → Approve or reject a loan (Admin).
- **PATCH** `/api/v1/loans/repay` → Make a loan repayment.

### Repayment Management
- Automatically updates loan and repayment statuses based on actions.

---

## Setup Instructions

### Prerequisites
- Node.js 
- MongoDB
- npm 

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ankki457/mini-loan-app
   cd mini-loan-app
   ```

2. Install dependencies:
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. Set up environment variables:  
   Create a `.env` file in the `server/` directory and configure the following:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Start the app:
   ```bash
   # Backend
   cd server
   npm run dev

   # Frontend
   cd ../client
   npm run dev
   ```

5. Access the app in your browser at `http://localhost:5000`.

---

## Frontend Pages
1. **Login Page**  
   - Authenticates customers or admins.  
   - Provides error messages for incorrect credentials.

2. **Home Page**  
   - Displays loan details based on user role.  
   - Allows actions like creating loans, making repayments, or approving loans.

3. **Create Loan Page**  
   - Allows customers to submit loan requests.

4. **Admin Dashboard**  
   - Enables admins to approve loans.

---

## Authors
- **ANKIT SAHU**  
  Connect with me on [LinkedIn](https://www.linkedin.com/in/ankki-shah).  

![Screenshot (82)](https://github.com/user-attachments/assets/863d7ca1-f4a4-4aa2-a2be-a14d00bbffc1)
![Screenshot (83)](https://github.com/user-attachments/assets/d54c6979-42dd-4a92-9cb9-60ff8c8a5685)
![Screenshot (84)](https://github.com/user-attachments/assets/b3794a83-2b09-43b7-90d2-9525495bb0b3)
![Screenshot (86)](https://github.com/user-attachments/assets/f274f6f4-07d3-40fb-901f-e5417ef78e4a)


