const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// You'll mount route files later here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});