import ShopProducts from "@/components/pages/products/ShopProducts/ShopProducts";
import ShopProductsCategories from "@/components/pages/products/ShopProductsCategories/ShopProductsCategories";
import { getShopSidebar } from "@/services/shopSidebar";
import { getAllProductsForShop } from "@/services/products";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
// import NavBar from "@/components/pages/header/NavBar/NavBar";
import CartSideBar from "@/components/pages/cartSideBar/CartSideBar";
import React from "react";
import UpcomingSideBanner from "@/components/pages/UpcomingSideBanner/UpcomingSideBanner";
import { getAllBanners } from "@/services/banners";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Silk Thread | All Product",
  description: "Best E-commerce platform in BD",
};

export const revalidate = 0;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { data: shopSideBar } = await getShopSidebar();

  const categorySlug = Array.isArray(params.category)
    ? params.category[0]
    : params.category || "";

  const subCategorySlug = Array.isArray(params.subCategory)
    ? params.subCategory[0]
    : params.subCategory || "";

  const childCategorySlug = Array.isArray(params.childCategory)
    ? params.childCategory[0]
    : params.childCategory || "";

  const searchTerm = Array.isArray(params.searchTerm)
    ? params.searchTerm[0]
    : params.searchTerm || (Array.isArray(params.search) ? params.search[0] : params.search) || "";

  const page = Number(params.page) || 1;

  const { data: products } = await getAllProductsForShop(
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    page,
    20,
    searchTerm
  );

  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const cartProducts = await getCartProducts(userId, coupon);

  const { data: banners } = await getAllBanners();

  const sortedData = [...(products?.result || [])].sort((a, b) => (a.priority === b.priority ? 0 : a.priority ? -1 : 1));
  

  return (
    <>
      {/* <NavBar userCartProducts={cartProducts?.data} /> */}
      <div className="flex min-h-screen Container mt-4 sm:mt-6">
        <div className="w-[20%] hidden lg:block mt-2">
          <ShopProductsCategories shopSideBar={shopSideBar} />
        </div>
        <div className="flex-1">
          <ShopProducts
            products={sortedData}
            pagination={products.pagination}
            categorySlug={categorySlug}
            subCategorySlug={subCategorySlug}
            childCategorySlug={childCategorySlug}
            searchTerm={searchTerm}
          />
        </div>
        <CartSideBar cartProducts={cartProducts?.data} />
        <UpcomingSideBanner banners={banners} />
      </div>
    </>
  );
}
