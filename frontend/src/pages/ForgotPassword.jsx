import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword, resetPassword } from "../api/auth.api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailFromQuery = (searchParams.get("email") || "").trim();
  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [requestingOtp, setRequestingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const emailReadOnly = Boolean(emailFromQuery);

  const onRequestOtp = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      toast.error("Email is required.");
      return;
    }

    try {
      setRequestingOtp(true);
      const res = await forgotPassword({ email: normalizedEmail });
      toast.success(res?.message || "OTP sent to your email.");
    } catch (e) {
      if (!e?.response) {
        toast.error(e?.message || "Failed to request OTP.");
      }
    } finally {
      setRequestingOtp(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    const normalizedOtp = otp.trim();

    if (!normalizedEmail) {
      toast.error("Email is required.");
      return;
    }
    if (!normalizedOtp) {
      toast.error("OTP is required.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setResettingPassword(true);
      const res = await resetPassword({
        email: normalizedEmail,
        otp: normalizedOtp,
        newPassword,
      });
      toast.success(res?.message || "Password reset successfully.");
      navigate("/login", { replace: true });
    } catch (e) {
      if (!e?.response) {
        toast.error(e?.message || "Failed to reset password.");
      }
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="max-w-xl px-4 py-8 mx-auto">
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
        <p className="mt-1 text-sm text-gray-600">
          Request OTP and reset your password.
        </p>

        <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-[1fr_auto]">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={emailReadOnly}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)] read-only:bg-gray-100 read-only:text-gray-600"
          />
          <button
            type="button"
            onClick={onRequestOtp}
            disabled={requestingOtp || resettingPassword}
            className="px-4 py-2 font-semibold border rounded-xl hover:bg-gray-50 disabled:opacity-60"
          >
            {requestingOtp ? "Sending OTP..." : "Request OTP"}
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 mt-4">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Enter new password again"
            className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-semibold border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={requestingOtp || resettingPassword}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-[var(--color-primary)] hover:opacity-95 disabled:opacity-60"
            >
              {resettingPassword ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
