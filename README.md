# 🧠 Unity Pricing Tool

A locally hosted application for a mid-sized consumer goods company that automates competitor pricing analysis, pricing recommendations, and executive summaries. Built with a React frontend, Node.js/Express backend, Excel spreadsheet integration, and OpenAI-powered summary generation.

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/richardhill/pricing-tool.git
cd pricing-tool
```

### 2. Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Copy the example `.env` file and provide your OpenAI API key:

```bash
cd ../backend
cp .env.example .env
# Edit .env and set OPENAI_API_KEY=your_key_here
```

### 4. Run the App

In one terminal, run the backend:

```bash
cd backend
node index.js
```

In another terminal, run the frontend:

```bash
cd frontend
npm start
```

This will open the app in your browser at `http://localhost:3000`.

---

## 🤖 LLM Integration

This project uses a **live OpenAI LLM API** via the `openai` npm package to generate CFO summaries based on updated pricing data.

---

## 🛠️ Technologies Used

- **Frontend:** React, Axios, CSS Modules
- **Backend:** Node.js, Express
- **Scraping:** scrape-it-forward
- **Spreadsheet Integration:** exceljs
- **LLM Integration:** OpenAI API

---

## 📦 Features

### ✅ Data Extraction
- Scrapes competitor pricing data (currently from eBay).
- Supports dynamic query terms and JSON-based scraping templates.

### ✅ Web-Based Form UI
- Built with React.
- Auto-populates dropdown from scraped data.
- Allows manual edits for:
  - Cost Base
  - Target Margin
  - Product Category
- Local update button saves changes in memory before sending to backend.
- Input validation and accessibility considerations.

### ✅ Spreadsheet Integration
- Submits enriched product data to the backend.
- Creates or updates a local Excel file.
- Performs calculations:
  - `Suggested Price = Cost Base × (1 + Target Margin)`
  - `Gross Margin = (Suggested Price - Cost Base) ÷ Suggested Price`

### ✅ CFO Summary (LLM Integration)
- After submitting, users can request a business summary.
- Calls OpenAI's API to generate a paragraph recommendation from scraped/enriched data.
- Displays response in a styled text area for review.

### ✅ User Experience
- Live loading spinner overlay for all async operations.
- Field-level form controls and aligned inputs.
- Buttons conditionally enabled based on app state.

---

## 📂 Project Structure

```
pricing-tool/
├── backend/
│   ├── index.js
│   ├── routes/
│   │   ├── scrape.js
│   │   ├── spreadsheet.js
│   │   └── summary.js
│   ├── services/
│   │   ├── scrapeService.js
│   │   ├── spreadsheetService.js
│   │   └── summaryService.js
│   ├── data/
│   │   └── pricing-output.xlsx
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PricingComponent.js
│   │   │   ├── LoadingOverlay.js
│   │   │   └── PricingComponent.css
│   │   └── App.js
│   └── package.json
│
└── README.md
```

🔮 Future Enhancements

🌍 Multi-Source Scraping
	•	Support additional marketplaces (e.g., Amazon, Walmart, AliExpress) by providing new templates.
	•	Allow users to choose data sources at runtime via the UI.
	•	Integrate automatic scheduling for daily/weekly re-scraping.

🧠 Smarter Pricing Engine
	•	Use historical pricing trends and competitor behavior to generate more intelligent pricing recommendations.
	•	Incorporate dynamic pricing models based on demand signals or stock levels.
	•	Add anomaly detection to flag unusually low/high competitor prices.