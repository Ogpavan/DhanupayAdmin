import React, { useState } from 'react';
import Swal from 'sweetalert2';

const dummyUserTypes = ['WhiteLabel', 'SuperDistributor', 'Distributor', 'Retailer'];

const dummySlabs = [
  { from: 301, to: 999 },
  { from: 1000, to: 1499 },
  { from: 1500, to: 1999 },
  { from: 2000, to: 2499 },
  { from: 2500, to: 10000 }
];

const CommissionTable = () => {
  const [commissionData, setCommissionData] = useState(
    dummySlabs.map((slab) => ({
      ...slab,
      type: 'Fixed',
      charges: '0',
      chargesType: 'Fixed',
      active: true,
      commissions: {
        WhiteLabel: '0',
        SuperDistributor: '0',
        Distributor: '0',
        Retailer: '0'
      }
    }))
  );

  const [isEditing, setIsEditing] = useState(false);
  const [inputErrors, setInputErrors] = useState({});

  const handleChargesChange = (index, value) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...commissionData];
      updated[index].charges = value;
      setCommissionData(updated);
    }
  };

  const handleCommissionChange = (index, userType, value) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...commissionData];
      updated[index].commissions[userType] = value;
      setCommissionData(updated);
    }
  };

  const handleChargesTypeChange = (index, value) => {
    const updated = [...commissionData];
    updated[index].chargesType = value;
    setCommissionData(updated);
  };

  const handleTypeToggle = (index, value) => {
    const updated = [...commissionData];
    updated[index].type = value;
    setCommissionData(updated);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      const newErrors = {};
      let hasAnyError = false;

      const sanitized = commissionData.map((row, rowIndex) => {
        let rowError = false;

        // Charges
        const cleanCharges = row.charges === '' ? '0' : row.charges;
        if (row.charges === '') {
          newErrors[`charges-${rowIndex}`] = true;
          hasAnyError = rowError = true;
        }

        const parsedCharges =
          row.chargesType === 'Percentage'
            ? Math.min(Math.max(parseFloat(cleanCharges), 0), 100).toFixed(2)
            : parseFloat(cleanCharges).toFixed(2);

        // Commissions
        const cleanCommissions = Object.fromEntries(
          Object.entries(row.commissions).map(([key, val]) => {
            const safeVal = val === '' ? '0' : val;
            if (val === '') {
              newErrors[`commission-${rowIndex}-${key}`] = true;
              hasAnyError = rowError = true;
            }

            const parsedVal =
              row.type === 'Percentage'
                ? Math.min(Math.max(parseFloat(safeVal), 0), 100).toFixed(2)
                : parseFloat(safeVal).toFixed(2);

            return [key, parsedVal];
          })
        );

        return {
          ...row,
          charges: parsedCharges,
          commissions: cleanCommissions
        };
      });

      setInputErrors(newErrors);

      if (hasAnyError) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Slab',
          text: 'Some slabs have empty fields. Please complete them before saving.',
          confirmButtonColor: '#f59e0b'
        });

        const firstErrorKey = Object.keys(newErrors)[0];
        const el = document.querySelector(`[data-error-id="${firstErrorKey}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        return;
      }

      console.log('Commission JSON:', JSON.stringify(sanitized, null, 2));

      Swal.fire({
        icon: 'success',
        title: 'Slabs Saved',
        text: 'All slabs have been successfully saved!',
        confirmButtonColor: '#2563eb'
      });

      setIsEditing(false);
      return;
    }

    setInputErrors({});
    setIsEditing(true);
  };

  return (
    <div className="overflow-x-auto  relative">
      <div className="absolute right-0 top-0 mb-2">
        <button
          onClick={handleEditToggle}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <table className="min-w-full mt-12 text-sm border bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Operators</th>
            <th className="border px-4 py-2">Charges</th>
            <th className="border px-4 py-2">Type</th>
            {dummyUserTypes.map((user) => (
              <th key={user} className="border px-4 py-2 text-center">
                {user}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {commissionData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center font-medium text-gray-700">
                ₹{row.from} - ₹{row.to}
              </td>

              {/* Charges */}
              <td className="border px-4 py-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={row.charges}
                      data-error-id={`charges-${idx}`}
                      onChange={(e) => handleChargesChange(idx, e.target.value)}
                      disabled={!isEditing}
                      className={`w-20 border rounded px-2 py-1 pr-5 disabled:bg-gray-100 ${
                        inputErrors[`charges-${idx}`] ? 'border-red-500' : ''
                      }`}
                    />
                    {row.chargesType === 'Percentage' && (
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        %
                      </span>
                    )}
                  </div>
                  <select
                    value={row.chargesType}
                    onChange={(e) => handleChargesTypeChange(idx, e.target.value)}
                    disabled={!isEditing}
                    className="border rounded px-2 py-1 disabled:bg-gray-100"
                  >
                    <option value="Fixed">₹</option>
                    <option value="Percentage">%</option>
                  </select>
                </div>
              </td>

              {/* Commission Type Selector */}
              <td className="border px-4 py-2 text-center">
                <select
                  value={row.type}
                  onChange={(e) => handleTypeToggle(idx, e.target.value)}
                  disabled={!isEditing}
                  className="border rounded px-2 py-1 disabled:bg-gray-100"
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </td>

              {/* Commission Inputs */}
              {dummyUserTypes.map((user) => (
                <td key={user} className="border px-2 py-1 text-center">
                  <div className="relative">
                    <input
                      type="text"
                      value={row.commissions[user]}
                      data-error-id={`commission-${idx}-${user}`}
                      onChange={(e) => handleCommissionChange(idx, user, e.target.value)}
                      disabled={!isEditing}
                      className={`w-20 border rounded px-2 py-1 pr-5 disabled:bg-gray-100 ${
                        inputErrors[`commission-${idx}-${user}`] ? 'border-red-500' : ''
                      }`}
                    />
                    {row.type === 'Percentage' && (
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        %
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommissionTable;
