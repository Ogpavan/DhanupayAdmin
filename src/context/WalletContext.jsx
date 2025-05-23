// src/context/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchWallets = async (userId, token) => {
        try {
            // console.log("token for wallet",token);
            // console.log("userId for wallet",userId);
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/WalletMaster/WalletMasterList`,
                { UserId: userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setWallets(response.data);
            console.log("wallet data",response.data);
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
            setWallets([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WalletContext.Provider value={{ wallets, loading, fetchWallets }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
