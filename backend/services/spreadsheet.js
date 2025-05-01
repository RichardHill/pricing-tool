

const ExcelJS = require('exceljs');
const path = require('node:path');
const fs = require('node:fs');

async function generateExcelFile(data) {
  const {
    productName,
    competitorPrice,
    rating,
    costBase,
    targetMargin,
    productCategory,
  } = data;

  const suggestedPrice = costBase * (1 + targetMargin);
  const grossMargin = ((suggestedPrice - costBase) / suggestedPrice) || 0;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Pricing Data');

  sheet.addRow([
    'Product Name',
    'Competitor Price',
    'Rating',
    'Cost Base',
    'Target Margin',
    'Suggested Price',
    'Gross Margin',
    'Category',
  ]);

  sheet.addRow([
    productName,
    competitorPrice,
    rating,
    costBase,
    targetMargin,
    suggestedPrice,
    grossMargin,
    productCategory,
  ]);

  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, `pricing-${Date.now()}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  return {
    filePath,
    suggestedPrice,
    grossMargin,
  };
}

module.exports = {
  generateExcelFile,
};