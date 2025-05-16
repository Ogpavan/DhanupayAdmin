// src/api/stateApi.js
import Cookies from "js-cookie";
export const fetchStatesList = async () => {
    const token = Cookies.get("token");
    const userId = Cookies.get("UserId");
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/state/list`, {
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
      console.log(data);
      return data; // Return the list of states
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error; // So you can catch it where you call
    }
  };









  