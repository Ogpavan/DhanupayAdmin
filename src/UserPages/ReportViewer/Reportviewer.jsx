import React, { useEffect, useState } from 'react';
 // Use jspdf-autotable for table formatting
import * as XLSX from 'xlsx';

const ReportViewer = ({ reportData, onBack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reportData) {
      const fetchReport = async () => {
        try {
          const response = await fetch('https://mocki.io/v1/fc14894a-e9e7-4d34-8554-58a1371974af');
          const result = await response.json();
          setData(result.transactions || []);
        } catch (error) {
          console.error('Error fetching report data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchReport();
    }
  }, [reportData]);

  if (!reportData) return <div>No report data provided.</div>;
  if (loading) return <div className="mt-6">Loading report...</div>;
  if (!data || data.length === 0) return <div className="mt-6">No transactions found for the selected date range.</div>;

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  return (
    <div className="p-4 h-[80vh] overflow-auto hide-scrollbar">
      <div className='flex justify-between'>
        <button
          onClick={onBack}
          className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back to Reports
        </button>
        <div className='flex gap-2'>
          <button
            onClick={generateExcel}
            className="mb-4 bg-green-200 text-gray-800 px-4 py-2 rounded hover:bg-green-500"
          >
            Export to Excel
          </button>
          <button
            onClick
            className="mb-4 bg-blue-200 text-gray-800 px-4 py-2 rounded hover:bg-blue-500"
          >
            Export to PDF
          </button>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow mt-2">
        <h2 className="text-2xl font-bold mb-2">{reportData.title}</h2>
        <p className="mb-4 text-gray-600">{reportData.description}</p>
        <p><strong>From:</strong> {reportData.fromDate}</p>
        <p><strong>To:</strong> {reportData.toDate}</p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 bg-white">
            <thead>
              <tr className="bg-gray-100">
                {headers.map(header => (
                  <th key={header} className="border px-4 py-2 text-left capitalize">
                    {header.replace(/([A-Z])/g, ' $1')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {headers.map(header => (
                    <td key={header} className="border px-4 py-2">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
