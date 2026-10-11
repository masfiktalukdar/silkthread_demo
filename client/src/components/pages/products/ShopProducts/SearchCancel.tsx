"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { HiMiniXMark } from "react-icons/hi2";

const SearchCancel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categorySlugs = searchParams.getAll("category");
  const subCategorySlugs = searchParams.getAll("subCategory");
  const childCategorySlugs = searchParams.getAll("childCategory");

  // Split categories by commas
  const allCategories = categorySlugs.flatMap((cat) => cat.split(","));
  const allSubCategories = subCategorySlugs.flatMap((sub) => sub.split(","));
  const allChildCategories = childCategorySlugs.flatMap((sub) => sub.split(","));

  // const handleClear = () => {
  //   const newParams = new URLSearchParams(searchParams.toString());


  //   // Remove all categories and subcategories
  //   categorySlugs.forEach((cat) => newParams.delete("category"));
  //   subCategorySlugs.forEach((sub) => newParams.delete("subCategory"));

  //   router.replace(`?${newParams.toString()}`);
  // };

  const searchTerm = searchParams.get("searchTerm") || searchParams.get("search") || "";

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("searchTerm");
    newParams.delete("search");
    newParams.delete("page");
    router.push(`?${newParams.toString()}`);
  };

  const handleClear = (type: "category" | "subCategory" | "childCategory", value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentValues = new Set((searchParams.get(type)?.split(",") || []).filter(Boolean));

    if (currentValues.has(value)) {
      currentValues.delete(value);
    } else {
      currentValues.add(value);
    }

    if (currentValues.size > 0) {
      newParams.set(type, Array.from(currentValues).join(","));
    } else {
      newParams.delete(type);
    }

    router.push(`?${newParams.toString()}`);
  };

  // Don't show the component if no categories, subcategories or search are present
  if (categorySlugs.length === 0 && subCategorySlugs.length === 0 && childCategorySlugs.length === 0 && !searchTerm) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 items-center">
      {/* Search tag */}
      {searchTerm && (
        <div className="bg-[#FF6C0C] inline-flex p-1 px-2.5 rounded-[2px] text-white text-xs sm:text-sm items-center justify-center gap-1.5 shadow-xs">
          <span>Search: &ldquo;{searchTerm}&rdquo;</span>
          <HiMiniXMark className="text-base cursor-pointer hover:text-orange-200 transition-colors" onClick={handleClearSearch} />
        </div>
      )}

      {/* Render selected categories in separate divs */}
      {allCategories.length > 0 && (
        // <div className="flex gap-x-2">
        <>
          {allCategories.map((cat, index) => (
            <div key={index} className="bg-[#495588] inline-flex p-1 px-2 rounded text-[#fff] text-sm items-center justify-center gap-1 capitalize">
              <p>{cat}</p>
              <HiMiniXMark className="text-lg cursor-pointer" onClick={() => handleClear("category", cat)} />
            </div>
          ))}
        </>

      )}

      {allSubCategories.length > 0 && (
        <>
          {allSubCategories.map((sub, index) => (
            <div key={index} className="bg-[#495588] inline-flex p-1 px-2 rounded text-[#fff] text-sm items-center justify-center gap-1 capitalize">
              <p>{sub}</p>
              <HiMiniXMark className="text-lg cursor-pointer" onClick={() => handleClear("subCategory", sub)} />
            </div>
          ))}
        </>
      )}

      {allChildCategories.length > 0 && (
        <>
          {allChildCategories.map((child, index) => (
            <div key={index} className="bg-[#495588] inline-flex p-1 px-2 rounded text-[#fff] text-sm items-center justify-center gap-1 capitalize">
              <p>{child}</p>
              <HiMiniXMark className="text-lg cursor-pointer" onClick={() => handleClear("childCategory", child)} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchCancel;
