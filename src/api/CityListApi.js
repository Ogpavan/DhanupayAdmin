// apiService.js
const API_URL = "http://gateway.dhanushop.com/api/city/listBYState";  // Replace with your API's base URL

export const fetchCitiesByState = async (selectedState) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        userId: userId,
        stateId: selectedState,  // Send the stateId in the request body
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }

    const data = await response.json();
    console.log(data);
    return data; // Return the fetched data (list of cities)
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};
