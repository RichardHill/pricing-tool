const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Performs scraping based on the passed template and query.
 *
 * @param {Object} template - The scraping template
 * @param {string} query - The search term
 * @returns {Promise<Array>} - Array of extracted product objects
 */
async function scrapeWithTemplate(template, query) {
  const { url, selector, fields } = template;

  if (!url || !selector || !fields) {
    throw new Error("Template must include 'url', 'selector', and 'fields'");
  }

  const targetUrl = url.replace("{{query}}", encodeURIComponent(query));
  console.log(`🌐 Scraping: ${targetUrl}`);

  try {
    const { data: html } = await axios.get(targetUrl);
    const $ = cheerio.load(html);
    const results = [];

    $(selector).each((_, el) => {
      const result = {};

      for (const [fieldName, fieldConfig] of Object.entries(fields)) {
        const target = $(el).find(fieldConfig.selector);
        result[fieldName] = fieldConfig.attribute
          ? target.attr(fieldConfig.attribute) || ""
          : target.text().trim();
      }

      results.push(result);
    });

    return results;
  } catch (err) {
    console.error("❌ scrapeWithTemplate error:", err.message);
    throw new Error("Failed to scrape the target site");
  }
}

module.exports = { scrapeWithTemplate };