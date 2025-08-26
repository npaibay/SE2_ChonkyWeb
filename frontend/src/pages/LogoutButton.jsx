function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        credentials: "include", // sends session cookies
      });

      if (response.ok) {
        alert("Logged out successfully!");
        localStorage.removeItem("user");
        window.location.href = "/"; // redirect to login page
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
