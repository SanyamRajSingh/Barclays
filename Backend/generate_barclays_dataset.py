import numpy as np
import pandas as pd

np.random.seed(42)
n = 50000

customer_id = [f"CUST{str(i).zfill(6)}" for i in range(1, n+1)]

monthly_income = np.random.normal(60000, 20000, n).clip(15000, 200000)

credit_score = (
    650 + (monthly_income - 60000)/500 +
    np.random.normal(0, 50, n)
).clip(300, 850)

emi_amount = (
    monthly_income * np.random.uniform(0.1, 0.4, n)
)

outstanding_balance = (
    emi_amount * np.random.uniform(6, 36, n)
)

avg_balance_3m = (
    monthly_income * np.random.uniform(0.3, 1.5, n)
)

balance_trend = np.random.uniform(-0.3, 0.3, n)

total_credit_30d = monthly_income + np.random.normal(0, 3000, n)

total_debit_30d = total_credit_30d * np.random.uniform(0.6, 1.1, n)

atm_withdrawals_30d = np.random.poisson(3, n)

salary_delay_days = np.random.choice(
    [0,1,2,3,5],
    size=n,
    p=[0.5,0.2,0.15,0.1,0.05]
)

emi_delay_days = np.maximum(
    0,
    salary_delay_days + np.random.normal(0,1,n)
).astype(int)

# KEY FIX: balanced risk formula
risk_score = (

    # Negative factors (reduce risk)
    - (credit_score - 650)/100
    - (avg_balance_3m / monthly_income)/2

    # Positive factors (increase risk)
    + (emi_amount / monthly_income) * 2
    + (outstanding_balance / (monthly_income * 24))
    + (-balance_trend)
    + (atm_withdrawals_30d / 8)
    + (salary_delay_days / 4)
    + (emi_delay_days / 4)

    # Noise
    + np.random.normal(0, 0.8, n)
)

prob = 1 / (1 + np.exp(-risk_score))

# Balanced classification thresholds
delinquent_flag = np.where(prob > 0.65, 1, 0)

df = pd.DataFrame({

    "customer_id": customer_id,
    "monthly_income": monthly_income,
    "credit_score": credit_score,
    "emi_amount": emi_amount,
    "outstanding_balance": outstanding_balance,
    "avg_balance_3m": avg_balance_3m,
    "balance_trend": balance_trend,
    "total_credit_30d": total_credit_30d,
    "total_debit_30d": total_debit_30d,
    "atm_withdrawals_30d": atm_withdrawals_30d,
    "salary_delay_days": salary_delay_days,
    "emi_delay_days": emi_delay_days,
    "delinquent_flag": delinquent_flag
})

df.to_csv("barclays_demo_dataset_50000.csv", index=False)

print("Dataset generated successfully")

print("\nRisk distribution:")
print(df["delinquent_flag"].value_counts(normalize=True))
