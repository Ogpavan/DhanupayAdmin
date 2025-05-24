import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CommissionTable from './CommissionTable'; // Adjust path as needed

const CommissionMaster = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const token = Cookies.get('token');
  const userid = Cookies.get('UserId');

  const dummyCommissionData = [
    {
      SlabFrom: 0,
      SlabTo: 500,
      Commission: 5,
      CommissionType: "Fixed",
      UserType: "Retailer",
    },
    {
      SlabFrom: 501,
      SlabTo: 1000,
      Commission: 0.5,
      CommissionType: "Percentage",
      UserType: "Retailer",
    },
    {
      SlabFrom: 1001,
      SlabTo: 2000,
      Commission: 10,
      CommissionType: "Fixed",
      UserType: "Distributor",
    },
  ];

  const fetchServices = async () => {
    try {
      const { data } = await axios.post(
        "https://gateway.dhanushop.com/api/Service/Services",
        {
          Action: "select",
          ServiceID: "N/A",
          CategoryID: "N/A",
          ServiceName: "Fetch",
          StatusChangeRemark: " ",
          CreatedBy: userid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const validServices = Array.isArray(data) ? data : [];
      setServices(validServices);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Map(
          validServices.map((item) => [item.CategoryID, item.CategoryName])
        ).entries()
      ).map(([CategoryID, CategoryName]) => ({ CategoryID, CategoryName }));

      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Fetch services error:", error);
    }
  };

  useEffect(() => {
    if (token && userid) {
      fetchServices();
    }
  }, [token, userid]);

  // Filter services by selected category
  const filteredServices = selectedCategory
    ? services.filter((s) => s.CategoryID === selectedCategory)
    : [];

  return (
    <div className="p-4 mx-auto">
      <h2 className="text-xl font-bold mb-4">Commission Management</h2>

      {/* Category Dropdown */}
      <div className='flex gap-x-10'>
      <div className="mb-4 max-w-sm">
        <label className="block mb-1 font-medium">Select Category</label>
        <select
          className="w-full border p-2 rounded shadow-sm"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedService('');
          }}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.CategoryID} value={cat.CategoryID}>
              {cat.CategoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Service Dropdown */}
      {selectedCategory && (
        <div className="mb-4 ">
          <label className="block mb-1 font-medium">Select Service</label>
          <select
            className="w-full border p-2 rounded shadow-sm"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">-- Select Service --</option>
            {filteredServices.map((service, index) => (
              <option key={index} value={service.ServiceID}>
                {service.ServiceName}
              </option>
            ))}
          </select>
        </div>
      )}
</div>
      {/* Show Commission Table only when service is selected */}
      {selectedService && (
        <CommissionTable data={dummyCommissionData} />
      )}
      
    </div>
  );
};

export default CommissionMaster;
