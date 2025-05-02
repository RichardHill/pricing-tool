const ExcelJS = require('exceljs');
const path = require('node:path');
const fs = require('node:fs');

async function generateExcelFile(dataArray) {
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

  for (const data of dataArray) {
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
  }

  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, `pricing-${Date.now()}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  return {
    filePath,
  };
}

module.exports = {
  generateExcelFile,
};