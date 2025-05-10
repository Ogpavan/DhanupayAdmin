import React, { useState, useEffect } from 'react';
import { CaretLeft } from 'phosphor-react'; // Import the back arrow icon from Phosphor
import aepsWalletIcon from '/normalwallet.svg';
import walletIcon from '/wallet.png';
import SendToBank from './SendToBank';
import LoadMoney from './LoadMoney';

const Wallet = () => {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // For showing all transactions
  const [actionPerformed, setActionPerformed] = useState(false); // To track if an action was performed

  const handleWalletClick = (walletType, amount) => {
    setSelectedWallet({ walletType, amount });
    fetchTransactions(walletType);
  };

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 8);

  // Mock API request to simulate fetching transaction history
  const fetchTransactions = (walletType) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      try {
        // Mock response based on walletType
        const mockData = walletType === 'AEPS Wallet' ? [
          { id: 1, date: "2025-05-01", amount: 1200, type: "Credit", desc: "Referral Bonus" },
          { id: 2, date: "2025-05-02", amount: 500, type: "Debit", desc: "Bill Payment" },
          { id: 3, date: "2025-05-03", amount: 2200, type: "Credit", desc: "Incentive" },
          { id: 4, date: "2025-05-04", amount: 300, type: "Debit", desc: "Recharge" },
          { id: 5, date: "2025-05-05", amount: 1000, type: "Credit", desc: "Reward" },
          { id: 6, date: "2025-05-06", amount: 450, type: "Debit", desc: "Transfer" },
          { id: 7, date: "2025-05-07", amount: 350, type: "Credit", desc: "Cashback" },
          { id: 8, date: "2025-05-08", amount: 200, type: "Debit", desc: "Purchase" },
          { id: 9, date: "2025-05-09", amount: 300, type: "Credit", desc: "Interest" },
        ] : [
          { id: 1, date: "2025-05-01", amount: 1200, type: "Credit", desc: "Referral Bonus" },
          { id: 2, date: "2025-05-02", amount: 500, type: "Debit", desc: "Bill Payment" },
          { id: 3, date: "2025-05-03", amount: 2200, type: "Credit", desc: "Incentive" },
          { id: 4, date: "2025-05-04", amount: 300, type: "Debit", desc: "Recharge" },
          { id: 5, date: "2025-05-05", amount: 1000, type: "Credit", desc: "Reward" },
          { id: 6, date: "2025-05-06", amount: 450, type: "Debit", desc: "Transfer" },
          { id: 7, date: "2025-05-07", amount: 350, type: "Credit", desc: "Cashback" },
          { id: 8, date: "2025-05-08", amount: 200, type: "Debit", desc: "Purchase" },
          { id: 9, date: "2025-05-09", amount: 300, type: "Credit", desc: "Interest" },
        ];

        setTransactions(mockData);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Unable to load transactions.');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }, 1500);  // Simulate a delay of 1.5 seconds
  };

  const handleActionClick = () => {
    setActionPerformed(true);
  };

  const handleBackClick = () => {
    setActionPerformed(false); // Reset to show transaction history
  };

  return (
    <>
    <div className="flex flex-col lg:flex-row gap-4 ">
      {/* Left Section: Wallet List + Action Button */}
      <div className="w-full lg:w-1/3 xl:w-1/4">
        <div className="flex flex-col gap-5">
          {/* AEPS Wallet */}
          <div
            className={`flex items-center p-4 rounded-xl shadow-lg cursor-pointer hover:bg-blue-200 ${selectedWallet?.walletType === 'AEPS Wallet' ? 'bg-blue-300' : 'bg-white'}`}
            onClick={() => handleWalletClick('AEPS Wallet', 5382.23)}
          >
            <img src={aepsWalletIcon} alt="AEPS" className="w-12 h-12 mr-4" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">AEPS Wallet</p>
              <p className="font-bold text-black text-lg">₹ 5382.23</p>
            </div>
          </div>

          {/* Incentive Wallet */}
          <div
            className={`flex items-center p-4 rounded-xl shadow-lg cursor-pointer hover:bg-green-200 ${selectedWallet?.walletType === 'Incentive Wallet' ? 'bg-green-300' : 'bg-white'}`}
            onClick={() => handleWalletClick('Incentive Wallet', 5382.23)}
          >
            <img src={walletIcon} alt="Wallet" className="w-12 h-12 mr-4" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Incentive Wallet</p>
              <p className="font-bold text-black text-lg">₹ 5382.23</p>
            </div>
          </div>
        </div>

        {/* Conditional Action Button */}
        {selectedWallet && !actionPerformed && (
          <div className="mt-6">
            {selectedWallet.walletType === 'AEPS Wallet' ? (
              <button
                className="bg-blue-300 text-white px-6 py-3 rounded-xl w-full"
                onClick={handleActionClick} // Only update the state, no navigation
              >
                Move to Bank
              </button>
            ) : (
              <button
                className="bg-green-300 text-white px-6 py-3 rounded-xl w-full"
                onClick={handleActionClick} // Only update the state, no navigation
              >
                Load Wallet
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right Section: Transaction History or Action Confirmation */}
      <div className="w-full lg:w-2/3 xl:w-3/4 p-6 border-l-2 h-[500px] overflow-y-auto">
        {actionPerformed ? (
          // Show wallet title, amount, and button after action is clicked
          <div className="relative">
            <div
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 p-2 cursor-pointer"
              onClick={handleBackClick}
            >
              <div className="flex">
                <CaretLeft size={24} />
                <span className="ml-2">Back</span> {/* You can add text or just use the icon */}
              </div>
            </div>
            {selectedWallet?.walletType === "Incentive Wallet" ? (
              <LoadMoney selectedWallet={selectedWallet} />
            ) : (
              <SendToBank selectedWallet={selectedWallet} />
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
            {selectedWallet ? (
              loading ? (
                <p className="text-sm text-gray-500">Loading transactions...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : transactions.length > 0 ? (
                <div className="space-y-3">
                  {displayedTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="border p-3 rounded-lg flex justify-between items-center shadow-lg bg-white hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{txn.desc}</p>
                        <p className="text-sm text-gray-500">{txn.date}</p>
                      </div>
                      <div
                        className={`text-right font-semibold ${txn.type === "Credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {txn.type === "Credit" ? "+" : "-"}₹{txn.amount}
                      </div>
                    </div>
                  ))}
                  {/* Button to toggle showAll state */}
                  {transactions.length > 8 && !showAll && (
                    <button
                      className="mt-4 text-indigo-600 hover:underline"
                      onClick={() => setShowAll(true)}
                    >
                      View More
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No transactions found.</p>
              )
            ) : (
              <p className="text-sm text-gray-500">Please select a wallet to view transactions.</p>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Wallet;
