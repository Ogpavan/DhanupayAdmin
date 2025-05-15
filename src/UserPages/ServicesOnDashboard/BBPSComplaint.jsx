

import React, { useState } from 'react';
import Swal from 'sweetalert2';

function BBPSComplaint() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        transactionType: '',
        transactionId: '',
        complaint: '',
    });

    const [complainId, setComplainId] = useState('');
    const [activeTab, setActiveTab] = useState('query'); // query, raise, status
    const [activeTabs, setActiveTabs] = useState('transaction'); // query, raise, status
    const [selectedReason, setSelectedReason] = useState("");
    const [complaintText, setComplaintText] = useState("");

    const [mobileNumber, setMobileNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupraisetransection, setshowPopupraisetransection] = useState(false);
    const [showPopupquerytransection, setshowPopupquerytransection] = useState(false);


    const [activeComplaintss, setActiveComplaintss] = useState([]);
    const [activeTabstatus, setActiveTabstatus] = useState('transaction');
    const [searchPerformed, setSearchPerformed] = useState(false);




    const handleComplaintSubmit = () => {
    if (!selectedReason || !complaintText.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Fields',
            text: 'Please fill all required fields.',
        });
        return;
    }

    // You can dynamically generate complaint number if needed
    const complaintNo = 'CP175';

    // Show confirmation with details
    Swal.fire({
    title: 'Complaint Submitted',
    imageUrl: '/bharat-connect.png',
    imageWidth: 120,
    // imageHeight: 80,
    imageAlt: 'Bharat Connect Logo',
    html: `
        <p><strong>Complaint No:</strong> ${complaintNo}</p>
        <p><strong>Reason:</strong> ${selectedReason}</p>
        <p><strong>Complaint:</strong> ${complaintText}</p>
        <p><strong>Transaction ID:</strong> ${transactionDetails?.contactBillNo}</p>
    `,
    confirmButtonText: 'OK',
});

    // Optionally close modal
    setshowPopupraisetransection(false);
};

    const handlestatusSearch = () => {
        if (complainId.trim()) {
            setActiveComplaintss([sampleComplaint]);
            setSearchPerformed(true);
        } else {
            setActiveComplaintss([]);
            setSearchPerformed(false);
        }
    };
    // Dummy data for status table
    // const activeComplaints = [
    //     {
    //         complainId: 'CP175',
    //         reason: 'TXN PENDING',
    //         complaint: 'not paid bill yet',
    //         status: 'Working On',
    //         reply: '',
    //     },
    //     {
    //         complainId: 'CP180',
    //         reason: 'WRONG AMOUNT',
    //         complaint: 'Amount charged incorrect',
    //         status: 'Resolved',
    //         reply: 'Refund initiated',
    //     },
    // ];

    const sampleComplaint = {
        complainId: 'CPI75',
        reason: 'TXN PENDING',
        complaint: 'not paid bill yet',
        status: 'Working On',
        reply: ''
    };

    // Sample transaction details for the popup
    const transactionDetails = {
        status: 'SUCCESS',
        userName: 'Sundarlyer',
        amount: '760.0/-',
        contactBillNo: '10026/10672',
        serviceType: 'ELECTRICITY',
        billDate: '01 May 2025',
        remark: '10026/10672 - 760 - ELECTRICITY - Tamil Nadu Electricity Board (TNEB)',
        rrnNo: 'BHRTX84134711',
        billPaymentDate: '14 May 2025'
    };


    const handleSearch = () => {
        // if (complainId.trim()) {
        //   setActiveComplaintss([transactionDetails]);
        //   setSearchPerformed(true);
        // Show transaction details popup
        setshowPopupquerytransection(true);
        // } else {
        // //   setActiveComplaintss([]);
        //   setSearchPerformed(false);
        // }
    };

    const handleraiseComplaintSearch = () => {
        // if (complainId.trim()) {
        //   setActiveComplaintss([transactionDetails]);
        //   setSearchPerformed(true);
        // Show transaction details popup
        setshowPopupraisetransection(true);
        // } else {
        // //   setActiveComplaintss([]);
        //   setSearchPerformed(false);
        // }
    };
    const closePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value.trimStart();

        if (name === 'name') {
            sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s]/g, '');
        }

        if (name === 'phone') {
            sanitizedValue = sanitizedValue.replace(/[^0-9]/g, '').slice(0, 10);
        }

        if (name === 'complainId') {
            sanitizedValue = sanitizedValue.toUpperCase();
        }

        setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
        if (name === 'complainId') setComplainId(sanitizedValue);
    };

    // Complain ID Search modal
    const handleSearchComplain = () => {
        if (!complainId) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Complaint ID',
                text: 'Please enter a Complaint ID to search.',
                confirmButtonColor: '#EF4444',
            });
            return;
        }

        // Here, you can add your API call to fetch complaint by ID.
        // For demo, we show static data if matches CP175, else not found.

        if (complainId === 'CP175') {
            Swal.fire({
                title: 'Complaint Details',
                html: `
          <table style="width:100%; text-align:left; border-collapse: collapse;">
            <tbody>
              <tr><td><strong>Complaint ID</strong></td><td>CP175</td></tr>
              <tr><td><strong>Reason</strong></td><td>TXN PENDING</td></tr>
              <tr><td><strong>Complaint</strong></td><td>not paid bill yet</td></tr>
              <tr><td><strong>Status</strong></td><td>Working On</td></tr>
              <tr><td><strong>Reply</strong></td><td>Pending</td></tr>
            </tbody>
          </table>
        `,
                confirmButtonText: 'Close',
                customClass: { popup: 'p-6 text-left' },
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Not Found',
                text: `No complaint found with ID ${complainId}`,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const transactionIdRegex = /^[a-zA-Z0-9\-_.]{5,}$/;

        for (const key in form) {
            if (form[key].trim() === '') {
                Swal.fire({
                    title: 'Missing Fields',
                    text: 'Please fill out all fields before submitting.',
                    icon: 'warning',
                    confirmButtonColor: '#EF4444',
                });
                return;
            }
        }

        if (!nameRegex.test(form.name)) {
            Swal.fire({
                title: 'Invalid Name',
                text: 'Name should only contain letters and spaces (2-50 characters).',
                icon: 'error',
            });
            return;
        }

        if (!phoneRegex.test(form.phone)) {
            Swal.fire({
                title: 'Invalid Phone Number',
                text: 'Please enter a valid 10-digit Indian mobile number starting with 6-9.',
                icon: 'error',
            });
            return;
        }

        if (!transactionIdRegex.test(form.transactionId)) {
            Swal.fire({
                title: 'Invalid Transaction ID',
                text: 'Transaction ID should be at least 5 characters and only include letters, numbers, dash, underscore, or dot.',
                icon: 'error',
            });
            return;
        }

        Swal.fire({
            title: 'Complaint Submitted!',
            text: 'We have received your complaint. Our team will contact you shortly.',
            icon: 'success',
            confirmButtonColor: '#10B981',
        });

        setForm({
            name: '',
            email: '',
            phone: '',
            transactionType: '',
            transactionId: '',
            complaint: '',
        });
    };

    return (
        <div className="h-[78vh] flex flex-col overflow-scroll hide-scrollbar">
            {/* Header */}
            <header className="bg-teal-500 p-4 flex justify-between rounded-lg items-center text-white">
                <h1 className="text-lg font-semibold">Bill Complaint</h1>
                <img
                    src="/bharat-connect.png"
                    alt="Bharat Connect"
                    className="h-10"
                    draggable={false}
                />
            </header>

            {/* Main content */}
            <div className="flex flex-grow bg-gray-100">
                {/* Sidebar */}
                <aside className="w-48 bg-white border-r border-gray-300 py-4">
                    <ul className="flex flex-col">
                        {[
                            { id: 'query', label: 'Query Transaction' },
                            { id: 'raise', label: 'Raise Complaint' },
                            { id: 'status', label: 'Check Complainy Status' },
                        ].map((tab) => (
                            <li
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`cursor-pointer px-4 py-2 mb-1 text-sm rounded-l-md ${activeTab === tab.id
                                    ? 'bg-teal-500 text-white font-semibold'
                                    : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Content area */}
                <main className="flex-grow p-6 bg-white">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">
                            {activeTab === 'query' && 'Query Transaction'}
                            {activeTab === 'raise' && 'Raise Complaint'}
                            {activeTab === 'status' && 'Check Complaint Status'}
                        </h2>
                    </div>

                    {/* Query Tab */}
                    {activeTab === 'query' && (
                        <div className="max-w-4xl bg-gray-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Search Transaction</h3>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        placeholder="Enter Mobile Number"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="flex gap-2 mb-2">
                                    <div className="flex items-center justify-center px-3 py-2 bg-gray-100 border rounded-md">
                                        <span className="text-gray-500 text-sm">📅</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        placeholder="Start date"
                                        className="flex-grow px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                                    />
                                    <div className="flex items-center">
                                        <span className="text-gray-500 text-sm px-2">To</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        placeholder="End date"
                                        className="flex-grow px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            <div className="relative mb-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-gray-50 px-4 text-sm text-gray-500">OR</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transaction ID
                                </label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Enter Transaction ID"
                                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex">
                                <button
                                    onClick={handleSearch}
                                    className="bg-teal-500 text-white px-8 py-2 rounded text-sm font-medium hover:bg-teal-600"
                                >
                                    SEARCH
                                </button>
                            </div>
                        </div>
                    )}


                    {showPopupquerytransection && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl p-4 max-w-md w-full">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h3 className="text-lg font-medium text-gray-800">Transaction Details</h3>
                                    <button
                                        onClick={() => setshowPopupquerytransection(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-px">
                                    <div className="grid grid-cols-3 border">
                                        <div className="p-2 border-r bg-gray-50 font-medium text-gray-700">Status</div>
                                        <div className="p-2 col-span-2 text-green-600 font-medium">{transactionDetails.status}</div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-t-0">
                                        <div className="p-2 border-r bg-gray-50 font-medium text-gray-700">UserName</div>
                                        <div className="p-2 col-span-2">{transactionDetails.userName}</div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-t-0">
                                        <div className="p-2 border-r bg-gray-50 font-medium text-gray-700">Amount</div>
                                        <div className="p-2 col-span-2">{transactionDetails.amount}</div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-t-0">
                                        <div className="p-2 border-r bg-gray-50 font-medium text-gray-700">Contact/Bill No</div>
                                        <div className="p-2 col-span-2">{transactionDetails.contactBillNo}</div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-t-0">
                                        <div className="p-2 border-r bg-gray-50 font-medium text-gray-700">Service Type</div>
                                        <div className="p-2 col-span-2">{transactionDetails.serviceType}</div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-t-0">
                                        <div className="p-2 border-r bg-gray-50 font-medium text-gray-700">Bill Date</div>
                                        <div className="p-2 col-span-2">{transactionDetails.billDate}</div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-t-0">
                                        <div className="p-2 border-r bg-gray-50 font-medium text-gray-700">Remark</div>
                                        <div className="p-2 col-span-2">{transactionDetails.remark}</div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-t-0">
                                        <div className="p-2 border-r bg-gray-50 font-medium text-gray-700">B-Connect Txn ID </div>
                                        <div className="p-2 col-span-2">{transactionDetails.rrnNo}</div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-t-0">
                                        <div className="p-2 border-r bg-gray-50 font-medium text-gray-700">Bill Payment Date</div>
                                        <div className="p-2 col-span-2">{transactionDetails.billPaymentDate}</div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setshowPopupquerytransection(false)}


                                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded text-sm font-medium hover:bg-gray-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}






                    {/* Raise Complain Tab */}
                    {activeTab === 'raise' && (
                        <div className="max-w-4xl bg-gray-50 p-4 rounded-md shadow-sm">
                            {/* Tabs */}
                            <div className="flex mb-4 border-b">
                                <button
                                    className={`px-6 py-2 text-sm font-medium transition-colors duration-200 ${activeTabs === 'transaction'
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                    onClick={() => setActiveTabs('transaction')}
                                >
                                    Transaction
                                </button>
                                <button
                                    className={`px-6 py-2 text-sm font-medium transition-colors duration-200 ${activeTabs === 'service'
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                    onClick={() => setActiveTabs('service')}
                                >
                                    Service
                                </button>
                            </div>

                            {/* Search Form */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        placeholder="Enter Mobile Number"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="flex gap-2 mb-2">
                                    <div className="flex items-center justify-center px-3 py-2 bg-gray-100 border rounded-md">
                                        <span className="text-gray-500 text-sm">📅</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        placeholder="Start date"
                                        className="flex-grow px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                                    />
                                    <div className="flex items-center">
                                        <span className="text-gray-500 text-sm px-2">To</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        placeholder="End date"
                                        className="flex-grow px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            <div className="relative mb-3">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-gray-50 px-4 text-sm text-gray-500">OR</span>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                   B-Connect Txn ID
                                </label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Enter Transaction ID"
                                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex">
                                <button
                                    onClick={handleraiseComplaintSearch}
                                    className="bg-teal-500 text-white px-8 py-2 rounded text-sm font-medium hover:bg-teal-600"
                                >
                                    SEARCH
                                </button>
                            </div>
                        </div>
                    )}
                   {showPopupraisetransection && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-1">
        <div className="bg-white rounded-lg shadow-xl p-2 sm:p-3 max-w-md w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-screen overflow-y-auto text-xs sm:text-sm">
            <div className="flex justify-between items-center mb-2 border-b pb-1">
                <h3 className="text-sm font-semibold text-gray-800">Transaction Details</h3>
                <button
                    onClick={() => setshowPopupraisetransection(false)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="space-y-px">
                {[
                    { label: "Status", value: transactionDetails.status, className: "text-green-600" },
                    { label: "UserName", value: transactionDetails.userName },
                    { label: "Amount", value: transactionDetails.amount },
                    { label: "Contact/Bill No", value: transactionDetails.contactBillNo },
                    { label: "Service Type", value: transactionDetails.serviceType },
                    { label: "Bill Date", value: transactionDetails.billDate },
                    { label: "Remark", value: transactionDetails.remark },
                    { label: "B-Connect Txn ID", value: transactionDetails.rrnNo },
                    { label: "Bill Payment Date", value: transactionDetails.billPaymentDate },
                ].map((item, index) => (
                    <div key={index} className={`grid grid-cols-3 border ${index !== 0 ? 'border-t-0' : ''}`}>
                        <div className="p-1 border-r bg-gray-50 font-medium text-gray-700">{item.label}</div>
                        <div className={`p-1 col-span-2 ${item.className || ''}`}>{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Reason <span className="text-red-500">*</span>
                </label>
                <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">Select a reason</option>
                    <option value="TXN PENDING">TXN PENDING</option>
                    <option value="WRONG AMOUNT">WRONG AMOUNT</option>
                    <option value="SERVICE NOT RECEIVED">SERVICE NOT RECEIVED</option>
                </select>
            </div>

            <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Complaint <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={2}
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    className="w-full border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter complaint..."
                />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                    onClick={handleComplaintSubmit}
                    className="bg-teal-500 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-teal-600"
                >
                    COMPLAINT
                </button>
                <button
                    onClick={() => setshowPopupraisetransection(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded text-xs font-medium hover:bg-gray-300"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}



                    {/* Popup for complaint done successfully */}
                    {showPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Transaction Details</h3>
                                    <button
                                        onClick={closePopup}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                                        <p className="font-medium">{transactionId || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                                        <p className="font-medium">{mobileNumber || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Status</p>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Success</span>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Date</p>
                                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={closePopup}
                                        className="w-full bg-teal-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}




                    {/* Status Tab */}
                    {activeTab === 'status' && (
                        <div className="max-w-6xl bg-gray-50 rounded-md shadow-sm">
                            {/* Tabs */}
                            <div className="flex">
                                <button
                                    className={`px-6 py-2 text-sm font-medium transition-colors duration-200 ${activeTabs === 'transaction'
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                    onClick={() => setActiveTabs('transaction')}
                                >
                                    Transaction
                                </button>
                                <button
                                    className={`px-6 py-2 text-sm font-medium transition-colors duration-200 ${activeTabs === 'service'
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                    onClick={() => setActiveTabs('service')}
                                >
                                    Service
                                </button>
                            </div>

                            <div className="p-6 border-t">
                                {/* Search Form */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <span className="text-red-500">*</span> Complaint ID
                                    </label>
                                    <div className="flex gap-4 items-center">
                                        <input
                                            type="text"
                                            value={complainId}
                                            onChange={(e) => setComplainId(e.target.value.toUpperCase())}
                                            placeholder="Enter Complaint ID"
                                            className="flex-grow px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                                        />
                                        <button
                                            onClick={handlestatusSearch}
                                            className="bg-teal-500 text-white px-6 py-2 rounded text-sm font-medium hover:bg-teal-600"
                                        >
                                            SEARCH
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-300 my-6"></div>

                                {/* Results Table */}
                                {searchPerformed && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm border border-gray-300">
                                            <thead className="bg-gray-200">
                                                <tr>
                                                    <th className="p-2 border border-gray-300">Complaint ID</th>
                                                    <th className="p-2 border border-gray-300">Reason</th>
                                                    <th className="p-2 border border-gray-300">Complaint</th>
                                                    <th className="p-2 border border-gray-300">Status</th>
                                                    <th className="p-2 border border-gray-300">Reply</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activeComplaintss.map((comp) => (
                                                    <tr key={comp.complainId} className="odd:bg-white even:bg-gray-100">
                                                        <td className="p-2 border border-gray-300 font-mono text-teal-700">
                                                            {comp.complainId}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">{comp.reason}</td>
                                                        <td className="p-2 border border-gray-300">{comp.complaint}</td>
                                                        <td className="p-2 border border-gray-300 font-semibold text-blue-700">
                                                            {comp.status}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">{comp.reply || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Empty state */}
                                {searchPerformed && activeComplaintss.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No complaints found with the given ID.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );


}

export default BBPSComplaint;
