const fs = require("node:fs/promises");
const path = require("node:path");
const { scrapeWithTemplate } = require("./cheerioScraper"); // This does the cheerio scraping

/**
 * Loads a JSON template, performs the scrape, and optionally saves results.
 *
 * @param {string} templateFileName - Filename like 'ebay.json'
 * @param {string} query - Search term
 * @param {string} [outputPath='output/results.json'] - Where to save results
 * @returns {Promise<Array>} - Scraped results
 */
async function scraper(templateFileName, query, outputPath = "output/results.json") {
  try {
    const templatePath = path.join(__dirname, "..", "templates", path.basename(templateFileName));
    console.log(`📄 Loading template: ${templatePath}`);

    const fileContents = await fs.readFile(templatePath, "utf-8");

    let template;
    try {
      template = JSON.parse(fileContents);
    } catch (err) {
      throw new Error(`Invalid JSON in template: ${err.message}`);
    }

    // Basic validation
    const requiredKeys = ["url", "selector", "fields"];
    for (const key of requiredKeys) {
      if (!template[key]) {
        throw new Error(`Template must include '${key}'`);
      }
    }

    const results = await scrapeWithTemplate(template, query);

    // Optional save
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

    console.log(`📄 Returning Results: ${JSON.stringify(results)}`);

    return results;
  } catch (err) {
    console.error("❌ loadAndRunScraper error:", err.message);
    throw err;
  }
}

module.exports = { scraper };