"use server";
import { apiBaseUrl } from "@/config/config";
import { apiRequest } from "@/lib/apiRequest";
import { TResponse } from "@/types";

export const getHomePageSubCategoryProducts = async (viewType?: string) => {
  const result: TResponse = await apiRequest({
    endpoint: `/product/view-type?viewType=${viewType}`,
  });
  return result;
};

export const getAllProductsForShop = async (
  categorySlug?: string,
  subCategorySlug?: string,
  childCategorySlug?: string,
  page?: number,
  limit?: number,
  searchTerm?: string
) => {
  const searchParams = new URLSearchParams();

  if (categorySlug) {
    const categories = categorySlug.split(",");
    categories.forEach((cat) => {
      searchParams.append("categorySlug", cat);
    });
  }

  if (subCategorySlug) {
    const subCategories = subCategorySlug.split(",");
    subCategories.forEach((sub) => {
      searchParams.append("subCategorySlug", sub);
    });
  }

  if (childCategorySlug) {
    const childCategories = childCategorySlug.split(",");
    childCategories.forEach((child) => {
      searchParams.append("childCategorySlug", child);
    });
  }

  if (page) {
    searchParams.append("page", page.toString()); // ✅ Add page to URL
  }

  if (limit) {
    searchParams.append("limit", limit.toString());
  }

  if (searchTerm && searchTerm.trim()) {
    searchParams.append("searchTerm", searchTerm.trim());
  }

  const url = `${apiBaseUrl}/product/pagination?${searchParams.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

export const getSingleProductBySlug = async (_id: string) => {
  const res = await fetch(`${apiBaseUrl}/product/${_id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};

export const getRelativeProducts = async (productId: { productId: string }) => {
  const res = await fetch(`${apiBaseUrl}/product/related-product/${productId}`, { cache: "no-store" });

  return res.json();
};

// export const getRelativeProducts = async () => {
//   const res = await fetch(`${apiBaseUrl}/category`);

//   return res.json();
// };

export const getSearchProducts = async (search: { search: string }) => {
  const res = await fetch(`${apiBaseUrl}/product/search?search=${search?.search}`, { cache: "no-store" });

  return res.json();
};
