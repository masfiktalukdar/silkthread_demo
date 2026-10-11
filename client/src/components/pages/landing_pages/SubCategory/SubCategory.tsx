import React from "react";

import { getAllProductsForShop } from "@/services/products";

import { addToCart } from "@/services/cart";
import ProductListClient from "../product/ProductListClient";
import { getUser } from "@/services/auth";

const SubCategory = async () => {
  const user = await getUser();
  const { data } = await getAllProductsForShop(undefined, undefined, undefined, 1, 100);
 
  return (
    <div className="Container pt-4 pb-2 sm:pt-6 sm:pb-3">
      <ProductListClient 
        products={data.result} 
        title="New Arrivals"
        subtitle="Exclusive Collection Just for You"
        userRef={user?.id }
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default SubCategory;