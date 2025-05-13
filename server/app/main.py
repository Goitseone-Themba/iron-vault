from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, List
import pandas as pd
import uuid
from app.models import predict_risk
from app.command_center import CommandCenter
from app.supabase_client import get_supabase_client

app = FastAPI(title="IronVault Backend")
command_center = CommandCenter()
supabase = get_supabase_client()

@app.post("/loan")
async def process_loan(data: Dict):
    # Log request
    await command_center.log_event("loan_request", "received", data)

    # Validate input
    is_valid, error_message = command_center.validate_loan_data(data)
    if not is_valid:
        await command_center.log_event("validation_failed", "error", {"error": error_message})
        raise HTTPException(status_code=400, detail={"error": error_message})

    # Call model for risk assessment
    try:
        prediction = predict_risk(data)
        await command_center.log_event("model_call", "success", prediction)
    except Exception as e:
        await command_center.log_event("model_call", "failed", {"error": str(e)})
        raise HTTPException(status_code=500, detail={"error": "Model prediction failed"})

    # Prepare data for Supabase
    loan_entry = {
        "id": str(uuid.uuid4()),
        **data,
        "risk_score": prediction["risk_score"],
        "approval_status": prediction["approval_status"]
    }

    # Store in Supabase
    try:
        response = supabase.table("loans").insert(loan_entry).execute()
        if not response.data:
            raise Exception("No data returned from Supabase")
        await command_center.log_event("supabase_write", "success", {"loan_id": loan_entry["id"]})
    except Exception as e:
        await command_center.log_event("supabase_write", "failed", {"error": str(e)})
        raise HTTPException(status_code=500, detail={"error": "Failed to store loan data"})

    # Return result to frontend
    return {
        "id": loan_entry["id"],
        "loan_amount": data["loan_amount"],
        "credit_score": data["credit_score"],
        "income": data["income"],
        "risk_score": prediction["risk_score"],
        "approval_status": prediction["approval_status"]
    }

@app.post("/batch")
async def process_batch(file: UploadFile = File(...)):
    # Log request
    await command_center.log_event("batch_request", "received", {"filename": file.filename})

    # Validate file type
    if not file.filename.endswith(".csv"):
        await command_center.log_event("batch_validation_failed", "error", {"error": "File must be a CSV"})
        raise HTTPException(status_code=400, detail={"error": "File must be a CSV"})

    # Read and parse CSV
    try:
        content = await file.read()
        df = pd.read_csv(pd.io.common.StringIO(content.decode("utf-8")))
        await command_center.log_event("csv_parse", "success", {"rows": len(df)})
    except Exception as e:
        await command_center.log_event("csv_parse", "failed", {"error": str(e)})
        raise HTTPException(status_code=400, detail={"error": "Failed to parse CSV"})

    # Validate CSV columns
    expected_columns = [
        "age", "income", "loan_amount", "credit_score",
        "debt_to_income_ratio", "employment_years", "savings_balance", "existing_loans"
    ]
    if not all(col in df.columns for col in expected_columns):
        missing = [col for col in expected_columns if col not in df.columns]
        await command_center.log_event("csv_validation_failed", "error", {"missing_columns": missing})
        raise HTTPException(status_code=400, detail={"error": f"Missing columns: {missing}"})

    # Process each row
    results = []
    for _, row in df.iterrows():
        data = row.to_dict()
        
        # Validate row data
        is_valid, error_message = command_center.validate_loan_data(data)
        if not is_valid:
            await command_center.log_event("row_validation_failed", "error", {"error": error_message, "row": data})
            continue  # Skip invalid rows

        # Call model
        try:
            prediction = predict_risk(data)
            await command_center.log_event("model_call", "success", prediction)
        except Exception as e:
            await command_center.log_event("model_call", "failed", {"error": str(e)})
            continue

        # Store in Supabase
        loan_entry = {
            "id": str(uuid.uuid4()),
            **data,
            "risk_score": prediction["risk_score"],
            "approval_status": prediction["approval_status"]
        }
        try:
            response = supabase.table("loans").insert(loan_entry).execute()
            if not response.data:
                raise Exception("No data returned from Supabase")
            await command_center.log_event("supabase_write", "success", {"loan_id": loan_entry["id"]})
        except Exception as e:
            await command_center.log_event("supabase_write", "failed", {"error": str(e)})
            continue

        # Add to results
        results.append({
            "id": loan_entry["id"],
            "loan_amount": data["loan_amount"],
            "credit_score": data["credit_score"],
            "income": data["income"],
            "risk_score": prediction["risk_score"],
            "approval_status": prediction["approval_status"]
        })

    return results

@app.get("/health")
async def health_check():
    # Check Supabase connection
    try:
        response = supabase.table("loans").select("id").limit(1).execute()
        db_status = "connected" if response.data is not None else "disconnected"
    except Exception as e:
        await command_center.log_event("health_check_db", "failed", {"error": str(e)})
        db_status = "disconnected"

    # Check model availability (mock for now)
    model_status = "available"  # Replace with actual model check when using Colab model

    status = "ok" if db_status == "connected" and model_status == "available" else "error"
    await command_center.log_event("health_check", "completed", {"status": status, "db": db_status, "model": model_status})
    
    return {"status": status, "db": db_status, "model": model_status}
