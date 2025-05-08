import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaGithub, FaFacebook, FaBars } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "user") {
        navigate("/dashboard");
      } else {
        setError("Access denied. Unknown role.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-blue-100 ">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 md:px-10">
        <h1 className="text-xl md:text-2xl font-bold">
          <span className="text-purple-500">Learn</span>{" "}
          <span className="text-gray-700">Code</span>
        </h1>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="text-purple-500 text-2xl" />
          </button>
        </div>
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium items-center">
          <a href="#" className="hover:text-purple-600">Practice</a>
          <a href="#" className="hover:text-purple-600">Explore</a>
          <a href="#" className="text-purple-500">Login</a>
          <button
            className="block w-full text-white px-4 py-2 rounded-full transition-all duration-300 ease-in-out"
            style={{
              background: 'linear-gradient(to right, #B23DEB, #DE8FFF)',
            }}
          >
            Sign Up
          </button>

        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-2 space-y-2 text-gray-700 ">
          <a href="#" className="block hover:text-purple-500">Practice</a>
          <a href="#" className="block hover:text-purple-500">Explore</a>
          <a href="#" className="block text-purple-500">Login</a>
          <button
            className="block text-white px-4 py-2 rounded-full transition-all duration-300 ease-in-out"
            style={{
              background: 'linear-gradient(to right, #B23DEB, #DE8FFF)',
            }}
          >
            Sign Up
          </button>

        </div>
      )}

      <div className="flex flex-col md:flex-row h-[1000px] md:h-[600px] mt-40 md:mt-24">
        {/* Login Card */}
        <div className="order-1 md:order-2 bg-white/90 mx-auto w-[400px] md:w-[450px] min-h-[300px] rounded-3xl shadow-lg p-4 mt-2 md:mt-6 z-20 flex flex-col justify-start">
          <div>
            <div className="mb-4 text-center mt-4 md:mt-8">
              <h1 className="text-2xl md:text-3xl font-bold text-purple-600">
                <span className="text-purple-600">Learn</span>{" "}
                <span className="text-gray-700">Code</span>
              </h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-3 mt-4 md:mt-8">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <input
                type="email"
                placeholder="Mail id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-2 border-gray-300 focus:ring-purple-400 text-sm md:mt-6"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 placeholder:text-gray-400 focus:ring-2 border-gray-300 focus:ring-purple-400 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full text-white font-semibold py-3 rounded-full hover:opacity-90 transition-all duration-300 ease-in-out md:mt-8"
                style={{
                  background: 'linear-gradient(to right, #B23DEB, #DE8FFF)',
                }}
              >
                Log In
              </button>


              <div className="flex justify-between text-xs mt-2 md:mt-6">
                <a href="#" className="text-gray-500 hover:text-purple-600">
                  Forget Password?
                </a>
                <a href="#" className="text-purple-600 font-semibold">
                  Sign Up
                </a>
              </div>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500 md:mt-8">
              Or you can Signup with
            </div>
            <div className="flex justify-center mt-3 space-x-4 text-xl md:mt-6">
              <FaGoogle className="text-gray-600 hover:text-red-500 cursor-pointer" />
              <FaGithub className="text-gray-600 hover:text-black cursor-pointer" />
              <FaFacebook className="text-gray-600 hover:text-blue-600 cursor-pointer" />
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center md:mt-10">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="#" className="underline">Privacy Policy</a> and{" "}
            <a href="#" className="underline">Terms of Service</a> apply.
          </p>
        </div>

        {/* Image Section */}
        <div className="order-2 md:order-1 relative w-full md:w-1/2 min-h-[400px] md:min-h-[800px] flex justify-center items-center mt-44 md:mt-0">
          <img
            src="/student.png"
            alt="Student"
            className="w-full h-full object-cover z-10"
          />
          <button className="absolute top-10 left-8 bg-white px-4 py-1.5 md:px-6 md:py-2 rounded-full shadow font-medium z-20 text-sm md:text-base">
            Courses
          </button>
          <button className="absolute bottom-6 right-10 bg-white px-4 py-1.5 md:px-6 md:py-2 rounded-full shadow font-medium z-20 text-sm md:text-base">
            Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
