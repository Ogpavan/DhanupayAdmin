// src/api/stateApi.js
// import Cookies from "js-cookie";
export const fetchStatesList = async () => {
    // const token = Cookies.get("token");
    // const userId = Cookies.get("UserId");
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/state/list`, {
        method: "POST",
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        
      });
  
      const data = await response.json();
      console.log('States fetched at api file:', data);
      return data; // Return the list of states
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error; // So you can catch it where you call
    }
  };









  