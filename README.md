# IronVault - Loan Risk Assessment System

IronVault is a loan risk assessment system designed to help officers evaluate loan applications efficiently. It features a React frontend for user interaction and a FastAPI backend for processing and risk assessment, integrated with Supabase for authentication and data storage. The system supports single loan submissions and batch uploads via CSV, leveraging a machine learning model (trained on Google Colab and exported via joblib) to compute risk metrics. IronVault is built for scalability, reliability, and ease of use, with a professional SoFi-inspired design.

**[Live Demo](https://iron-vault.netlify.app/)**

## System Overview

IronVault is composed of two main repositories:

- **Client (React Frontend)**: A user-friendly interface for officers to log in, submit loan applications, upload CSV files for batch processing, and view risk assessment results in a sortable table.
- **Server (FastAPI Backend)**: Processes loan applications, integrates with a risk assessment model, stores data in Supabase, and provides API endpoints for the frontend. Includes a Command Center middleware for logging and error handling.

### Architecture

- **Frontend (Client)**:
  - Built with React, Tailwind CSS, and React Router.
  - Uses Supabase for officer authentication (email/password) and data retrieval.
  - Features: Login/logout, single loan form, CSV upload, results table, and API health indicator.
  - Hosted on Netlify: [https://iron-vault.netlify.app/](https://iron-vault.netlify.app/)

- **Backend (Server)**:
  - Built with FastAPI, using Uvicorn as the ASGI server.
  - Integrates with Supabase for data storage and logging.
  - Mock model for risk assessment (placeholder for a Google Colab-trained model exported via joblib).
  - Endpoints: `/loan` (single loan), `/batch` (CSV upload), `/health` (system status).
  - Includes Command Center middleware for logging, input validation, and error handling.

- **Database (Supabase)**:
  - Tables:
    - `loans`: Stores loan applications and results (`id`, `age`, `income`, `loan_amount`, `credit_score`, `debt_to_income_ratio`, `employment_years`, `savings_balance`, `risk_score`, `approval_status`).
    - `logs`: Stores system logs (`id`, `timestamp`, `event`, `status`, `details`).
  - Authentication: Email/password for officers.

- **Model**:
  - Currently a mock rule-based model (e.g., `risk_score = 100 - (credit_score / 10)`).
  - Designed to integrate a Google Colab-trained model (exported via joblib).
  - Input: 8 fields (`age`, `income`, `loan_amount`, `credit_score`, `debt_to_income_ratio`, `employment_years`, `savings_balance`, `existing_loans`).
  - Output: `{ risk_score: float (0-100), approval_status: "Approved" | "Denied" }`.

- **Command Center**:
  - Orchestrates the flow: Frontend → Backend → Model → Supabase → Frontend.
  - Logs all requests, model calls, and Supabase writes to the `logs` table.
  - Validates inputs (e.g., `credit_score` 300-850) and retries failed Supabase writes (3 attempts).

## Getting Started

To run IronVault locally, you’ll need to set up both the client and server repositories, along with a Supabase project.

### Prerequisites

- **Client**:
  - Node.js (v16 or higher)
  - npm (v8 or higher)
- **Server**:
  - Python (v3.9 or higher)
  - pip (v21 or higher)
- **General**:
  - Supabase account (for `SUPABASE_URL` and `SUPABASE_ANON_KEY`)

### Setup

1. **Supabase Setup**:

   - Create a Supabase project.
   - Set up authentication (email/password) for officers.
   - Create the following tables:
     - `loans`: `id` (UUID), `age` (integer), `income` (numeric), `loan_amount` (numeric), `credit_score` (integer), `debt_to_income_ratio` (float), `employment_years` (integer), `savings_balance` (numeric), `risk_score` (numeric), `approval_status` (text).
     - `logs`: `id` (UUID), `timestamp` (timestamp), `event` (text), `status` (text), `details` (jsonb).
   - Note your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

2. **Client Setup**:

   ```bash
   git clone <client-repo-url>
   cd ironvault-client
   npm install
   ```

   - Configure `src/supabase.js` with your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
   - Run the app:
     ```bash
     npm start
     ```
   - Access at `http://localhost:3000`.

3. **Server Setup**:

   ```bash
   git clone <server-repo-url>
   cd ironvault-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

   - Configure `app/supabase_client.py` with your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
   - Run the server:
     ```bash
     uvicorn app.main:app --reload --port 3000
     ```
   - Access endpoints at `http://localhost:3000`.

### Usage

1. **Access the App**:
   - Open `http://localhost:3000` (or the live demo: [https://iron-vault.netlify.app/](https://iron-vault.netlify.app/)).
   - Log in with officer credentials (set up in Supabase).

2. **Submit a Loan**:
   - Use the form to submit a single loan application with the 8 fields.
   - Example:
     ```json
     {
       "age": 40,
       "income": 30000,
       "loan_amount": 120000,
       "credit_score": 700,
       "debt_to_income_ratio": 0.35,
       "employment_years": 8,
       "savings_balance": 15000,
       "existing_loans": 2
     }
     ```

3. **Batch Upload**:
   - Upload a CSV file with the format: `age,income,loan_amount,credit_score,debt_to_income_ratio,employment_years,savings_balance,existing_loans`.
   - Example:
     ```
     age,income,loan_amount,credit_score,debt_to_income_ratio,employment_years,savings_balance,existing_loans
     40,30000,120000,700,0.35,8,15000,2
     ```

4. **View Results**:
   - The table displays loan results, sortable by `risk_score` and `approval_status`.

5. **Monitor System**:
   - The API status dot in the navbar indicates backend health (green = healthy, red = unhealthy).

## Model Integration

- The backend currently uses a mock model.
- To integrate a Google Colab-trained model:
  - Train your model in Colab.
  - Export it: `joblib.dump(model, "model.joblib")`.
  - Place `model.joblib` in `ironvault-backend/app/`.
  - Update `app/models.py` to load the model: `model = joblib.load("model.joblib")`.
- Ensure the model accepts the 8-field input and returns `{ risk_score: float (0-100), approval_status: "Approved" | "Denied" }`.

## Deployment

- **Client**: Deploy the `build/` directory to a static hosting service (e.g., Netlify).
  ```bash
  npm run build
  ```
- **Server**: Deploy to a cloud service (e.g., Render, Heroku, or GCP).
  - Set environment variables for `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
  - Run: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

## Troubleshooting

- **Supabase Issues**: Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`, check Supabase project status.
- **API Status Red**: Ensure the backend is running at `http://localhost:3000` (or your deployed URL).
- **CSV Upload Fails**: Confirm the CSV format matches the expected 8 columns.
- **Model Errors**: Ensure the joblib model is compatible with the input format.

## Contributing

- Create a feature branch: `git checkout -b feature/your-feature`.
- Commit changes: `git commit -m "Add your feature"`.
- Push and create a pull request: `git push origin feature/your-feature`.

## License

MIT License. See `LICENSE` for details.
