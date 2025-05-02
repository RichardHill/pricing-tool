# 🧠 Unity Pricing Tool

A locally hosted application for a mid-sized consumer goods company that automates competitor pricing analysis, pricing recommendations, and executive summaries. Built with a React frontend, Node.js/Express backend, Excel spreadsheet integration, and OpenAI-powered summary generation.

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pricing-tool.git
cd pricing-tool
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Add your OpenAI API key here
node index.js
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

### 4. Usage

- On first load, the app will scrape product data (from eBay by default).
- You can update product fields locally.
- Click **Update** to stage your changes.
- Click **Submit to Server** to save and compute pricing data in an Excel file.
- Click **Generate Summary** to get a CFO-style summary using OpenAI.


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

## 🛠️ Technologies Used

- **Frontend:** React, Axios, CSS Modules
- **Backend:** Node.js, Express
- **Scraping:** [scrape-it-forward](https://www.npmjs.com/package/scrape-it-forward)
- **Spreadsheet:** `exceljs`
- **LLM API:** OpenAI (via `openai` npm package)
- **Styling:** Custom CSS

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