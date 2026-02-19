import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { decodeJwt } from "../auth/jwt";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotConfirmModal, setShowForgotConfirmModal] = useState(false);

  const params = new URLSearchParams(location.search);
  const sessionExpired = params.get("sessionExpired");

  const redirectTo = location.state?.from?.pathname;

  useEffect(() => {
    if (sessionExpired) {
      toast.error("Your session has expired. Please log in again.");
    }
  }, [sessionExpired]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/auth/login", { email, password });

      const token = res.data?.token || res.data?.accessToken;

      if (!token) {
        throw new Error("Token not found in response");
      }

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
        // If /auth/me fails, continue with token data
      }

      toast.success(`Login successful${userName ? ` - ${userName}` : ""}`);

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        return;
      }

      navigate(isEmployee ? "/employee/dashboard" : "/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message || "Invalid email or password";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const onForgotPasswordYes = () => {
    const trimmedEmail = email.trim();
    setShowForgotConfirmModal(false);
    if (trimmedEmail) {
      navigate(`/forgot-password?email=${encodeURIComponent(trimmedEmail)}`);
      return;
    }
    navigate("/forgot-password");
  };

  return (
    <>
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
              <div className="mt-1 relative">
                <input
                  className="w-full rounded-xl border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="****"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotConfirmModal(true)}
                className="mt-2 text-sm font-semibold text-[var(--color-primary)] hover:underline"
              >
                Forgot password?
              </button>
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

      {showForgotConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
            <h3 className="text-lg font-bold text-[var(--color-dark)]">
              Forgot Password
            </h3>
            <p className="mt-3 text-sm text-gray-700">
              Do you want to change the password?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForgotConfirmModal(false)}
                className="px-4 py-2 text-sm font-semibold border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                No
              </button>
              <button
                type="button"
                onClick={onForgotPasswordYes}
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-[var(--color-primary)] hover:opacity-95"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
