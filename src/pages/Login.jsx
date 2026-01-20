import { useAuth } from "../context/AuthContext";
import { axiosClient } from "../services/axios-client";

export default function Login() {
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const matricNo = e.target.matricNo.value;
    const password = e.target.password.value;

    try {
      const res = await axiosClient.post("/auth/login", {
        matricNo,
        password,
      });

      login(res.data.token);
    } catch {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Student Login
        </h2>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Matric Number</span>
          <input
            name="matricNo"
            type="text"
            placeholder="Enter your matric number"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Password</span>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
