from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
from pydantic import BaseModel
import os

# Load model and scaler
model = joblib.load("barclays_delinquency_model.pkl")
scaler = joblib.load("barclays_scaler.pkl")

# Load dataset
DATASET_PATH = "barclays_demo_dataset_50000.csv"
if os.path.exists(DATASET_PATH):
    df_dataset = pd.read_csv(DATASET_PATH)
else:
    df_dataset = pd.DataFrame() # Fallback if file missing

# Create app
app = FastAPI(
    title="Barclays Delinquency Risk API",
    version="1.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DelinquencyInput(BaseModel):
    monthly_income: float
    credit_score: float
    emi_amount: float
    outstanding_balance: float
    avg_balance_3m: float
    balance_trend: float
    total_credit_30d: float
    total_debit_30d: float
    atm_withdrawals_30d: float
    salary_delay_days: int
    emi_delay_days: int

@app.get("/")
def home():
    return {"message": "API is working"}

@app.get("/dashboard-stats")
def get_dashboard_stats():
    if df_dataset.empty:
        return {"error": "Dataset not found"}
    
    total_loans = len(df_dataset)
    high_risk_count = len(df_dataset[df_dataset['delinquent_flag'] == 1])
    
    # Simulate some stats based on data
    high_risk_customers = df_dataset[df_dataset['delinquent_flag'] == 1].head(50).copy()
    
    # Map to frontend structure
    # stressScore: heuristic mapping from credit_score (inverse)
    # credit_score 300-850 -> stress 100-0 roughly
    high_risk_customers['stressScore'] = ((850 - high_risk_customers['credit_score']) / 5.5).clip(0, 100).astype(int)
    
    customers_list = []
    for _, row in high_risk_customers.iterrows():
        customers_list.append({
            "id": row['customer_id'],
            "name": f"Customer {row['customer_id']}", # Anonymized name
            "stressScore": row['stressScore'],
            "riskLevel": "High",
            "trend": "Stable", # Placeholder
            "loans": 1, # Placeholder
            "totalExposure": f"₹{row['outstanding_balance']:,.2f}",
            "history": [row['stressScore']] * 7, # Placeholder history
            "lastUpdated": "Today"
        })

    return {
        "stats": [
            { "label": "Total Active Loans", "value": str(total_loans), "change": "+0%", "status": "neutral" },
            { "label": "High Risk Customers", "value": str(high_risk_count), "change": "N/A", "status": "negative" },
             { "label": "Defaults Prevented", "value": "0", "change": "Last 30 days", "status": "neutral" },
            { "label": "Est. Savings", "value": "₹0", "change": "+0%", "status": "neutral" }
        ],
        "customers": customers_list
    }

@app.get("/customer/{customer_id}")
def get_customer_detail(customer_id: str):
    if df_dataset.empty:
         raise HTTPException(status_code=404, detail="Dataset not found")
            
    customer = df_dataset[df_dataset['customer_id'] == customer_id]
    if customer.empty:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    row = customer.iloc[0]
    stress_score = int(((850 - row['credit_score']) / 5.5))
    if stress_score > 100: stress_score = 100
    if stress_score < 0: stress_score = 0
    
    risk_level = "High" if row['delinquent_flag'] == 1 else "Low"

    return {
        "id": row['customer_id'],
        "name": f"Customer {row['customer_id']}",
        "stressScore": stress_score,
        "riskLevel": risk_level,
        "trend": "Stable",
        "loans": 1,
        "totalExposure": f"₹{row['outstanding_balance']:,.2f}",
        "history": [stress_score] * 7,
        "lastUpdated": "Today",
        # Add raw data for context if needed
        "details": {
            "credit_score": row['credit_score'],
            "monthly_income": row['monthly_income'],
            "emi_amount": row['emi_amount']
        }
    }

@app.post("/predict")
def predict(data: DelinquencyInput):

    # Convert input to dataframe
    df = pd.DataFrame([data.dict()])

    # Scale
    scaled = scaler.transform(df)

    # Predict probability
    probability = model.predict_proba(scaled)[0][1]

    # Predict class
    prediction = model.predict(scaled)[0]

    return {
        "risk_probability": float(probability),
        "risk_percentage": round(probability * 100, 2),
        "prediction": int(prediction),
        "risk_level": (
            "HIGH RISK" if probability > 0.7 else
            "MEDIUM RISK" if probability > 0.4 else
            "LOW RISK"
        )
    }
