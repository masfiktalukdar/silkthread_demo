'use client';

import React from "react";
import { rajdhani } from "@/app/font";
import ShopProductCard from "../ShopProductCard/ShopProductCard";
import { TProduct } from "@/types";

interface Products {
  relativeProducts: TProduct[];
}

const ReletiveProducts: React.FC<Products> = ({ relativeProducts }) => {
  if (!relativeProducts || relativeProducts.length === 0) {
    return null;
  }

  return (
    <div className="my-10 Container">
      <h2
        className={`text-xl sm:text-2xl font-bold border-b border-gray-200 pb-3 text-gray-800 ${rajdhani.className}`}
      >
        Related Products :
      </h2>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {relativeProducts.slice(0, 10).map((product) => (
          <ShopProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ReletiveProducts;
