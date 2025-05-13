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

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Basic sanitization: strip leading spaces
        let sanitizedValue = value.trimStart();

        // Specific input filtering
        if (name === 'name') {
            sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s]/g, '');
        }

        if (name === 'phone') {
            sanitizedValue = sanitizedValue.replace(/[^0-9]/g, '').slice(0, 10);
        }

        setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const transactionIdRegex = /^[a-zA-Z0-9\-_.]{5,}$/;

        // Empty check
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

        // Validations
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

        console.log('Form Submitted:', form);

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
        <div className="flex px-6 py-4">
            <div className="bg-white w-full">
                <div className='flex justify-between items-center'>
                    <div>
                        <h2 className="text-2xl font-semibold">BBPS Complaint</h2>
                        <p className="mt-2 text-gray-600">Fill out the form below to submit a complaint</p>
                    </div>
                    <img src="/bharat-connect.png" alt="Bharat Connect" className="h-10" />
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name<span className='text-red-500'>*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className='text-red-500'>*</span></label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className='text-red-500'>*</span></label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500"
                            required
                            maxLength="10"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type<span className='text-red-500'>*</span></label>
                        <select
                            name="transactionType"
                            value={form.transactionType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Water">Water</option>
                            <option value="Gas">Gas</option>
                            <option value="Mobile">Mobile Recharge</option>
                            <option value="DTH">DTH Recharge</option>
                            <option value="Broadband">Broadband</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID<span className='text-red-500'>*</span></label>
                        <input
                            type="text"
                            name="transactionId"
                            value={form.transactionId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Complaint<span className='text-red-500'>*</span></label>
                        <textarea
                            name="complaint"
                            value={form.complaint}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-md transition-all duration-200"
                        >
                            Submit Complaint
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BBPSComplaint;
