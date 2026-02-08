"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") === "true") {
      router.push("/admin/projects");
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin" && password === "admin") {
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push("/admin/projects");
    } else {
      setError("Invalid credentials. Try 'admin' / 'admin'.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Admin Login"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-center text-sm text-gray-700 mb-4">
          Sign in to manage content
        </p>

        {/* BACK TO HOME */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 underline transition"
          >
            ← Back to Home
          </Link>
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="admin"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          © {new Date().getFullYear()} Adrien Business Group
        </p>
      </div>
    </div>
  );
}
