"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo/logo_navbar_taller.png";
import { usePathname, useRouter } from "next/navigation";
import {
  FiUser,
  FiPackage,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiTruck,
  FiShield,
  FiChevronRight,
  FiCheckCircle,
  FiMapPin,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { logout, getAuthenticatedUser } from "@/services/auth";
import { useState, useEffect } from "react";
import { TUser } from "@/types";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<TUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const authUser = await getAuthenticatedUser();
        if (authUser && authUser.id) {
          setUser(authUser);
        } else {
          // Redirect unauthenticated guests to login
          router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard/profile")}`);
          return;
        }
      } catch (err) {
        console.error("Dashboard auth check failed:", err);
      } finally {
        setAuthChecking(false);
      }
    };
    fetchAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    {
      name: "Profile & Address",
      subtitle: "Personal info, shipping address",
      href: "/dashboard/profile",
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      name: "My Orders",
      subtitle: "Track packages & order history",
      href: "/dashboard/orderHistory",
      icon: <FiPackage className="w-5 h-5" />,
    },
    {
      name: "Track Courier",
      subtitle: "Live Pathao & Steadfast status",
      href: "/track-order",
      icon: <FiTruck className="w-5 h-5" />,
    },
    {
      name: "Continue Shopping",
      subtitle: "Explore luxury handloom",
      href: "/shop",
      icon: <FiShoppingBag className="w-5 h-5" />,
    },
  ];

  const displayName = user?.name?.trim() || "Customer Account";
  const displayContact = user?.phone || user?.email || "Silk Thread Member";
  const avatarLetter = (user?.name?.trim() || user?.phone || "U").charAt(0).toUpperCase();

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF6C0C] rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-600">
            Verifying your Silk Thread membership...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col lg:flex-row antialiased text-gray-900">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-white border-r border-[#EFECE6] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Logo Bar */}
          <div className="p-5 sm:p-6 border-b border-[#F0ECE6] flex items-center justify-between bg-white">
            <Link href="/" className="inline-block transition-transform hover:scale-102">
              <Image
                src={logo}
                alt="Silk Thread | Handloom & Luxury Fashion"
                width={150}
                height={55}
                className="h-auto w-auto max-h-12 object-contain"
                priority
              />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-800 rounded-[2px] transition-colors"
              aria-label="Close menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Premium User Card */}
          <div className="p-4 mx-4 my-4 bg-gradient-to-br from-[#FFF9F5] via-white to-orange-50/40 border border-orange-200/70 rounded-[2px] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6C0C] to-[#E55A00] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md ring-2 ring-orange-200">
                {avatarLetter}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate font-medium">
                  {displayContact}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <FiCheckCircle className="w-2.5 h-2.5" /> Verified Customer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Account Management
            </p>
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 text-sm font-semibold rounded-[2px] transition-all duration-200 group ${
                      isActive
                        ? "bg-[#FFF4ED] text-[#FF6C0C] border-l-4 border-[#FF6C0C] shadow-xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`transition-colors ${
                          isActive
                            ? "text-[#FF6C0C]"
                            : "text-gray-400 group-hover:text-gray-700"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold truncate">
                          {item.name}
                        </span>
                        <span className="block text-[11px] font-normal text-gray-400 truncate hidden xl:block">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <FiChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive
                          ? "text-[#FF6C0C] translate-x-0.5"
                          : "text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Actions in Sidebar */}
        <div className="p-4 border-t border-[#F0ECE6] space-y-2 bg-gray-50/40">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-white rounded-[2px] border border-transparent hover:border-gray-200 transition-all"
          >
            <FiHome className="w-4 h-4 text-gray-400" />
            <span>Back to Storefront</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50/80 rounded-[2px] transition-colors cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EFECE6] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-[2px] border border-gray-200 hover:bg-gray-50"
              aria-label="Open menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
                  Welcome Back, {user?.name?.split(" ")[0] || "Valued Customer"}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-bold bg-orange-50 text-[#FF6C0C] border border-orange-200">
                  <FiShield className="w-2.5 h-2.5" /> Silk Thread Club
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Manage your delivery destination, parcel tracking, and luxury orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-[2px] border border-gray-200 transition-colors"
            >
              <FiShoppingBag className="w-3.5 h-3.5 text-[#FF6C0C]" />
              <span>Shop Collection</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-[2px] border border-red-200/60 transition-colors cursor-pointer"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}