import joblib
import pandas as pd

model = joblib.load("barclays_delinquency_model.pkl")

customer = {
    "monthly_income": 4000,
    "credit_score": 500,
    "emi_amount": 1500,
    "outstanding_balance": 3000,
    "avg_balance_3m": 12000,
    "balance_trend": 0.3,
    "total_credit_30d": 4200,
    "total_debit_30d": 3000,
    "atm_withdrawals_30d": 6,
    "salary_delay_days": 1,
    "emi_delay_days": 2
}

df = pd.DataFrame([customer])

risk = model.predict_proba(df)[0][1]

print("Delinquency Risk:", round(risk*100,2), "%")

if risk > 0.7:
    print("Action: Immediate intervention recommended")
elif risk > 0.4:
    print("Action: Monitor and notify customer")
else:
    print("Action: Low risk")
