from supabase import create_client, Client
import os

# Supabase client setup
def get_supabase_client() -> Client:
    # Use environment variables or replace with actual values
    url = os.getenv("SUPABASE_URL", "YOUR_SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY", "YOUR_SUPABASE_ANON_KEY")
    
    # Validate URL and key
    if "YOUR_SUPABASE_URL" in url or "YOUR_SUPABASE_ANON_KEY" in key:
        raise ValueError("Supabase URL and Anon Key must be set in app/supabase_client.py or as environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)")
    
    if not url.startswith("https://"):
        raise ValueError(f"Supabase URL must start with 'https://', got: {url}")
    
    return create_client(url, key)
