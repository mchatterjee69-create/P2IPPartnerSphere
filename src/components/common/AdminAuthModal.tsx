import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Shield, Lock, X, AlertCircle, CheckCircle2 } from "lucide-react";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const { adminLogin } = useApp();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = adminLogin(password);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPassword("");
        onClose();
      }, 500);
    } else {
      setError(res.error || "Access denied. Master password incorrect.");
    }
  };

  const handleClose = () => {
    setPassword("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div
      id="admin-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div
        className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F5132] to-[#146c43] text-white flex items-center justify-center shadow-md border border-[#D4AF37]/30">
            <Shield className="w-6 h-6 text-[#F5D77F]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Restricted Area
            </div>
            <h3 className="text-base font-extrabold text-gray-950">
              Admin Master Authorization
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-5 leading-relaxed">
          The central P2IP CRM is strictly reserved for master administrators. Please enter the master security password (
          <span className="font-mono font-bold text-[#0F5132]">p2ip@1230</span>) to continue.
        </p>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs mb-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong>Access Denied:</strong> {error}
            </div>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Master authorization verified! Opening Executive CRM...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Master Admin Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                id="admin-modal-password-input"
                type="password"
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password (p2ip@1230)"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 border border-[#D4AF37]/30"
            >
              <Shield className="w-3.5 h-3.5 text-[#F5D77F]" />
              <span>Authorize Access</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
