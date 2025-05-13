import uuid
import time
from datetime import datetime
from typing import Dict, Any
from supabase import Client
from app.supabase_client import get_supabase_client

class CommandCenter:
    def __init__(self):
        self.supabase: Client = get_supabase_client()

    # Log events to Supabase logs table
    async def log_event(self, event: str, status: str, details: Dict[str, Any] = None):
        log_entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "event": event,
            "status": status,
            "details": details or {}
        }
        for attempt in range(3):  # Retry 3 times
            try:
                response = self.supabase.table("logs").insert(log_entry).execute()
                if response.data:
                    return
                else:
                    await self.log_event("supabase_write_retry", "failed", {"attempt": attempt + 1, "error": "No data returned"})
            except Exception as e:
                await self.log_event("supabase_write_retry", "failed", {"attempt": attempt + 1, "error": str(e)})
                time.sleep(1)  # Wait 1 second before retrying
        await self.log_event("supabase_write_failed", "error", {"message": "Failed to write log after 3 attempts"})

    # Validate loan application input
    def validate_loan_data(self, data: dict) -> tuple[bool, str]:
        required_fields = [
            "age", "income", "loan_amount", "credit_score",
            "debt_to_income_ratio", "employment_years", "savings_balance", "existing_loans"
        ]
        
        # Check for missing fields
        for field in required_fields:
            if field not in data:
                return False, f"Missing required field: {field}"

        # Validate field ranges
        if not (300 <= data["credit_score"] <= 850):
            return False, "Credit score must be between 300 and 850"
        if not (0 <= data["debt_to_income_ratio"] <= 1):
            return False, "Debt-to-income ratio must be between 0 and 1"
        if not (18 <= data["age"] <= 100):
            return False, "Age must be between 18 and 100"
        if not (0 <= data["existing_loans"] <= 10):
            return False, "Existing loans must be between 0 and 10"
        
        return True, ""
