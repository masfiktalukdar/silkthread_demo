"use client";

import React from "react";
import ShopProductCard from "../ShopProductCard/ShopProductCard";
import SearchCancel from "./SearchCancel";
import { TProduct } from "@/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Pagination {
  currentPage: number;
  currentPageLimit: number;
  total: number;
  totalPage: number;
  prevPage: number | null;
  nextPage: number | null;
}

interface ShopProductsProps {
  products: TProduct[];
  pagination: Pagination;
  categorySlug: string;
  subCategorySlug: string;
  childCategorySlug: string;
  searchTerm?: string;
}

const ShopProducts: React.FC<ShopProductsProps> = ({
  products,
  pagination,
  categorySlug,
  subCategorySlug,
  childCategorySlug,
  searchTerm,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPage || 1;
  const totalProducts = pagination?.total || products.length;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const startProduct = totalProducts === 0 ? 0 : (currentPage - 1) * 20 + 1;
  const endProduct = Math.min(currentPage * 20, totalProducts);

  return (
    <div className="p-2 sm:p-4">
      <div className="pb-4">
        <SearchCancel />
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-16 col-span-full bg-white rounded-[2px] border border-gray-100 shadow-xs my-4">
          <p className="font-semibold text-gray-700">
            {searchTerm ? `No products found matching "${searchTerm}"` : "No products available for now."}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {searchTerm ? "Try checking your spelling or searching for another keyword." : "Try changing category or search filters."}
          </p>
        </div>
      ) : (
        <>
          {/* Top pagination info */}
          <div className="flex justify-between items-center mb-4 text-xs sm:text-sm text-gray-500">
            <span>
              Showing <strong className="text-gray-900">{startProduct} - {endProduct}</strong> of{" "}
              <strong className="text-gray-900">{totalProducts}</strong> products
            </span>
            <span>
              Page <strong className="text-gray-900">{currentPage}</strong> of{" "}
              <strong className="text-gray-900">{totalPages}</strong>
            </span>
          </div>

          {/* 20 Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {products.map((product) => (
              <ShopProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Bottom Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
              <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                Showing <span className="font-semibold text-gray-800">{startProduct}</span> to{" "}
                <span className="font-semibold text-gray-800">{endProduct}</span> of{" "}
                <span className="font-semibold text-gray-800">{totalProducts}</span> results
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-2.5 sm:px-3 py-1.5 rounded-[2px] border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm flex items-center gap-1 font-medium cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, idx) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 py-1 text-gray-400 text-xs sm:text-sm select-none"
                      >
                        ...
                      </span>
                    );
                  }

                  const pageNum = Number(page);
                  const isActive = pageNum === currentPage;

                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[34px] sm:min-w-[38px] h-[34px] sm:h-[38px] px-2 rounded-[2px] text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#FF6C0C] text-white shadow-xs border border-[#FF6C0C]"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-2.5 sm:px-3 py-1.5 rounded-[2px] border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm flex items-center gap-1 font-medium cursor-pointer"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopProducts;
