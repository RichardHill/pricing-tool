const express = require('express');
const router = express.Router();
const { generateExcelFile } = require('../services/spreadsheet');

router.post('/export', async (req, res) => {
    try {
      const dataArray = req.body.data;
      if (!Array.isArray(dataArray)) {
        return res.status(400).json({ error: 'Invalid data format. Expected an array.' });
      }
  
      const enrichedData = dataArray.map(item => {
        const cost = Number.parseFloat(item.costBase) || 0;
        const margin = Number.parseFloat(item.targetMargin) || 0;
        const suggestedPrice = cost * (1 + margin);
        const grossMargin = suggestedPrice ? ((suggestedPrice - cost) / suggestedPrice) : 0;
        return {
          ...item,
          suggestedPrice: suggestedPrice.toFixed(2),
          grossMargin: `${(grossMargin * 100).toFixed(1)}%`,
        };
      });
  
      const { filePath } = await generateExcelFile(enrichedData);
      res.status(200).json({ message: 'Excel file created.', filePath, data: enrichedData });
    } catch (error) {
      console.error('Error exporting Excel file:', error);
      res.status(500).json({ error: 'Failed to create Excel file' });
    }
  });

module.exports = router;


