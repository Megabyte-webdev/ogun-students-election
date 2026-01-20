import React from "react";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 shadow">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </header>
      <main className="p-6 relative">{children}</main>
    </div>
  );
}
