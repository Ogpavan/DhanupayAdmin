import React, { useState, useEffect } from "react"  ;

const Financial = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const jsonData = [
    {
      userType: "Master commission",
      verifyCharge: 0.0,
      slabs: Array(7).fill({ charge: 0.0, active: false }),
    },
    {
      userType: "Distributor commission",
      verifyCharge: 0.0,
      slabs: Array(7).fill({ charge: 0.0, active: false }),
    },
    {
      userType: "API Charge",
      verifyCharge: 0.0,
      slabs: Array(7).fill({ charge: 0.0, active: false }),
    },
    {
      userType: "WhiteLabel Charge",
      verifyCharge: 0.0,
      slabs: Array(7).fill({ charge: 0.0, active: false }),
    },
    {
      userType: "Purchase Charge",
      verifyCharge: 0.0,
      slabs: Array(7).fill({ charge: 0.0, active: false }),
    },
    {
      userType: "Retailer Charge",
      verifyCharge: 0.0,
      slabs: Array(7).fill({ charge: 0.0, active: false }),
    },
  ];

  useEffect(() => {
    // Load initial data
    setData(JSON.parse(JSON.stringify(jsonData))); // Deep copy to prevent shared reference issues
  }, []);

  const handleChange = (rowIndex, field, value, slabIndex = null) => {
    const updatedData = [...data];
    if (field === "verifyCharge") {
      updatedData[rowIndex].verifyCharge = parseFloat(value);
    } else if (field === "charge") {
      updatedData[rowIndex].slabs[slabIndex] = {
        ...updatedData[rowIndex].slabs[slabIndex],
        charge: parseFloat(value),
      };
    } else if (field === "active") {
      updatedData[rowIndex].slabs[slabIndex] = {
        ...updatedData[rowIndex].slabs[slabIndex],
        active: value,
      };
    }
    setData(updatedData);
  };

  const saveData = () => {
    setIsEditing(false);
    console.log("Saved data:", data);
  };

  return (
    <div className="p-4 text-sm">
      <div className="flex justify-end mb-2 gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={saveData}
          className="px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Save
        </button>
      </div>
      <table className="min-w-full border border-gray-400 text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">User Type</th>
            <th className="border p-2">Verify Charge (₹)</th>
            {[
  "Charge 100 > 1K",
  "Charge 1001 > 2K",
  "Charge 2001 > 3K",
  "Charge 3001 > 4K",
  "Charge 4001 > 5K",
  "Charge 5001 > 6K",
  "Charge 6001 > 7K",
].map((label, i) => (
  <th key={i} colSpan={2} className="border text-xs bg-gray-100">
    {label}
  </th>
))}

          </tr>
          <tr className="bg-gray-100 text-xs">
            <th></th>
            <th></th>
            {Array.from({ length: 7 }).flatMap((_, i) => [
              <th key={`c-${i}`} className="border p-1">Charge</th>,
              <th key={`a-${i}`} className="border p-1">Active</th>,
            ])}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              >
              <td className="border p-2">{row.userType}</td>
              <td className="border p-2">
                {isEditing ? (
                  <input
                    type="number"
                    value={row.verifyCharge}
                    onChange={(e) => handleChange(rowIdx, "verifyCharge", e.target.value)}
                    className="w-20 p-1 border rounded text-center"
                  />
                ) : (
                  row.verifyCharge.toFixed(4)
                )}
              </td>
              {row.slabs.map((slab, slabIdx) => (
                <React.Fragment key={slabIdx}>
                  <td className="border p-2">
                    {isEditing ? (
                      <input
                        type="number"
                        value={slab.charge}
                        onChange={(e) =>
                          handleChange(rowIdx, "charge", e.target.value, slabIdx)
                        }
                        className="w-20 p-1 border rounded text-center"
                      />
                    ) : (
                      slab.charge.toFixed(4)
                    )}
                  </td>
                  <td className="border p-2">
                    {isEditing ? (
                      <div className="flex justify-center gap-1">
                        <input
                          type="radio"
                          name={`active-${rowIdx}-${slabIdx}`}
                          checked={slab.active}
                          readOnly
                        />
                      </div>
                    ) : (
                      "₹"
                    )}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Financial;
