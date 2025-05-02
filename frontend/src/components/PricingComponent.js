import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

    // Fetch scraped data on mount
    useEffect(() => {
      const fetchData = async () => {
        try {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      const response = await axios.post('http://localhost:3001/excel/export', { data: scrapedData });
      alert('Data submitted to server for Excel export.');
      console.log('Excel export response:', response.data);
      setScrapedData(response.data.data); // Update UI with enriched data
    } catch (err) {
      console.error('Error submitting data:', err);
      alert('Failed to export data to Excel.');
    }
  };

  // Submit to server: send scrapedData to /excel/export
  const handleSubmit = (e) => {

    handleExportToExcel()
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>New Product Entry</h2>
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
      <form onSubmit={handleUpdate}>
        {Object.keys(formData).map((key) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}
          >
            <label
              htmlFor={key}
              style={{
                width: '160px',
                marginRight: '1rem',
                textAlign: 'right'
              }}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              style={{ flex: '1', minWidth: '300px' }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <button type="submit">Update</button>
          <button type="button" onClick={async () => {
            await handleSubmit()
          }}>
            Submit to Server
          </button>
        </div>
      </form>

      <h2>All Data</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Competitor Price</th>
            <th>Rating</th>
            <th>Cost Base</th>
            <th>Target Margin</th>
            <th>Product Category</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(scrapedData) && scrapedData.map((item) => (
            <tr key={`${item.productName}-${item.competitorPrice}`}>             
              <td>{item.productName}</td>
              <td>{item.competitorPrice}</td>
              <td>{item.rating}</td>
              <td>{item.costBase}</td>
              <td>{item.targetMargin}</td>
              <td>{item.productCategory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PricingForm;