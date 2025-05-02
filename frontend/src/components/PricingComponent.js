import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingOverlay from './LoadingOverlay';
import './PricingComponent.css';

function PricingForm() {
  const [scrapedData, setScrapedData] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    competitorPrice: '',
    rating: '',
    costBase: '',
    targetMargin: '',
    productCategory: ''
  });
  const [summaryText, setSummaryText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

    // Fetch scraped data on mount
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:3001/scrape/from-template?templatePath=ebay.json&query=toothbrush');
          const transformed = response.data.results.map(item => ({
              productName: item.name || '',
              competitorPrice: item.price?.replace(/[^0-9.]/g, '') || '',
              rating: '',
              costBase: '',
              targetMargin: '',
              productCategory: ''
            }));

            setScrapedData(transformed);
          
        } catch (error) {
          console.error('Error fetching scraped data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

    }, []);

  useEffect(() => {
    console.log("scrapedData state updated:", scrapedData);
  }, [scrapedData]);

  const handleSelectChange = (e) => {
    const selectedProduct = scrapedData.find(item => item.productName === e.target.value);
    if (selectedProduct) {
      setFormData({ ...selectedProduct });
      console.log("Form data updated with:", selectedProduct);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      setIsDirty(true);
      return newData;
    });
  };

  // Update locally: replace selected product with formData
  const handleUpdate = (e) => {
    e.preventDefault();
    setScrapedData(prev => {
      const updated = prev.map(item =>
        item.productName.localeCompare(formData.productName) === 0 ? { ...formData } : item
      );

      const isNew = !prev.some(item => item.productName.localeCompare(formData.productName) === 0);
      const newData = isNew ? [...updated, formData] : updated;
      return newData.sort((a, b) => a.productName.localeCompare(b.productName));
    });
  };

  const handleExportToExcel = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/excel/export', { data: scrapedData });
      setScrapedData(response.data.data); // Update UI with enriched data
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting data:', err);
      alert('Failed to export data to Excel.');
    } finally {
      setLoading(false);
    }
  };

  // Submit to server: send scrapedData to /excel/export
  const handleSubmit = (e) => {

    handleExportToExcel()
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="pricing-form-container">
        <h2>Competitor Analysis</h2>
        <div className="form-group">
        <label htmlFor="productSelect" style={{ marginRight: '1rem' }}>Select Product:</label>
        {scrapedData.length === 0 ? (
          <p>Loading options...</p>
        ) : (
          <select id="productSelect" onChange={handleSelectChange}>
            <option value="">-- Choose a product --</option>
            {scrapedData
              .filter(item => item.productName && item.productName.trim() !== '')
              .map((item, index) => (
                <option key={`${item.productName}-${index}`} value={item.productName}>
                  {item.productName}
                </option>
              ))}
          </select>
        )}
        </div>
        <form onSubmit={handleUpdate}>
          {Object.keys(formData).map((key) => (
            <div
              key={key}
              className="form-group"
            >
              <label
                htmlFor={key}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="form-buttons">
            <button type="submit" disabled={loading || !isDirty}>Update</button>
            <button type="button" disabled={loading || !isDirty} onClick={async () => {
              await handleSubmit()
            }}>
              Submit to Server
            </button>
            <button
              type="button"
              disabled={!submitted}
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await axios.post('http://localhost:3001/summary', { data: scrapedData });
                  setSummaryText(response.data.summary);
                } catch (err) {
                  console.error('Error generating summary:', err);
                  alert('Failed to generate summary.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              Generate Summary
            </button>
          </div>
        </form>

        <div style={{ padding: '1rem' }}>
          <label htmlFor="summary">CFO Summary:</label>
          <textarea
            id="summary"
            value={summaryText}
            readOnly
            rows={6}
          />
        </div>
      </div>
    </>
  );
}

export default PricingForm;