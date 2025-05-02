const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// You'll mount route files later here
const scrapeRoutes = require("./routes/scrape");
app.use("/scrape", scrapeRoutes);

const spreadsheetRoutes = require("./routes/spreadsheet");
app.use("/excel", spreadsheetRoutes);

const summaryRoute = require('./routes/summary');
app.use('/summary', summaryRoute);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});