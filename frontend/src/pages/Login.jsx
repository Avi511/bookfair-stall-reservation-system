import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { decodeJwt } from "../auth/jwt";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const sessionExpired = params.get('sessionExpired');

  const redirectTo = location.state?.from?.pathname;

  useEffect(() => {
    if (sessionExpired) {
      toast.error("Your session has expired. Please log in again.");
    }
  }, [sessionExpired]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", { email, password });

      const token = res.data?.token || res.data?.accessToken;
      if (!token) throw new Error("Token not found in response");

      login(token);

      const payload = decodeJwt(token);
      const role = String(
        payload?.role || payload?.roles?.[0] || "",
      ).toUpperCase();
      const isEmployee = role === "EMPLOYEE" || role === "ROLE_EMPLOYEE";
      let userName = payload?.businessName || payload?.name || payload?.sub;
      try {
        const meRes = await axios.get("/auth/me");
        const me = meRes?.data;
        userName = me?.businessName || me?.name || me?.email || userName;
      } catch {
        // Keep best available value from token if /auth/me fails.
      }

      toast.success(`Login successful ${userName ? `- ${userName}` : ""}`);

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        return;
      }

      navigate(isEmployee ? "/employee/dashboard" : "/", { replace: true });
    } catch {
      // API errors are shown globally by axios interceptor toast handling.
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md p-6 bg-white shadow rounded-2xl">
        <h1 className="text-2xl font-bold text-[var(--color-dark)]">Login</h1>
       

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-[var(--color-primary)] text-white py-2.5 font-semibold hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-700">
          Don&apos;t have an account?{" "}
          <Link
            className="font-semibold text-[var(--color-primary)]"
            to="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
