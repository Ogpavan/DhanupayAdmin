import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CommissionTable from './CommissionTable'; // Adjust path as needed

const CommissionMaster = () => {
  const [services, setServices] = useState([]);
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
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch services error:", error);
    }
  };

  useEffect(() => {
    if (token && userid) {
      fetchServices();
    }
  }, [token, userid]);

  return (
    <div className="p-4  mx-auto">
      <h2 className="text-xl font-bold mb-4">Select a Service</h2>
      <select
        className="w-full border p-2 rounded shadow-sm max-w-sm"
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
      >
        <option value="">-- Select Service --</option>
        {services.map((service, index) => (
          <option key={index} value={service.ServiceID}>
            {service.ServiceName}
          </option>
        ))}
      </select>

      {selectedService && (
        <CommissionTable data={dummyCommissionData} />
      )}
    </div>
  );
};

export default CommissionMaster;
