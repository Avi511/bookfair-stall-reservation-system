import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { registerWithOtp, requestRegisterOtp } from "../api/auth.api";

export default function Register() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);

  const [loading, setLoading] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [error, setError] = useState("");

  async function handleRequestOtp() {
    setError("");
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setRequestingOtp(true);
    try {
      const res = await requestRegisterOtp({ email: email.trim() });
      const msg = res?.message || "OTP sent successfully.";
      toast.success(msg);
      setOtpRequested(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to send OTP";
      setError(msg);
    } finally {
      setRequestingOtp(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!otp.trim()) {
      setError("OTP is required.");
      return;
    }

    setLoading(true);
    try {
      await registerWithOtp({
        email: email.trim(),
        password,
        businessName,
        otp: otp.trim(),
      });

      toast.success("Account created successfully. Please login.");
      navigate("/login", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md p-6 bg-white shadow rounded-2xl">
        <h1 className="text-2xl font-bold text-[var(--color-dark)]">Register</h1>
        {error && (
          <div className="px-4 py-3 mt-4 text-sm text-red-700 rounded-xl bg-red-50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-700">Business Name</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="ABC Publications"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Email</label>
            <div className="mt-1 flex gap-2">
              <input
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={requestingOtp}
                className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
              >
                {requestingOtp ? "Sending..." : otpRequested ? "Resend OTP" : "Request OTP"}
              </button>
            </div>
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
          </div>

          <div>
            <label className="text-sm text-gray-700">Confirm Password</label>
            <div className="mt-1 relative">
              <input
                className="w-full rounded-xl border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="****"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">OTP</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP from email"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-[var(--color-primary)] text-white py-2.5 font-semibold hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-700">
          <p>
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}