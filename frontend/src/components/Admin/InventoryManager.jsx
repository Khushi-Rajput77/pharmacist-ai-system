import React, { useState } from 'react';
import { medicineAPI } from '../../services/api';

function InventoryManager({ medicines, onUpdate }) {
  const [selectedMed, setSelectedMed] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!selectedMed || !quantity) return;

    setLoading(true);
    try {
      await medicineAPI.update(selectedMed._id, {
        currentStock: selectedMed.currentStock + parseInt(quantity)
      });
      setQuantity('');
      setSelectedMed(null);
      onUpdate();
      alert('Stock updated successfully!');
    } catch (error) {
      alert('Error updating stock: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-section">
      <h2>Manage Inventory</h2>
      
      <form className="stock-form" onSubmit={handleAddStock}>
        <div className="form-group">
          <label>Select Medicine:</label>
          <select
            value={selectedMed?._id || ''}
            onChange={(e) => {
              const med = medicines.find(m => m._id === e.target.value);
              setSelectedMed(med);
            }}
          >
            <option value="">-- Choose --</option>
            {medicines.map(med => (
              <option key={med._id} value={med._id}>
                {med.name} (Stock: {med.currentStock})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Add Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            min="1"
          />
        </div>

        <button type="submit" disabled={loading || !selectedMed || !quantity}>
          Update Stock
        </button>
      </form>
    </div>
  );
}

export default InventoryManager;