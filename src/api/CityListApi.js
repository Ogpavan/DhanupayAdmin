import Cookies from "js-cookie";
export const fetchCitiesByState = async (selectedState) => {
  const token = Cookies.get("token");
  const userId = Cookies.get("UserId");

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/city/listBYState`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: Number(userId),   // Ensure this is a number if your backend expects it
        StateId: selectedState,   // Match the backend's key name exactly (capital S)
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }

    const data = await response.json();
    console.log("Cities fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};
