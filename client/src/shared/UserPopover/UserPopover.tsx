"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/services/auth";
import Link from "next/link";
import { FiUser, FiPackage, FiLogOut, FiTruck, FiChevronRight, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import { TUser } from "@/types";

interface UserPopoverProps {
  user?: TUser | null;
}

const UserPopover: React.FC<UserPopoverProps> = ({ user }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      setOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayName = user?.name?.trim() || "My Account";
  const displaySubtitle = user?.phone || user?.email || "Silk Thread Member";
  const avatarLetter = (user?.name?.trim() || user?.phone || "U").charAt(0).toUpperCase();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="User Account"
          className="flex items-center gap-2 py-1 px-1.5 sm:px-2 rounded-[2px] bg-orange-50/80 hover:bg-orange-100/90 text-[#FF6C0C] transition-all cursor-pointer border border-[#FF6C0C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF6C0C]/30"
        >
          <div className="w-6 h-6 rounded-full bg-[#FF6C0C] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {avatarLetter}
          </div>
          <span className="text-xs font-bold text-gray-800 max-w-[90px] truncate hidden md:inline-block">
            {displayName}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 p-0 bg-white rounded-[2px] shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150"
      >
        {/* User Card Header */}
        <div className="p-4 bg-gradient-to-br from-[#FFF9F5] via-white to-orange-50/40 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6C0C] to-[#E55A00] text-white flex items-center justify-center text-base font-black shadow-sm shrink-0">
              {avatarLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {displaySubtitle}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FiShield className="w-2.5 h-2.5" /> Verified Member
              </span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="p-2 space-y-0.5">
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:text-[#FF6C0C] hover:bg-orange-50/70 rounded-[2px] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-[2px] bg-gray-100 text-gray-600 group-hover:bg-[#FF6C0C]/10 group-hover:text-[#FF6C0C] transition-colors">
                <FiUser className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-xs">Profile &amp; Address</span>
            </div>
            <FiChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF6C0C] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/dashboard/orderHistory"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:text-[#FF6C0C] hover:bg-orange-50/70 rounded-[2px] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-[2px] bg-gray-100 text-gray-600 group-hover:bg-[#FF6C0C]/10 group-hover:text-[#FF6C0C] transition-colors">
                <FiPackage className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-xs">My Orders &amp; Invoices</span>
            </div>
            <FiChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF6C0C] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/track-order"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:text-[#FF6C0C] hover:bg-orange-50/70 rounded-[2px] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-[2px] bg-gray-100 text-gray-600 group-hover:bg-[#FF6C0C]/10 group-hover:text-[#FF6C0C] transition-colors">
                <FiTruck className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-xs">Live Order Tracking</span>
            </div>
            <FiChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF6C0C] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Divider & Sign Out */}
        <div className="p-2 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-[2px] transition-colors cursor-pointer"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
