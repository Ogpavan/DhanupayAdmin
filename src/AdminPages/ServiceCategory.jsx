import React, { useState } from 'react';

const ServiceCategory = () => {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle opening the modal
  const createService = () => {
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-row justify-between p-6 border-t-2 items-center">
        <div>
          <div className=''>Service Category</div>
        </div>
        <div>
          <button
            onClick={createService}
            className='px-4 py-2 bg-green-500 text-white rounded-md'
          >
            Add New Service Category
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-xl font-semibold">Add New Service Category</h2>

            {/* Form fields for adding service category */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Category Name</label>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter category name"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Category Description</label>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter category description"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal} // Close modal if Cancel is clicked
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCategory;
