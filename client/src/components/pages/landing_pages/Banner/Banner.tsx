import { getAllBanners } from "@/services/banners";
import BannerSlider from "@/slider/BannerSlider/BannerSlider";
import { TBanner } from "@/types";
import React from "react";
export const dynamic = "force-dynamic";
interface BannerProps {
  banners: TBanner[];
}
const Banner: React.FC<BannerProps> = async () => {
  const { data: banners } = await getAllBanners();

  const mainBanner = banners?.filter(
    (banner: { type: string }) => banner.type === "MAIN BANNER"
  );

  return (
    <div className="Container mt-0 pt-0">
        <BannerSlider banners={mainBanner} />
    </div>
  );
};

export default Banner;
