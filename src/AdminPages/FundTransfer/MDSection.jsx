

import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./CommonTable";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { IndianRupee, CreditCard, ArrowDown, ArrowUp, Wallet, RefreshCw } from "lucide-react";

const MDSection = () => {
  const [selectedMasterDistributer, setSelectedMasterDistributer] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [transactionType, setTransactionType] = useState("Credit");
  const [walletBalances, setWalletBalances] = useState([]);
  const [loadingBalances, setLoadingBalances] = useState(false);

  const token = Cookies.get("token");
  const userId = Cookies.get("UserId");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!token || !userId) {
        console.error("Missing token or userId in cookies");
        setUsers([]);
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://gateway.dhanushop.com/api/users/AllUserDetails",
        { UserID: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success && Array.isArray(response.data.users)) {
        const allUsers = response.data.users;
 console.log(allUsers)
        const filteredUsers = allUsers.filter(
          (user) => !(user.UserType === "1" && user.Role === "1")
        );

        setUsers(filteredUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallet balances when MasterDistributer is selected
  const fetchWalletBalances = async (MasterDistributerId) => {
    setLoadingBalances(true);
    try {
      const response = await axios.post(
        "https://gateway.dhanushop.com/api/WalletMaster/WalletMasterList",
        { UserId: MasterDistributerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (Array.isArray(response.data)) {
        setWalletBalances(response.data);
        // console.log(response.data)
        // Reset selected wallet when wallet balances change
        setSelectedWallet("");
      } else {
        setWalletBalances([]);
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
      setWalletBalances([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch wallet balances",
      });
    } finally {
      setLoadingBalances(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


// useEffect(() => {
//     // console.log("Wallet balances:", walletBalances);
    
//   }, [walletBalances]);

  useEffect(() => {
    if (selectedUser && selectedUser.NewUserID) {
      fetchWalletBalances(selectedUser.NewUserID);
    } else {
      setWalletBalances([]);
    }
  }, [selectedUser]);

  const handleTransfer = async () => {
    // console.log(selectedMasterDistributer, selectedWallet, amount);
    if (!selectedMasterDistributer || !selectedWallet || !amount) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please complete all fields.",
      });
      return;
    }

    setLoading(true);

    // Get the selected wallet object from the wallet balances array
    // const selectedWalletObj = walletBalances.find(wallet => wallet.WalletID.toString() === selectedWallet);
    
    // if (!selectedWalletObj) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     text: "Selected wallet not found.",
    //   });
    //   setLoading(false);
    //   return;
    // }
// console.log(selectedWallet)
const wallet = walletBalances.find(w => 
  selectedWallet === "Primary" ? w.WalletType === "Primary" : w.WalletType !== "Primary"
);

const walletId = wallet ? wallet.WalletId : null;
// console.log(walletId)
let refrencetype = "topUP"
if (transactionType=="Debit") {
  refrencetype="refund"

}else{

}

    const payload = {
      UserId: selectedMasterDistributer,
      WalletId: walletId, // Use the actual wallet ID from the response
      TransactionType: transactionType,
      Source: "Admin",
      CreatedBy: userId,
      ReferenceType: refrencetype,
      ReferenceId: "",
      Amount: amount.toString(),
    };
    // console.log(payload);
    
    try {
      const response = await axios.post(
        "https://gateway.dhanushop.com/api/WalletMaster/WalletTransaction",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Transfer successful",
          text: `Amount ${transactionType.toLowerCase()}ed successfully.`,
        });
        setAmount("");
        // Refresh wallet balances after transaction
        if (selectedUser && selectedUser.NewUserID) {
          fetchWalletBalances(selectedUser.NewUserID);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Transfer failed",
          text: response.data.message || "Unknown error",
        });
        // console.log(response.data);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error during transfer. Please try again.",
      });
      console.log("Transfer error:", error);
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    { label: "MasterDistributer Name", key: "MasterDistributer_name" },
    { label: "Wallet", key: "wallet" },
    { label: "Amount", key: "amount" },
    { label: "Date", key: "date" },
    { label: "Transaction ID", key: "transaction_id" },
  ];

  const data = [
    {
      MasterDistributer_name: "MasterDistributer 1",
      wallet: "Primary Wallet",
      amount: "₹500",
      date: "2025-05-01",
      transaction_id: "TX003",
    },
  ];

  // Function to get wallet balance by ID
//   const getWalletBalance = (walletId) => {
// const wallet = walletBalances?.find(
//   (w) => walletId?.toString() && w.WalletID.toString() === walletId.toString()
// );
//     return wallet ? wallet.Balance : "--";
//   };

  return (
    <div className="flex flex-col lg:flex-row h-[73vh] hide-scrollbar overflow-y-scroll bg-gray-100">
      {/* Form Section */}
      <section className="w-full lg:w-[40%] p-1">
        <div className="bg-white shadow-md rounded-lg">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold flex items-center text-indigo-700">
              <CreditCard className="mr-2" size={20} />
              Master Distributer Fund Management
            </h2>
          </div>
          
          <div className="p-6">
            <form>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold">
                  Master Distributer ID
                </label>
                <div className="relative">
                  <input
                    className="block outline-none w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    type="text"
                    placeholder="Enter MasterDistributer ID"
                    value={selectedMasterDistributer}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedMasterDistributer(value);

                      const matchedUser = users.find(
                        (user) => user.AgentId?.toString() === value
                      );
                      setSelectedUser(matchedUser || null);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  />

               {selectedMasterDistributer.length > 0 && showDropdown && (
  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
    {users
      .filter((user) =>
        user.AgentId?.toString().toLowerCase().includes(selectedMasterDistributer.toLowerCase())
      )
      .slice(0, 10)
      .map((user) => (
        <li
          key={user.AgentId}
          className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
          onClick={() => {
            setSelectedMasterDistributer(user.NewUserID);
            setSelectedUser(user);
            setShowDropdown(false);
          }}
        >
          <span className="font-medium">{user.AgentId}</span> -{" "}
          {user.FirstName} {user.LastName}
        </li>
      ))}
  </ul>
)}

                </div>

                {selectedUser && (
                  <p className="mt-2 text-sm text-gray-700">
                    MasterDistributer Name:{" "}
                    <strong>
                      {selectedUser.FirstName} {selectedUser.LastName}
                    </strong>
                  </p>
                )}
              </div>

              {/* Wallet Balances Section */}
              {selectedUser && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">Wallet Balances</h3>
                    <button 
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800"
                      onClick={() => fetchWalletBalances(selectedUser.NewUserID)}
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                  
                  {loadingBalances ? (
                    <div className="text-center py-4">
                      <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-indigo-600 rounded-full" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {walletBalances.map((wallet) => (
                        <div key={wallet.WalletID} className="bg-white p-3 rounded border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Wallet size={16} className={wallet.WalletType.toLowerCase() === "primary" ? "text-indigo-600 mr-2" : "text-green-600 mr-2"} />
                              <span className="text-xs font-medium">
                                {wallet.WalletType} (ID: {wallet.WalletID})
                              </span>
                            </div>
                            <span className="text-sm font-bold">₹{wallet.Balance}</span>
                          </div>
                        </div>
                      ))}
                      {walletBalances.length === 0 && (
                        <div className="text-center text-gray-500 py-2">No wallet data available</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold">
                  Transaction Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-indigo-600"
                      name="transactionType"
                      value="Credit"
                      checked={transactionType === "Credit"}
                      onChange={() => setTransactionType("Credit")}
                    />
                    <span className="ml-2 flex items-center text-sm">
                      <ArrowDown size={16} className="text-green-500 mr-1" /> Credit
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-indigo-600"
                      name="transactionType"
                      value="Debit"
                      checked={transactionType === "Debit"}
                      onChange={() => setTransactionType("Debit")}
                    />
                    <span className="ml-2 flex items-center text-sm">
                      <ArrowUp size={16} className="text-red-500 mr-1" /> Debit
                    </span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold">
                  Select Wallet
                </label>
                <select
                  className="block w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                >
                  <option value="">Select Wallet</option>
                  {walletBalances.map((wallet) => (
                    <option key={wallet.WalletID} value={wallet.WalletID}>
                      {wallet.WalletType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold">
                  Enter Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IndianRupee size={16} className="text-gray-400" />
                  </span>
                  <input
                    className="block w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    type="number"
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                {/* {selectedWallet && (
                  <p className="mt-2 text-xs text-gray-500">
                    Current Balance: ₹{getWalletBalance(selectedWallet)}
                  </p>
                )} */}
              </div>

              <button
                type="button"
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleTransfer}
                disabled={loading || !selectedWallet}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent text-white rounded-full mr-2" role="status" aria-label="loading">
                      <span className="sr-only">Loading...</span>
                    </div>
                    Processing...
                  </div>
                ) : (
                  <>
                    {transactionType === "Credit" ? "Add Funds" : "Withdraw Funds"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section className="w-full lg:w-2/3 p-1">
        <div className="bg-white shadow-md rounded-lg">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold flex items-center text-indigo-700">
              <Wallet className="mr-2" size={20} />
              MasterDistributer Transaction History
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <Table headers={headers} data={data} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MDSection;