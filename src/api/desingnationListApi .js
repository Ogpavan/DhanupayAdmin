// src/api/stateApi.js

export const fetchdesingnationList = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  
    try {
      const response = await fetch("http://gateway.dhanushop.com/api/desingnation/list", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
        })
      });
  
      const data = await response.json();
      return data; // Return the list of states
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error; // So you can catch it where you call
    }
  };









  