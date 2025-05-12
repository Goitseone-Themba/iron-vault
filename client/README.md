# IronVault - Loan Risk Assessment System

IronVault is a modern web application for loan risk assessment, designed with a clean, SoFi-inspired interface.

## Features

- **Authentication**: Secure login with email/password via Supabase
- **Loan Application Input**: Submit individual loan applications or batch upload via CSV
- **Results Display**: View and sort loan applications by risk score and approval status
- **System Status**: Monitor API health with visual indicator

## Tech Stack

- React with Vite
- Tailwind CSS for styling
- Supabase for authentication and data storage
- Axios for API calls
- PapaParse for CSV parsing
- React Router for navigation

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Connect to Supabase using the "Connect to Supabase" button
4. Start the development server: `npm run dev`

## API Endpoints

The application interacts with the following API endpoints:

- `POST /loan`: Submit a single loan application
- `POST /batch`: Submit multiple loan applications via CSV
- `GET /health`: Check API health status

## CSV Format

For batch uploads, use the following CSV format:
```
age,income,loan_amount,credit_score,debt_to_income_ratio,employment_years,savings_balance,existing_loans
40,30000,120000,700,0.35,8,15000,2
```

## Database Schema

The application uses a Supabase database with the following schema:

- `loans` table:
  - `id` (UUID, primary key)
  - `age` (integer)
  - `income` (numeric)
  - `loan_amount` (numeric)
  - `credit_score` (integer)
  - `debt_to_income_ratio` (float)
  - `employment_years` (integer)
  - `savings_balance` (numeric)
  - `existing_loans` (integer)
  - `risk_score` (numeric)
  - `approval_status` (text)
  - `created_at` (timestamptz)