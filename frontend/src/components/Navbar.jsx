import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token or user data from localStorage or sessionStorage
    localStorage.removeItem("user");
    navigate("/"); // Redirect to the login page
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-semibold">LetsBay</h1>
      <button
        onClick={handleLogout}
        className="text-white py-2 px-4 rounded cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
