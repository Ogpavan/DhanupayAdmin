export const login = async (credentials) => {
    const response = await fetch("http://gateway.dhanushop.com/api/users/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  };
  