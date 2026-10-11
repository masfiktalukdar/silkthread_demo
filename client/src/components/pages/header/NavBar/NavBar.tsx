"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo from "@/assets/logo/logo_navbar_taller.png";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs";
import { FiUser, FiPhone } from "react-icons/fi";
import { FaTruck } from "react-icons/fa";
import { RiCloseFill, RiMenuAddFill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import ResponsiveSearchForm from "../ResponsiveSearchForm/ResponsiveSearchForm";
import ResponsiveNavSidBar from "../ResponsiveNavSidBar/ResponsiveNavSidBar";
import "../NavBar/NavBar.css";
import { getShopSidebar } from "@/services/shopSidebar";
import { getUser, getAuthenticatedUser, setCorrelation } from "@/services/auth";
import UserPopover from "@/shared/UserPopover/UserPopover";
import { TUser } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import OfferAnnouncementBar from "@/components/shared/OfferAnnouncementBar/OfferAnnouncementBar";

interface NavBarProps {
  userCartProducts: {
    cartDetails: any[];
  };
}

const NavBar: React.FC<NavBarProps> = ({ userCartProducts }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const currentSearchTerm = searchParams?.get("searchTerm") || searchParams?.get("search") || "";
  const [searchValue, setSearchValue] = useState(currentSearchTerm);

  useEffect(() => {
    setSearchValue(currentSearchTerm);
  }, [currentSearchTerm]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<TUser | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop?searchTerm=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const placeholders = [
    "Search for products...",
    "Find your perfect item...",
    "What are you looking for?",
    "Discover amazing deals...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getShopSidebar();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authUser = await getAuthenticatedUser();
        if (authUser && authUser.id) {
          setCurrentUser(authUser);
        } else {
          await setCorrelation();
        }
      } catch (error) {
        console.error("Error checking auth in NavBar:", error);
      }
    };

    fetchUser();
  }, []);

  const isLoggedIn = Boolean(currentUser && currentUser.id);

  return (
    <>
      {/* Sticky Header: Announcement Bar (sticks if offer is turned on) + Main Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
        <OfferAnnouncementBar />
        {/* Main White Navbar Row */}
        <div className="border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between gap-3 md:gap-4 lg:gap-6">
              {/* Hamburger (Mobile) + Logo */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowSideMenu(!showSideMenu)}
                  className="cursor-pointer lg:hidden p-1 text-gray-700 hover:text-[#FF6C0C] transition-colors"
                  aria-label="Toggle Category Menu"
                >
                  {showSideMenu ? (
                    <RiCloseFill className="text-2xl" />
                  ) : (
                    <RiMenuAddFill className="text-2xl" />
                  )}
                </button>
                <div className="md:w-[150px] w-[110px] shrink-0">
                  <Link href="/">
                    <Image
                      src={logo || null}
                      alt="Silk Thread | Best E-commerce platform in BD"
                      width={150}
                      height={60}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </Link>
                </div>
              </div>

              {/* Desktop Search Bar with Animated Placeholder */}
              <div className="hidden lg:block flex-1 min-w-[200px] max-w-xl mx-2 relative">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    name="search"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-[2px] focus:border-[#FF6C0C] focus:outline-none transition-colors duration-300 text-sm"
                    placeholder=""
                  />
                  {!searchValue && (
                    <motion.div
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm select-none"
                    >
                      {placeholders[placeholderIndex]}
                    </motion.div>
                  )}
                  <button 
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#FF6C0C] text-white px-3.5 py-1.5 rounded-[2px] hover:bg-[#e55a00] transition-colors duration-300 cursor-pointer"
                    aria-label="Search"
                  >
                    <IoSearchOutline className="text-base" />
                  </button>
                </form>
              </div>

              {/* Right Side Icons */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                {/* Contact Number */}
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-[2px] shrink-0">
                  <FiPhone className="text-[#FF6C0C] text-base" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 leading-tight">Call Us</span>
                    <span className="text-xs font-semibold text-gray-700 leading-tight">+8801623-726069</span>
                  </div>
                </div>

                {/* Track Order */}
                <Link
                  href="/track-order"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200/60 rounded-[2px] transition-colors duration-200 shrink-0"
                >
                  <FaTruck className="text-[#FF6C0C] text-base" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 leading-none">Courier</span>
                    <span className="text-xs font-bold text-gray-800 leading-tight">Track Order</span>
                  </div>
                </Link>

                {/* Mobile Search Icon */}
                <button
                  type="button"
                  onClick={() => setShowSearch(true)}
                  className="p-2 rounded-full bg-[#FF6C0C] text-white cursor-pointer lg:hidden hover:bg-[#e55a00] transition-colors duration-300"
                  aria-label="Search"
                >
                  <IoSearchOutline className="text-lg" />
                </button>

                {/* Cart */}
                <Link href="/cart" className="shrink-0">
                  <div className="p-2 rounded-full relative bg-[#FF6C0C] text-white hover:bg-[#e55a00] transition-colors duration-300 flex items-center justify-center">
                    <BsCart2 className="text-lg" />
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="-top-1.5 -right-1.5 absolute min-w-5 h-5 px-1 text-[11px] font-bold text-white flex items-center justify-center rounded-full bg-red-600 shadow-xs"
                    >
                      {userCartProducts?.cartDetails?.reduce(
                        (sum: number, item: any) => sum + (Number(item?.quantity) || 1),
                        0
                      ) || 0}
                    </motion.p>
                  </div>
                </Link>

                {/* User */}
                <div className="shrink-0">
                  {isLoggedIn ? (
                    <div className="p-0.5 rounded-[2px] transition-colors duration-300">
                      <UserPopover user={currentUser} />
                    </div>
                  ) : (
                    <Link href="/login" aria-label="Sign In">
                      <div className="p-2 rounded-full bg-[#FF6C0C] text-white hover:bg-[#e55a00] transition-colors duration-300 flex items-center justify-center shadow-xs">
                        <FiUser className="text-lg" />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation Bar - ONLY DISPLAYED ON HOME PAGE & NOT STICKY (scrolls with page) */}
      {isHomePage && (
        <nav className="w-full bg-[#FF6C0C] text-white shadow-xs relative z-30 mb-0">
          <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
            {/* Desktop View (lg and up): Centered / spaced categories with dropdown */}
            <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 py-2 flex-wrap">
              <Link href="/shop">
                <div className="text-sm font-semibold tracking-wide py-1 px-3 rounded-[2px] hover:bg-white hover:text-[#FF6C0C] transition-all cursor-pointer whitespace-nowrap">
                  সকল ক্যাটাগরি (All)
                </div>
              </Link>
              {categories?.map((category, index) => (
                <div
                  onMouseEnter={() => setActiveCategory(category.slug || category.id || category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                  key={category._id || index}
                  className="relative group"
                >
                  <Link href={`/shop?category=${category.slug || category.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="text-sm font-medium tracking-wide duration-200 cursor-pointer whitespace-nowrap py-1 px-3 rounded-[2px] group-hover:bg-white group-hover:text-[#FF6C0C] transition-all"
                    >
                      {category.name || category.title}
                    </motion.div>
                  </Link>

                  {/* Subcategories Dropdown */}
                  {category.subCategories &&
                    category.subCategories.length > 0 &&
                    activeCategory === (category.slug || category.id || category.name) && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 bg-white shadow-xl rounded-[2px] p-2 min-w-[200px] z-50 border border-gray-200"
                      >
                        <div className="flex flex-col gap-0.5">
                          {category.subCategories.map((subCat: any, subIndex: number) => (
                            <Link
                              key={subCat._id || subIndex}
                              href={`/shop?category=${category.slug || category.id}&subCategory=${subCat.slug || subCat.id}`}
                            >
                              <div className="text-sm text-gray-700 hover:text-[#FF6C0C] hover:bg-orange-50 p-2 rounded-[2px] transition-colors">
                                {subCat.name || subCat.title}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                </div>
              ))}
            </div>

            {/* Mobile View (< lg): Sleek horizontally scrollable category pills strip */}
            <div className="lg:hidden flex items-center gap-1.5 py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
              <Link href="/shop" className="shrink-0">
                <span className="inline-block text-xs font-semibold py-1 px-2.5 rounded-[2px] bg-white/20 hover:bg-white hover:text-[#FF6C0C] text-white transition-colors whitespace-nowrap">
                  সব (All)
                </span>
              </Link>
              {categories?.map((category, index) => (
                <Link
                  key={category._id || index}
                  href={`/shop?category=${category.slug || category.id}`}
                  className="shrink-0"
                >
                  <span className="inline-block text-xs font-semibold py-1 px-2.5 rounded-[2px] bg-white/10 hover:bg-white hover:text-[#FF6C0C] text-white transition-colors whitespace-nowrap">
                    {category.name || category.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}

      <AnimatePresence>
        {showSearch && (
          <ResponsiveSearchForm onClose={() => setShowSearch(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSideMenu && (
          <ResponsiveNavSidBar onClose={() => setShowSideMenu(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;