import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingWatch, setEditingWatch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    type: '',
    description: '',
    price: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  const token = localStorage.getItem('token');

  // Fetch all watches
  const fetchWatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://wristwatch-app-backend.onrender.com/api/watches');
      
      if (response.data.success) {
        setWatches(response.data.data);
        console.log('Watches loaded:', response.data.data);
      } else {
        toast.error('Failed to load watches');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Error fetching watches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('brand', formData.brand);
      submitData.append('type', formData.type);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingWatch) {
        // Update existing watch
        await axios.put(
          `https://wristwatch-app-backend.onrender.com/api/watches/${editingWatch._id}`,
          submitData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success('Watch updated successfully');
      } else {
        // Create new watch
        await axios.post(
          'https://wristwatch-app-backend.onrender.com/api/watches/create-watches',
          submitData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success('Watch created successfully');
      }

      resetForm();
      fetchWatches();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Error saving watch');
    }
  };

  const handleEdit = (watch) => {
    setEditingWatch(watch);
    setFormData({
      name: watch.name,
      brand: watch.brand,
      type: watch.type,
      description: watch.description,
      price: watch.price.toString(),
      image: null
    });
    setImagePreview(watch.imageUrl || `https://wristwatch-app-backend.onrender.com/uploads/${watch.image}`);
    setShowForm(true);
  };

  const handleDelete = async (watchId) => {
    if (!window.confirm('Are you sure you want to delete this watch?')) return;

    try {
      await axios.delete(
        `https://wristwatch-app-backend.onrender.com/api/watches/${watchId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Watch deleted successfully');
      fetchWatches();
    } catch (error) {
      toast.error('Error deleting watch');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingWatch(null);
    setFormData({
      name: '',
      brand: '',
      type: '',
      description: '',
      price: '',
      image: null
    });
    setImagePreview('');
  };

  // Function to get correct image URL
  const getImageUrl = (watch) => {
    if (watch.imageUrl) return watch.imageUrl;
    if (watch.image) return `https://wristwatch-app-backend.onrender.com/uploads/${watch.image}`;
    return 'https://via.placeholder.com/100x100?text=No+Image';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your watch inventory</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Add New Watch
            </button>
          </div>
        </div>

        {/* Watch Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingWatch ? 'Edit Watch' : 'Add New Watch'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Sport">Sport</option>
                      <option value="Smart">Smart</option>
                      <option value="Classic">Classic</option>
                      <option value="Digital">Digital</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image {!editingWatch && '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!editingWatch}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-32 w-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex-1"
                  >
                    {editingWatch ? 'Update Watch' : 'Create Watch'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-semibold flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Watches List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Watches ({watches.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading watches...
            </div>
          ) : watches.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No watches found. Click "Add New Watch" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {watches.map((watch) => (
                    <tr key={watch._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border"
                          src={getImageUrl(watch)}
                          alt={watch.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{watch.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {watch.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {watch.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {watch.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${watch.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(watch)}
                          className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(watch._id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;