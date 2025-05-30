// src/api/stateApi.js
import Cookies from "js-cookie";
export const fetchdesingnationList = async () => {
    const token = Cookies.get("token");
    const userId = Cookies.get("UserId");
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/desingnation/list`, {
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









  