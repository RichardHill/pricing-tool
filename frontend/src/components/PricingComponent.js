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
      let didCancel = false;
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3001/scrape/from-template?templatePath=ebay.json&query=toothbrush');
          console.log('Scraped data received:', response.data);
          const transformed = response.data.results.map(item => ({
              productName: item.name || '',
              competitorPrice: item.price?.replace(/[^0-9.]/g, '') || '',
              rating: '',
              costBase: '',
              targetMargin: '',
              productCategory: ''
            }));

            console.log("This is the transformed ", transformed)
            setScrapedData(transformed);
            console.log("Transformed scraped data:", transformed);
          
        } catch (error) {
          console.error('Error fetching scraped data:', error);
        }
      };

      fetchData();
      return () => {
        didCancel = true;
      };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setScrapedData(prev => [...prev, formData]);
    setFormData({
      productName: '',
      competitorPrice: '',
      rating: '',
      costBase: '',
      targetMargin: '',
      productCategory: ''
    });
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
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ marginBottom: '0.5rem' }}>
            <label htmlFor={key} style={{ marginRight: '1rem' }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Add Record</button>
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