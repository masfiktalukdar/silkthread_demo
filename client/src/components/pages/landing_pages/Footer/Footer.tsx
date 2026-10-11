"use client";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaRegCreditCard,
  FaTruck,
  FaYoutube,
} from "react-icons/fa";
import { FaRegMessage, FaRightLeft, FaTiktok } from "react-icons/fa6";
import Link from "next/link";

interface FooterProps {
  userCartProducts: {
    cartDetails: any[];
  };
}

const Footer: React.FC<FooterProps> = ({ userCartProducts }) => {
  const quickLink = [
    {
      name: "Shop",
      link: "/shop",
    },
    {
      name: "About Us",
      link: "/about",
    },
    {
      name: "Contact Us",
      link: "/contact",
    },
  ];

  const information = [
    {
      name: "Privacy Policy",
      link: "/privacyPolicy",
    },
    {
      name: "Return Policy",
      link: "/returnPolicy",
    },
    {
      name: "Terms & Condition",
      link: "/terms-condition",
    },
  ];

  return (
    <div className="relative">
      <div className="w-full bg-[#F3F3F3]">
        <div className="Container">
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:justify-center mx-auto py-5 lg:py-10 gap-y-4 gap-x-2">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="lg:text-xl text-white bg-[#FF6C0C] p-3 rounded-full">
                <FaTruck />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="text-md lg:text-xl font-semibold">Free Shipping</div>
                <div className="text-sm text-gray-600">
                  Free Shipping for orders
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="lg:text-xl text-white bg-[#FF6C0C] p-3 rounded-full">
                <FaRightLeft />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="text-md lg:text-xl font-semibold">Return & Exchanges</div>
                <div className="text-sm text-gray-600">
                  Free Shipping for orders
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="lg:text-xl text-white bg-[#FF6C0C] p-3 rounded-full">
                <FaRegMessage />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="text-md lg:text-xl font-semibold">Online Support</div>
                <div className="text-sm text-gray-600">
                  24 hours a day, 7 days a week
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="lg:text-xl text-white bg-[#FF6C0C] p-3 rounded-full">
                <FaRegCreditCard />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="text-md lg:text-xl font-semibold">Flexible payment</div>
                <div className="text-sm text-gray-600">
                  Pay with Multiple Credit Cards
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#D9D9D9]">
        <div className="Container py-8 sm:py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Contact Info */}
            <div className="col-span-1">
              <div className="text-black font-bold mb-3 text-lg lg:text-xl">
                Contact Info
              </div>
              <div className="text-black text-sm lg:text-base flex flex-col space-y-1.5">
                <div>WhatsApp: 01623-726069</div>
                <div>Phone: 01623-726069</div>
                <div>email: silkthread.bd@gmail.com</div>
                <div>Address: Mirpur 2, Opposite of Stadium Gate no. 1, Dhaka</div>
              </div>
            </div>

            {/* Quick Links & Information Side by Side on Mobile */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-8">
              <div>
                <div className="text-black font-bold mb-3 text-lg lg:text-xl">
                  Quick Links
                </div>
                <ul className="text-black text-sm lg:text-base space-y-1.5">
                  {quickLink.map((item, index) => (
                    <li key={index} className="relative group cursor-pointer">
                      <Link href={item.link}>
                        <span className="inline-block transition-all duration-300 group-hover:translate-x-1.5 hover:text-[#FF6C0C]">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-black font-bold mb-3 text-lg lg:text-xl">
                  Information
                </div>
                <ul className="text-black text-sm lg:text-base space-y-1.5">
                  {information.map((item, index) => (
                    <li key={index} className="relative group cursor-pointer">
                      <Link href={item.link}>
                        <span className="inline-block transition-all duration-300 group-hover:translate-x-1.5 hover:text-[#FF6C0C]">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social Media - Evenly Sized Squares */}
            <div className="col-span-1">
              <div className="text-black font-bold mb-3 text-lg lg:text-xl">
                Social Media
              </div>
              <div className="flex items-center gap-2.5 mt-2">
                <a
                  href="https://www.facebook.com/share/1BfwmV2KcS/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-[2px] bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-lg" />
                </a>

                <a
                  href="https://youtube.com/@silkthread-d3v?si=oA7cwongy2QewMZ_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-[2px] bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-lg" />
                </a>

                <a
                  href="https://www.instagram.com/silk3866?igsh=MXJjcWk3ZnBhOTJo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-[2px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-xl" />
                </a>

                <a
                  href="http://tiktok.com/@silk.thread5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-[2px] bg-black text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
                  aria-label="TikTok"
                >
                  <FaTiktok className="text-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#37383F] text-white text-center py-3 px-4 text-xs sm:text-sm">
        Copyright © 2026 Silk Thread. All Right Reserved. Developed by{" "}
        <a target="_blank" href="https://okobiz.com/" className="text-orange-400 hover:underline">
          Okobiz
        </a>
      </div>
    </div>
  );
};

export default Footer;
