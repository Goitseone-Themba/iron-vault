# IronVault Server
IronVault Server is the FastAPI backend for the IronVault loan risk assessment system. It handles loan application submissions (single and batch), integrates with Supabase for data storage, and prepares for a Google Colab-trained model (exported via joblib). The backend includes a Command Center middleware for logging and error handling.
Features

## Endpoints:
POST /loan: Process a single loan application, call the model, and store results in Supabase.
POST /batch: Process a batch of loan applications via CSV, call the model for each, and store results.
GET /health: Check Supabase and model availability for system status.


Model: Mock rule-based model (placeholder for a joblib-loaded model trained on Google Colab).
Supabase: Stores loan applications and results in the loans table, logs events in the logs table.
Command Center:
Logs all requests, model calls, and Supabase writes.
Validates inputs and retries failed Supabase writes.
Returns clear error messages to the frontend.



## Project Structure
ironvault-backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app and endpoints
│   ├── models.py         # Mock model and Joblib integration
│   ├── supabase_client.py # Supabase client setup
│   └── command_center.py # Logging and error handling
├── requirements.txt
└── README.md

## Prerequisites

Python (v3.9 or higher)
pip (v21 or higher)
Supabase account with project setup (you’ll need SUPABASE_URL and SUPABASE_ANON_KEY)

## Setup

Clone the Repository:
git clone <server-repo-url>
cd ironvault-backend


Set Up Virtual Environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install Dependencies:
pip install -r requirements.txt


Configure Supabase:

Open app/supabase_client.py.
Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with your Supabase project credentials (same as the frontend).
Ensure the following tables exist in Supabase:
loans: id (UUID), age (integer), income (numeric), loan_amount (numeric), credit_score (integer), debt_to_income_ratio (float), employment_years (integer), savings_balance (numeric), risk_score (numeric), approval_status (text).
logs: id (UUID), timestamp (timestamp), event (text), status (text), details (jsonb).




Model Integration:

The current model in app/models.py is a mock (rule-based).
To use a Google Colab-trained model:
Export the model using joblib: joblib.dump(model, "model.joblib").
Place model.joblib in the app/ directory.
Update app/models.py to load the model: model = joblib.load("model.joblib").





## Running the Server

Start the Server:
uvicorn app.main:app --reload --port 3000

The server will run at http://localhost:3000.

Test Endpoints:

POST /loan:
curl -X POST http://localhost:3000/loan -H "Content-Type: application/json" -d '{"age": 40, "income": 30000, "loan_amount": 120000, "credit_score": 700, "debt_to_income_ratio": 0.35, "employment_years": 8, "savings_balance": 15000, "existing_loans": 2}'


POST /batch:

Create a test.csv file:
age,income,loan_amount,credit_score,debt_to_income_ratio,employment_years,savings_balance,existing_loans
40,30000,120000,700,0.35,8,15000,2


Upload:
curl -X POST http://localhost:3000/batch -F "file=@test.csv"




GET /health:
curl http://localhost:3000/health





## Usage

The backend processes loan applications from the IronVault Client (React frontend).
Single Loan: Submit a JSON payload to /loan, the backend validates, calls the model, stores results in Supabase, and returns the result.
Batch Upload: Upload a CSV to /batch, the backend parses, validates, processes each row, stores results, and returns an array of results.
Health Check: The /health endpoint is polled by the frontend to display API status.
Logs are stored in the Supabase logs table for debugging and auditing.

Model Integration

The mock model in app/models.py uses a simple rule (e.g., risk_score = 100 - (credit_score / 10)).
To integrate a Colab-trained model:
Train your model in Google Colab.
Export it: joblib.dump(model, "model.joblib").
Place model.joblib in app/.
Update app/models.py to load and use the model.


The model should accept a dict with 8 fields and return { risk_score: float (0-100), approval_status: "Approved" | "Denied" }.

Command Center

Logging: All requests, model calls, and Supabase writes are logged to the logs table.
Validation: Inputs are validated (e.g., credit_score 300-850, debt_to_income_ratio 0-1).
Error Handling: Failed Supabase writes are retried (3 attempts), clear error messages are returned.

Deployment

Deploy to a cloud service (e.g., Render, Heroku, or GCP).
Set environment variables for SUPABASE_URL and SUPABASE_ANON_KEY.
Run with Uvicorn: uvicorn app.main:app --host 0.0.0.0 --port $PORT.

Troubleshooting

Supabase Connection Fails: Verify SUPABASE_URL and SUPABASE_ANON_KEY, check Supabase project status.
CSV Parsing Fails: Ensure the CSV matches the expected format (8 columns).
Model Errors: If using a joblib model, ensure model.joblib is in app/ and compatible with the input format.

Contributing

Create a feature branch: git checkout -b feature/your-feature.
Commit changes: git commit -m "Add your feature".
Push and create a pull request: git push origin feature/your-feature.

License
MIT License. See LICENSE for details.

