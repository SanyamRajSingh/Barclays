export const customers = [
    {
        id: "CUST-001",
        name: "Acme Corp",
        stressScore: 85,
        riskLevel: "High",
        trend: "Increasing",
        loans: 3,
        totalExposure: "₹1.2Cr",
        history: [65, 68, 72, 75, 78, 82, 85],
        lastUpdated: "2023-10-27"
    },
    {
        id: "CUST-002",
        name: "Globex Inc",
        stressScore: 45,
        riskLevel: "Medium",
        trend: "Stable",
        loans: 1,
        totalExposure: "₹50L",
        history: [42, 43, 45, 44, 45, 45, 45],
        lastUpdated: "2023-10-26"
    },
    {
        id: "CUST-003",
        name: "Soylent Corp",
        stressScore: 12,
        riskLevel: "Low",
        trend: "Decreasing",
        loans: 2,
        totalExposure: "₹3.5Cr",
        history: [20, 18, 15, 14, 13, 12, 12],
        lastUpdated: "2023-10-25"
    },
    {
        id: "CUST-004",
        name: "Initech",
        stressScore: 92,
        riskLevel: "High",
        trend: "Rapid Increase",
        loans: 5,
        totalExposure: "₹8.0Cr",
        history: [70, 75, 80, 85, 88, 90, 92],
        lastUpdated: "2023-10-27"
    },
    {
        id: "CUST-005",
        name: "Umbrella Corp",
        stressScore: 25,
        riskLevel: "Low",
        trend: "Stable",
        loans: 10,
        totalExposure: "₹150Cr",
        history: [28, 27, 26, 25, 25, 25, 25],
        lastUpdated: "2023-10-27"
    }
];

export const stats = [
    { label: "Total Active Loans", value: "1,245", change: "+12%", status: "positive" },
    { label: "High Risk Customers", value: "85", change: "+5%", status: "negative" },
    { label: "Defaults Prevented", value: "32", change: "Last 30 days", status: "neutral" },
    { label: "Est. Savings", value: "₹4.5Cr", change: "+18%", status: "positive" }
];

export const interventions = [
    { id: 1, type: "Email Reminder", description: "Send automated payment reminder", effectiveness: "High" },
    { id: 2, type: "SMS Alert", description: "Send urgent SMS alert", effectiveness: "Medium" },
    { id: 3, type: "Call Adjustment", description: "Schedule call with relationship manager", effectiveness: "High" },
    { id: 4, type: "Restructure Offer", description: "Propose loan restructuring plan", effectiveness: "Medium" },
    { id: 5, type: "Legal Notice", description: "Send formal legal notice", effectiveness: "Low" }
];
