import joblib

# Mock model for risk assessment
def predict_risk(data: dict) -> dict:
    # Extract input fields
    age = data["age"]
    income = data["income"]
    loan_amount = data["loan_amount"]
    credit_score = data["credit_score"]
    debt_to_income_ratio = data["debt_to_income_ratio"]
    employment_years = data["employment_years"]
    savings_balance = data["savings_balance"]
    existing_loans = data["existing_loans"]

    # Mock rule-based scoring (weights adjusted for impact)
    risk_score = (
        100
        - (credit_score / 10)  # Higher credit score lowers risk
        + (income / 10000)     # Higher income lowers risk
        - (loan_amount / 20000)  # Higher loan amount increases risk
        - (debt_to_income_ratio * 20)  # Higher DTI increases risk
        + (savings_balance / 5000)  # Higher savings lowers risk
        - (existing_loans * 5)  # More loans increase risk
        + (employment_years * 2)  # More employment years lower risk
        - (age / 5)  # Older age slightly increases risk
    )

    # Cap risk score between 0 and 100
    risk_score = max(0, min(100, risk_score))
    
    # Determine approval status
    approval_status = "Approved" if risk_score > 50 else "Denied"

    return {"risk_score": risk_score, "approval_status": approval_status}

# Placeholder for loading a joblib model (for future Colab integration)
def load_joblib_model():
    try:
        model = joblib.load("model.joblib")
        return model
    except FileNotFoundError:
        return None

# Function to predict using joblib model (uncomment when model.joblib is available)
# def predict_with_joblib(data: dict) -> dict:
#     model = load_joblib_model()
#     if model:
#         # Convert data to format expected by the model
#         input_data = [[
#             data["age"],
#             data["income"],
#             data["loan_amount"],
#             data["credit_score"],
#             data["debt_to_income_ratio"],
#             data["employment_years"],
#             data["savings_balance"],
#             data["existing_loans"]
#         ]]
#         prediction = model.predict(input_data)[0]
#         risk_score = float(prediction)  # Adjust based on your model's output
#         approval_status = "Approved" if risk_score > 50 else "Denied"
#         return {"risk_score": risk_score, "approval_status": approval_status}
#     else:
#         return predict_risk(data)  # Fallback to mock model
