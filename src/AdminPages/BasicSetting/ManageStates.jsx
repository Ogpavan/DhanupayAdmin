import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { fetchStatesList } from '../../api/stateListApi.js';
import StateTable from '../Tables/StateTable.jsx';

const ManageStates = () => {
  // Constants
  const token = Cookies.get("token");
  const userId = Cookies.get("UserId");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // State management
  const [states, setStates] = useState([]);
  const [newStateName, setNewStateName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Headers
  const getHeaders = useCallback(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  // Load states from API
  const loadStates = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchStatesList();
      setStates(data || []);
    } catch (error) {
      console.error("Failed to fetch states:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load states. Please try again.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize component
  useEffect(() => {
    loadStates();
  }, [loadStates]);

  // Create new state
  const handleCreateState = async () => {
    const trimmedName = newStateName.trim();
    
    if (!trimmedName) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid state name.',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/state/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          stateName: trimmedName
        })
      });

      const result = await response.json();
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: result.message || 'State created successfully',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        setNewStateName('');
        await loadStates();
      } else {
        throw new Error(result.message || 'Failed to create state');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create state. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit existing state
  const handleEditState = async (state) => {
    const { value: newName } = await Swal.fire({
      title: 'Edit State',
      text: 'Enter the new state name:',
      input: 'text',
      inputValue: state.StateName,
      inputPlaceholder: 'State name',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      inputValidator: (value) => {
        if (!value?.trim()) {
          return 'State name is required!';
        }
      }
    });

    if (!newName) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/state/update`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          stateId: state.StateId,
          stateName: newName.trim()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: result.message || 'State updated successfully',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        await loadStates();
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update state. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  // Delete state
  const handleDeleteState = async (stateId) => {
    const result = await Swal.fire({
      title: 'Delete State',
      text: 'Are you sure you want to delete this state? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/state/delete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          userId: parseInt(userId),
          stateId: parseInt(stateId)
        })
      });

      const apiResult = await response.json();
      
      if (apiResult.success) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: apiResult.message || 'State deleted successfully',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        await loadStates();
      } else {
        throw new Error(apiResult.message || 'Delete failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.message || 'Failed to delete state. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleCreateState();
  };

  return (
    <div className="h-screen max-h-screen bg-gray-50 p-4 overflow-hidden">
      <div className="max-w-full mx-auto h-full flex flex-col">
        
        {/* Compact Header - Fixed height */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">State Management</h1>
              <p className="text-sm text-gray-600">Manage states in your system</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total States</div>
              <div className="text-lg font-semibold text-blue-600">
                {isLoading ? '...' : states.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Flexible height using remaining space */}
        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">
            
            {/* Left Panel - Add State Form - Fixed width on desktop */}
            <div className="flex-shrink-0 lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 p-4">
              <div className="h-full flex flex-col">
                
                {/* Form Header */}
                <div className="flex-shrink-0 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Add New State</h2>
                  <p className="text-xs text-gray-600">Create a new state entry</p>
                </div>

                {/* Form Content */}
                <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State Name *
                      </label>
                      <input
                        type="text"
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
                        placeholder="Enter state name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !newStateName.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        'Add State'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Panel - States List - Takes remaining space */}
            <div className="flex-1 min-w-0 p-4 flex flex-col">
              
              {/* Table Header */}
              <div className="flex-shrink-0 flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">States List</h2>
                  <p className="text-xs text-gray-600">
                    {isLoading ? 'Loading...' : `${states.length} state(s) found`}
                  </p>
                </div>
                <button
                  onClick={loadStates}
                  disabled={isLoading}
                  className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 disabled:opacity-50"
                >
                  <svg className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>

              {/* Table Container - Uses all remaining space */}
              <div className="flex-1 min-h-0 overflow-hidden rounded-md border border-gray-200">
                <div className="h-full overflow-y-auto custom-scrollbar">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center space-y-3">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-gray-500">Loading states...</p>
                      </div>
                    </div>
                  ) : states.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center py-8">
                        <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 className="text-base font-medium text-gray-900 mb-1">No states found</h3>
                        <p className="text-sm text-gray-500">Get started by adding your first state.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full">
                      <StateTable
                        states={states}
                        handlestateEdit={handleEditState}
                        handlestateDelete={handleDeleteState}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Ensure the container takes full viewport height */
        .h-screen {
          height: 80vh !important;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 1024px) {
          .lg\\:w-80 {
            width: 100%;
            max-height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageStates;