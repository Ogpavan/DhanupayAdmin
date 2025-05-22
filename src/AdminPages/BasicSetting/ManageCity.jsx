import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { fetchStatesList } from '../../api/stateListApi.js';
import { fetchCitiesByState } from '../../api/CityListApi.js';
import CityTable from '../Tables/CityTable.jsx';
import Cookies from 'js-cookie';

const ManageCity = () => {
  const token = Cookies.get("token");
  const userId = Cookies.get("UserId");

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [addCity, setAddCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await fetchStatesList();
        setStates(data);
      } catch (error) {
        console.error("Failed to fetch states", error);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (!selectedState) return;
      setLoading(true);
      try {
        const data = await fetchCitiesByState(selectedState);
        setCities(data);
      } catch (error) {
        console.error("Failed to fetch cities", error);
      } finally {
        setLoading(false);
      }
    };
    loadCities();
  }, [selectedState]);

  const handleCreateCity = async () => {
    if (!addCity || !selectedState) return Swal.fire('Error', 'Please select state and enter city', 'error');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/city/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserId: parseInt(userId),
          CityName: addCity,
          StateId: parseInt(selectedState)
        })
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire('Success', data.message, 'success');
        setAddCity('');
        const cityData = await fetchCitiesByState(selectedState);
        setCities(cityData);
      } else {
        Swal.fire('Error', data?.message || 'Failed to create city', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'API error', 'error');
    }
  };

  const handleCityEdit = async (city) => {
    const { value: newCityName } = await Swal.fire({
      title: 'Edit City Name',
      input: 'text',
      inputValue: city.CityName,
      showCancelButton: true
    });

    if (newCityName) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/city/update`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: parseInt(userId),
            cityId: city.CityId,
            cityName: newCityName
          })
        });
        const result = await response.json();
        if (result.success) {
          Swal.fire('Success', result.message, 'success');
          const updatedCities = await fetchCitiesByState(selectedState);
          setCities(updatedCities);
        } else {
          Swal.fire('Error', result.message || 'Failed to update city', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Update failed', 'error');
      }
    }
  };

  const handleCityDelete = async (cityId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/city/delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          CityId: parseInt(cityId)
        })
      });
      const result = await response.json();
      if (result.success) {
        Swal.fire('Deleted!', result.message, 'success');
        const updatedCities = await fetchCitiesByState(selectedState);
        setCities(updatedCities);
      } else {
        Swal.fire('Error', result.message || 'Failed to delete city', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Delete failed', 'error');
    }
  };

 return (
    <div className="h-[80vh]  overflow-y-auto hide-scrollbar w-full ">
      {/* Header */}
      <div className="w-full bg-white shadow-sm border-b border-slate-200">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-900">City Management</h1>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full p-3">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full">
          
          {/* Left Panel - Add City Form */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-900 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New City
              </h2>
            </div>
            
            <div className="p-4 space-y-4">
              {/* State Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select State
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none"
                  >
                    <option value="">-- Select a State --</option>
                    {states.map(state => (
                      <option key={state.StateId} value={state.StateId}>
                        {state.StateName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* City Name Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  City Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={addCity}
                  onChange={(e) => setAddCity(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full px-3 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-slate-400"
                />
              </div>

              {/* Add Button */}
              <div className="pt-2">
                <button
                  onClick={handleCreateCity}
                  disabled={loading || !addCity || !selectedState}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add City
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Cities List */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Cities List
              </h2>
              {cities.length > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {cities.length} {cities.length === 1 ? 'city' : 'cities'}
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-hidden min-h-0">
              {selectedState ? (
                <div className="h-full overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-center">
                        <svg className="animate-spin h-6 w-6 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-slate-500">Loading cities...</p>
                      </div>
                    </div>
                  ) : cities.length > 0 ? (
                    <CityTable
                      cities={cities}
                      handleCityEdit={handleCityEdit}
                      handlecityDelete={handleCityDelete}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-slate-900">No cities found</h3>
                        <p className="mt-1 text-sm text-slate-500">No cities are registered for the selected state.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-slate-900">Select a state</h3>
                    <p className="mt-1 text-sm text-slate-500">Choose a state from the dropdown to view its cities.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCity;