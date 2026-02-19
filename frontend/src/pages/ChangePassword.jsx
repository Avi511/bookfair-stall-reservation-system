import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { changePassword, getMe } from "../api/auth.api";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    let alive = true;

    const loadMe = async () => {
      try {
        setLoadingProfile(true);
        const me = await getMe();
        if (!alive) return;
        setEmail(me?.email || "");
      } catch (e) {
        if (!e?.response) {
          toast.error(e?.message || "Failed to load profile.");
        }
      } finally {
        if (alive) setLoadingProfile(false);
      }
    };

    loadMe();
    return () => {
      alive = false;
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Current password is required.");
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
      setSubmitting(true);
      const res = await changePassword({ currentPassword, newPassword });
      toast.success(res?.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      navigate("/me", { replace: true });
    } catch (e) {
      if (!e?.response) {
        toast.error(e?.message || "Failed to change password.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl px-4 py-8 mx-auto">
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update your account password.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              readOnly
              disabled={loadingProfile}
              className="w-full px-3 py-2 mt-1 border rounded-xl bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3 py-2 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Enter new password again"
              className="w-full px-3 py-2 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-semibold border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loadingProfile}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-[var(--color-primary)] hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
