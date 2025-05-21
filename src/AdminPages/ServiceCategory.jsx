import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



const ServiceCategory = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    Action: '1',
    CategoryID: '',
    CategoryName: '',
    StatusChangeRemark: '',
    CreatedBy: ''
  });
  const [showModal, setShowModal] = useState(false);
  
  const token = Cookies.get('token');
  const userid = Cookies.get('UserId');
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(prev => ({ ...prev, CreatedBy: userid }));
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://gateway.dhanushop.com/api/Service/Servicecategory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Action: 'select',
          CategoryID: '',
          CategoryName: 'BBPS',
          StatusChangeRemark: '',
          CreatedBy: userid
        })
      });

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.CategoryName.trim()) {
      Swal.fire('Error', 'Please enter a category name.');
      return false;
    }
    return true;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('https://gateway.dhanushop.com/api/Service/Servicecategory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, CreatedBy: userid, Action: 'insert' })
      });

      const result = await response.json();
      Swal.fire('Success!', result.message || 'Category added');
      fetchCategories();
      closeModal();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const openModal = () => {
    setFormData({
      Action: '1',
      CategoryID: '',
      CategoryName: '',
      StatusChangeRemark: '',
      CreatedBy: userid
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Service Categories</h1>
        <div className='space-x-2'> 
        <button onClick={() => navigate('/admin/servicepage')} className="bg-blue-600 text-white px-4 py-2 rounded">
          View all Services
        </button>
        <button onClick={openModal} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Category
        </button>
        </div>
      </div>

      {/* Table */}
 {/* Table */}
<div className="overflow-x-auto bg-white p-4 rounded  ">
  <table className="w-full table-auto border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-200 text-left">
        <th className="border p-2 w-20">S.No.</th>
        <th className="border p-2">Category Name</th>
      </tr>
    </thead>
    <tbody>
      {categories.map((cat, idx) => (
        <tr key={idx} className="text-sm text-left">
          <td className="border p-2 text-center">{idx + 1}</td>
          <td className="border p-2">{cat.CategoryName}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Category Name *</label>
                <input
                  type="text"
                  name="CategoryName"
                  value={formData.CategoryName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCategory;
