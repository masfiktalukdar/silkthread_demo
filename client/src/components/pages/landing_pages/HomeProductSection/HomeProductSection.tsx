import { TProduct } from "@/types";

import { addToCart } from "@/services/cart";
// import MainProduct from "../../products/ProductCard/ProductCard";
import HomeProductSection from "../../products/ProductCard/ProductCard";
import { getUser } from "@/services/auth";
interface SectionData {
  category: TProduct;
  result: TProduct[];
}

interface ProductsProps {
  products?:
    | SectionData
    | SectionData[]
    | {
        category?: TProduct;
        result?: TProduct[];
        sections?: SectionData[];
      }
    | null;
}

const HomeProducts = async ({ products }: ProductsProps) => {
  const user = await getUser();
  if (!products) return null;

  let sections: SectionData[] = [];
  if (Array.isArray(products)) {
    sections = products;
  } else if (
    (products as any)?.sections &&
    Array.isArray((products as any).sections)
  ) {
    sections = (products as any).sections;
  } else if ((products as any)?.category) {
    sections = [products as SectionData];
  }

  if (sections.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {sections.map((section, idx) => (
        <div key={(section.category as any)?._id || idx}>
          <HomeProductSection
            products={section}
            userRef={user?.id}
            onAddToCart={addToCart}
          />
        </div>
      ))}
    </div>
  );
};

export default HomeProducts;
