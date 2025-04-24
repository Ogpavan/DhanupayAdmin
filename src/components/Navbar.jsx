// Navbar.jsx
export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow">
      <h1 className="text-xl font-semibold">Dhanupay Admin</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">Hi, {user?.username || "Admin"}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-white text-indigo-700 px-3 py-1 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
