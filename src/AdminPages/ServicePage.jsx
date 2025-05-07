import React, { useState, useEffect } from 'react';

const ServicePage = () => {
  // State to manage the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to manage the categories (simulating API data)
  const [categories, setCategories] = useState([]);

  // State to manage the selected category
  const [selectedCategory, setSelectedCategory] = useState('');

  // Function to handle opening the modal
  const createService = () => {
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Simulate an API call to fetch service categories
  useEffect(() => {
    // Simulated category data
    const fetchedCategories = [
      { id: 1, name: 'Web Development' },
      { id: 2, name: 'Mobile App Development' },
      { id: 3, name: 'Graphic Design' },
    ];
    
    // Simulate an API delay using setTimeout
    setTimeout(() => {
      setCategories(fetchedCategories);
    }, 1000);
  }, []);

  // Handle category selection change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <>
      <div className="flex flex-row justify-between p-6 border-t-2 items-center">
        <div>
          <div className=''>Service Page</div>
        </div>
        <div>
          <button
            onClick={createService}
            className='px-4 py-2 bg-green-500 text-white rounded-md'
          >
            Add New Service
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-xl font-semibold">Add New Service</h2>

            {/* Service Category Dropdown */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Service Category</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>


            {/* Service Name */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Service Name</label>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter service name"
              />
            </div>

            {/* Service Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Service Description</label>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter service description"
              />
            </div>

            
            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicePage;
