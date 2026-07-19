import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/use.auth";

const AccountDropDown = ({ user, onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logoutHandler } = useAuth();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = async () => {
    try {
      await logoutHandler();
      onClose();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 z-50 w-72 border border-[#8b6914]/15 dark:border-white/10 bg-[#FDFAF5] dark:bg-[#0e0e16] shadow-2xl transition-all duration-300 transform scale-100 opacity-100 select-none"
      style={{
        boxShadow: "0 20px 40px rgba(90, 60, 10, 0.12), 0 0 0 0.5px rgba(139, 105, 20, 0.08)",
        borderRadius: "0px", // Crisp sharp edges reflecting premium Aavran layout
      }}
    >
      {/* 👤 My Account Header Section */}
      <div className="p-5 border-b border-[#8b6914]/10 dark:border-white/8 bg-[#F7F4EE]/60 dark:bg-black/20">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6914] dark:text-[#c9a227]">
          My Account
        </p>
        <div className="mt-2">
          <p className="text-sm font-semibold text-[#1c1408] dark:text-white truncate">
            {user?.fullname || "User"}
          </p>
          <p className="text-xs text-[#1c1408]/50 dark:text-white/40 truncate mt-0.5">
            {user?.email || ""}
          </p>
          {user?.role && (
            <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#8b6914]/30 dark:border-[#c9a227]/30 text-[#8b6914] dark:text-[#c9a227] bg-[#8b6914]/5 dark:bg-[#c9a227]/5">
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Menu Options */}
      <ul className="py-2 text-[#1c1408] dark:text-white/80 font-sans">
        <li>
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#8b6914]/8 dark:hover:bg-[#c9a227]/8 hover:text-[#8b6914] dark:hover:text-[#c9a227] transition-all no-underline"
          >
            <span className="text-sm">👤</span>
            <span>My Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to="/orders"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#8b6914]/8 dark:hover:bg-[#c9a227]/8 hover:text-[#8b6914] dark:hover:text-[#c9a227] transition-all no-underline"
          >
            <span className="text-sm">📦</span>
            <span>My Orders</span>
          </Link>
        </li>
        <li>
          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#8b6914]/8 dark:hover:bg-[#c9a227]/8 hover:text-[#8b6914] dark:hover:text-[#c9a227] transition-all no-underline"
          >
            <span className="text-sm">❤️</span>
            <span>Wishlist</span>
          </Link>
        </li>
        <li>
          <Link
            to="/address"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#8b6914]/8 dark:hover:bg-[#c9a227]/8 hover:text-[#8b6914] dark:hover:text-[#c9a227] transition-all no-underline"
          >
            <span className="text-sm">📍</span>
            <span>Saved Addresses</span>
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#8b6914]/8 dark:hover:bg-[#c9a227]/8 hover:text-[#8b6914] dark:hover:text-[#c9a227] transition-all no-underline"
          >
            <span className="text-sm">⚙️</span>
            <span>Settings</span>
          </Link>
        </li>
        <li className="border-t border-[#8b6914]/10 dark:border-white/8 mt-1 pt-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-wider font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-left"
          >
            <span className="text-sm">🚪</span>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AccountDropDown;
