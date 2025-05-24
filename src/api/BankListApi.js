// src/api/BankApi.js

export const BankListApi = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bank/list`, {
        method: "POST",
        headers: {
    
          'Content-Type': 'application/json'
        },
       
      });
  
      const data = await response.json();
      // console.log(data);
      return data; // Return the list of states
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error; // So you can catch it where you call
    }
  };












  