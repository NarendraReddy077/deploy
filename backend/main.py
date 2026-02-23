from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Simple Fullstack App API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        # Fallback for demonstration if env vars aren't set yet
        print("Warning: SUPABASE_URL or SUPABASE_KEY not set.")
        return None
    return create_client(SUPABASE_URL, SUPABASE_KEY)

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None

class Item(ItemBase):
    id: int

@app.get("/")
async def root():
    return {"message": "FastAPI Backend is running"}

@app.get("/items", response_model=List[dict])
async def read_items(supabase: Client = Depends(get_supabase)):
    if not supabase:
        return [{"id": 0, "name": "Placeholder", "description": "Connect Supabase to see real data"}]
    
    response = supabase.table("items").select("*").execute()
    return response.data

@app.post("/items", response_model=dict)
async def create_item(item: ItemBase, supabase: Client = Depends(get_supabase)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    response = supabase.table("items").insert(item.dict()).execute()
    return response.data[0]

@app.get("/health")
async def health():
    return {"status": "healthy"}
