const express = require("express");
const router = express.Router();
const { scraper } = require("../services/scraper");

router.get("/from-template", async (req, res) => {
  const { templatePath, query } = req.query;

  if (!templatePath || !query) {
    return res.status(400).json({ error: "Missing templatePath or query" });
  }

  try {
    const results = await scraper(templatePath, query);
    res.json({ count: results.length, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;