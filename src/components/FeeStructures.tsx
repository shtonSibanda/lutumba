import React, { useState } from 'react';
import { FeeStructure, FeeItem } from '../types';
import { sampleFeeStructures } from '../utils/sampleData';

const FeeStructures: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(sampleFeeStructures);
  const [showModal, setShowModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const [formData, setFormData] = useState<Partial<FeeStructure>>({
    name: '',
    class: '',
    academicYear: '',
    items: []
  });
  const [itemForm, setItemForm] = useState<Partial<FeeItem>>({ description: '', amount: 0 });

  const handleAddStructure = () => {
    setEditingStructure(null);
    setFormData({ name: '', class: '', academicYear: '', items: [] });
    setShowModal(true);
  };

  const handleEditStructure = (structure: FeeStructure) => {
    setEditingStructure(structure);
    setFormData(structure);
    setShowModal(true);
  };

  const handleDeleteStructure = (id: string) => {
    setFeeStructures(feeStructures.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStructure: FeeStructure = {
      ...formData,
      id: editingStructure?.id || Date.now().toString(),
      items: formData.items || []
    } as FeeStructure;
    if (editingStructure) {
      setFeeStructures(feeStructures.map(f => f.id === newStructure.id ? newStructure : f));
    } else {
      setFeeStructures([...feeStructures, newStructure]);
    }
    setShowModal(false);
    setEditingStructure(null);
    setFormData({ name: '', class: '', academicYear: '', items: [] });
  };

  const handleAddItem = () => {
    if (!itemForm.description || !itemForm.amount) return;
    setFormData({
      ...formData,
      items: [...(formData.items || []), { ...itemForm, id: Date.now().toString() } as FeeItem]
    });
    setItemForm({ description: '', amount: 0 });
  };

  const handleDeleteItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: (formData.items || []).filter(item => item.id !== itemId)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Fee Structure Management</h1>
        <button
          onClick={handleAddStructure}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Fee Structure
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeStructures.map(structure => (
          <div key={structure.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{structure.name}</h2>
            <p className="text-gray-600">Class: {structure.class}</p>
            <p className="text-gray-600">Academic Year: {structure.academicYear}</p>
            <ul className="mt-2 space-y-1">
              {structure.items.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>{item.description}</span>
                  <span>${item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleEditStructure(structure)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteStructure(structure.id)}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingStructure ? 'Edit Fee Structure' : 'Add Fee Structure'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input
                    type="text"
                    required
                    value={formData.class || ''}
                    onChange={e => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    required
                    value={formData.academicYear || ''}
                    onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Items</label>
                  <ul className="mb-2">
                    {(formData.items || []).map(item => (
                      <li key={item.id} className="flex justify-between items-center text-sm mb-1">
                        <span>{item.description} - ${item.amount?.toFixed(2)}</span>
                        <button type="button" onClick={() => handleDeleteItem(item.id!)} className="text-red-500 ml-2">Remove</button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={itemForm.description || ''}
                      onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      min="0"
                      value={itemForm.amount || 0}
                      onChange={e => setItemForm({ ...itemForm, amount: parseFloat(e.target.value) || 0 })}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button type="button" onClick={handleAddItem} className="bg-green-500 text-white px-3 py-2 rounded-lg">Add</button>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingStructure ? 'Update Structure' : 'Add Structure'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructures; 