import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext.jsx';
import { ChartBar, Money, DeviceMobile } from 'phosphor-react';
import Swal from 'sweetalert2';
import ReportViewer from './ReportViewer/Reportviewer.jsx'; // ✅ Import the external component
import '../App.css';
function UserReports() {
  const { showLoader, hideLoader } = useLoader();
  const dummyData = [
    { title: 'AEPS Report', description: 'Aadhaar Enabled Payment System transaction details', icon: ChartBar },
    { title: 'MATM Report', description: 'Merchant ATM withdrawal details', icon: Money },
    { title: 'DMT Report', description: 'Domestic Money Transfer transactions', icon: Money },
    { title: 'Mobile Recharge Report', description: 'Details of mobile recharge transactions', icon: DeviceMobile },
  ];

  const [settingsData, setSettingsData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [modalVisible, setModalVisible] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportViewerVisible, setIsReportViewerVisible] = useState(false);

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      setSettingsData(dummyData);
      hideLoader();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDateSelection = () => {
    if (!fromDate || !toDate) {
      Swal.fire('Error', 'Please select both dates!', 'error');
      return;
    }

    const reportData = {
      title: selectedReport.title,
      description: selectedReport.description,
      fromDate,
      toDate,
    };

    setSelectedReport(reportData);
    setIsReportViewerVisible(true);
    setModalVisible(null);
  };

  const openModal = (index) => {
    setSelectedReport(settingsData[index]);
    setModalVisible(index);
  };

  const closeModal = () => {
    setModalVisible(null);
  };

  const goBackToReports = () => {
    setIsReportViewerVisible(false);
    setFromDate('');
    setToDate('');
  };

  return (
    <div className='"overflow-auto hide-scrollbar'>
      {!isReportViewerVisible ? (
        <>
          <h2 className="text-2xl font-semibold">Reports</h2>
          <p className="mt-2 text-gray-600">View Your All Reports Here</p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {settingsData.map((setting, index) => (
              <div
                key={index}
                onClick={() => openModal(index)}
                className="bg-white p-6 shadow cursor-pointer rounded-lg flex items-center space-x-4 hover:bg-gray-50 transition"
              >
                <setting.icon size={32} color="#4A90E2" />
                <div>
                  <h3 className="text-lg font-semibold">{setting.title}</h3>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <ReportViewer reportData={selectedReport} onBack={goBackToReports} />
      )}

      {modalVisible !== null && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">Select Date Range</h2>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                Cancel
              </button>
              <button onClick={handleDateSelection} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserReports;
