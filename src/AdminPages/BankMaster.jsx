import React, { useEffect, useState } from 'react';
import { Plus, Building2, X, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { BankListApi } from '../api/BankListApi';
import axios from 'axios';
import Cookies from "js-cookie";

// Allow alphabets, space, & (ampersand)
const validBankNameRegex = /^[A-Za-z\s&()]+$/;

function BankMaster() {
    const [banks, setBanks] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [bankName, setBankName] = useState('');
    const [editingBank, setEditingBank] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const resetForm = () => {
        setBankName('');
        setEditingBank(null);
        setShowModal(false);
    };


    const filteredBanks = banks.filter(bank =>
    bank.BankName.toLowerCase().includes(searchQuery.toLowerCase())
);


    useEffect(() => {
        const fetchBanks = async () => {

            try {
                const response = await BankListApi();
                // Assuming API returns an array of bank objects with `id` and `name`
                if (Array.isArray(response)) {
                    setBanks(response);
                } else {
                    console.error('Unexpected response format:', response);
                }
            } catch (error) {
                console.error('Failed to fetch banks:', error);
            }
        };

        fetchBanks();
    }, []);

    const handleBankNameChange = (e) => {
        const value = e.target.value;
        if (value === '' || validBankNameRegex.test(value)) {
            setBankName(value);
        }
    };

    const handleAddOrUpdate = async () => {

        const userId = Cookies.get("UserId");
        const token = Cookies.get("token");
        const trimmedName = bankName.trim();

        if (!trimmedName) {
            Swal.fire('Validation Error', 'Bank name is required.', 'warning');
            return;
        }

        if (!validBankNameRegex.test(trimmedName)) {
            Swal.fire('Validation Error', 'Bank name can only contain alphabets, spaces and "&".', 'warning');
            return;
        }

        if (editingBank) {
            // setBanks(banks.map(bank =>
            //   bank.id === editingBank.id ? { ...bank, name: trimmedName } : bank
            // ));
            Swal.fire('Updated!', 'Bank has been updated under Develop.', 'info');
            resetForm();
        } else {
            try {

                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/bank/create`,
                    {
                        userId: parseInt(userId),
                        BankName: trimmedName
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );


                if (response.data.success) {
                    Swal.fire('Success!', response.data.message, 'success');
                    resetForm();

                    // ✅ Refresh the table with latest bank data
                    const updatedBanks = await BankListApi();
                    if (Array.isArray(updatedBanks)) {
                        setBanks(updatedBanks);
                    } else {
                        console.warn('Unexpected response from BankListApi:', updatedBanks);
                    }

                } else {
                    Swal.fire('Error', response.data.message || 'Something went wrong', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Failed to add bank. Please try again later.', 'error');
            }
        }
    };

    const handleEdit = (bank) => {
        setEditingBank(bank);
        setBankName(bank.BankName);
        setShowModal(true);
    };

    const handleDelete = (bank) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${bank.BankName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setBanks(banks.filter(b => b.id !== bank.id));
                Swal.fire('Deleted!', 'Bank has been deleted.', 'success');
            }
        });
    };

    return (
        <div className="h-[85vh] overflow-y-scroll hide-scrollbar p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Bank Master</h1>
                                <p className="text-gray-600">Manage bank information</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Bank</span>
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {editingBank ? 'Edit Bank' : 'Add New Bank'}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={handleBankNameChange}
                                    placeholder="Enter bank name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    maxLength={75}
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddOrUpdate}
                                    disabled={!bankName.trim()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                                >
                                    {editingBank ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Banks Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Banks List ({banks.length} total)
                        </h2>
                        <input
                            type="text"
                            placeholder="Search bank name..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
                        />
                    </div>


                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBanks.map((bank, index) => (
                                    <tr key={bank.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <div className="p-1 bg-blue-100 rounded mr-3">
                                                    <Building2 className="h-4 w-4 text-blue-600" />
                                                </div>
                                                {bank.BankName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(bank)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Edit Bank"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                {/* <button
                                                    onClick={() => handleDelete(bank)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Delete Bank"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {banks.length === 0 && (
                        <div className="text-center py-12">
                            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No banks found. Add your first bank!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BankMaster;
