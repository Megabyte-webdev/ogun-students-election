import { useState } from "react";
import { axiosClient } from "../services/axios-client";

export default function Signup() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const matricNo = e.target.matricNo.value;
    const password = e.target.password.value;

    try {
      const res = await axiosClient.post("/auth/signup", {
        name,
        matricNo,
        password,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Student Signup
        </h2>

        {message && (
          <p className="text-center text-green-600 mb-4">{message}</p>
        )}

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Name</span>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Matric Number</span>
          <input
            type="text"
            name="matricNo"
            placeholder="Matric Number"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Password</span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
