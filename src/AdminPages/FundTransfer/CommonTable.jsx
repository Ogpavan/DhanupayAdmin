import React from "react";

const Table = ({ headers, data }) => (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="border  bg-indigo-600 text-white">
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50">
            {headers.map((header, colIndex) => (
              <td key={colIndex} className="border ">
                {row[header.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  

export default Table;
