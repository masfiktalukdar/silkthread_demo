"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { apiBaseUrl } from "@/config/config";
import cashOnDelivery from "@/assets/payment/cash-on-delivery.png";
import bikashNagad from "@/assets/payment/bikash-nagad.jpg";
import { addOrder } from "@/services/order";
import { getUser, getAuthenticatedUser } from "@/services/auth";
import { getUserInformation } from "@/services/userInformation";
import { TProduct } from "@/types";
import { BD_LOCATIONS, Division, District } from "@/utilits/bdLocations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import orderGift from "@/assets/gift/animation.gif";
import { Truck, CheckCircle2, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

interface FormData {
  customerName: string;
  customerPhone: string;
  customerDivision: string;
  customerCity: string; // District
  customerThana: string;
  customerAddress: string;
  deliveryArea: "inside_dhaka" | "outside_dhaka";
  paymentMethod: string;
  coupon?: string;
  terms?: boolean;
  mobileBankingProvider?: string;
  mobileNumber?: string;
  transactionId?: string;
}

interface Props {
  userRef: string;
  products: any;
  shipping: number;
  setShipping: React.Dispatch<React.SetStateAction<number>>;
  setCoupon: React.Dispatch<React.SetStateAction<string | null>>;
  type: React.Dispatch<React.SetStateAction<string | null>>;
}

const CheckOutForm: React.FC<Props> = ({
  userRef,
  products,
  shipping,
  setShipping,
  setCoupon,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startCar, setStartCar] = useState(false);
  const [finalY, setFinalY] = useState(10);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      deliveryArea: "inside_dhaka",
      paymentMethod: "CashOnDelivery",
    },
  });

  const [showMobileBanking, setShowMobileBanking] = useState(false);
  const selectedPayment = watch("paymentMethod");
  const selectedMobileBank = watch("mobileBankingProvider");
  const selectedDeliveryArea = watch("deliveryArea") || "inside_dhaka";

  // Location Normalization & Fuzzy Matchers
  const normalizeLocation = (val: string) => (val || "").trim().toLowerCase();

  const matchDivision = (query: string) => {
    if (!query) return null;
    const q = normalizeLocation(query);
    return (
      BD_LOCATIONS.find((d) => {
        const name = normalizeLocation(d.name);
        if (name === q) return true;
        const dParts = name.split("/").map(normalizeLocation);
        const qParts = q.split("/").map(normalizeLocation);
        return dParts.some((dp) =>
          qParts.some((qp) => dp === qp || dp.includes(qp) || qp.includes(dp))
        );
      }) || null
    );
  };

  const matchDistrict = (districts: District[], query: string) => {
    if (!query || !districts?.length) return null;
    const q = normalizeLocation(query);
    return (
      districts.find((d) => {
        const name = normalizeLocation(d.name);
        if (name === q) return true;
        const dParts = name.split("/").map(normalizeLocation);
        const qParts = q.split("/").map(normalizeLocation);
        return dParts.some((dp) =>
          qParts.some((qp) => dp === qp || dp.includes(qp) || qp.includes(dp))
        );
      }) || null
    );
  };

  const matchThana = (thanas: string[], query: string) => {
    if (!query || !thanas?.length) return query || "";
    const q = normalizeLocation(query);
    const found = thanas.find((t) => {
      const name = normalizeLocation(t);
      if (name === q) return true;
      const tParts = name.split("/").map(normalizeLocation);
      const qParts = q.split("/").map(normalizeLocation);
      return tParts.some((tp) =>
        qParts.some((qp) => tp === qp || tp.includes(qp) || qp.includes(tp))
      );
    });
    return found || query;
  };

  // Cascading Address State derived synchronously
  const selectedDivision = watch("customerDivision");
  const selectedDistrict = watch("customerCity");
  const selectedThana = watch("customerThana");

  const currentDivisionObj = useMemo(() => {
    if (!selectedDivision) return null;
    return matchDivision(selectedDivision);
  }, [selectedDivision]);

  const districtsList = useMemo(() => {
    return currentDivisionObj ? currentDivisionObj.districts : [];
  }, [currentDivisionObj]);

  const currentDistrictObj = useMemo(() => {
    if (!selectedDistrict || !districtsList.length) return null;
    return matchDistrict(districtsList, selectedDistrict);
  }, [selectedDistrict, districtsList]);

  const thanasList = useMemo(() => {
    return currentDistrictObj ? currentDistrictObj.thanas : [];
  }, [currentDistrictObj]);

  const [autoFilledUser, setAutoFilledUser] = useState<any>(null);

  // Check if Free Shipping on 3+ items offer is active from API
  const [offerActive, setOfferActive] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/shippingMethod`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          const offer = data.data.find(
            (m: any) => m.shippingMethod === "FREE_SHIPPING_ON_3_ITEMS"
          );
          if (offer && Boolean(offer.status)) {
            setOfferActive(true);
          } else {
            setOfferActive(false);
          }
        }
      })
      .catch(console.error);
  }, []);

  // Auto-fill logged-in user profile & address information
  useEffect(() => {
    const fetchAndPopulateUser = async () => {
      try {
        let authUser = await getAuthenticatedUser();
        if (!authUser) {
          const fallback = await getUser();
          if (fallback && "id" in fallback && !fallback.id.includes("-")) {
            authUser = fallback as any;
          }
        }

        const effectiveUserId =
          userRef && userRef !== "undefined" && userRef !== "null"
            ? userRef
            : authUser?.id;

        let userInfo: any = null;
        if (effectiveUserId && /^[a-f\d]{24}$/i.test(effectiveUserId)) {
          try {
            const res = await getUserInformation(effectiveUserId);
            userInfo = (res as { data: any })?.data;
          } catch {
            userInfo = authUser;
          }
        } else {
          userInfo = authUser;
        }

        if (userInfo) {
          setAutoFilledUser(userInfo);

          // 1. Name & Phone
          if (userInfo.name) {
            setValue("customerName", userInfo.name, { shouldValidate: true });
          }
          if (userInfo.phone) {
            setValue("customerPhone", userInfo.phone, { shouldValidate: true });
          }

          // 2. Full address details
          const divName = userInfo.division || userInfo.state || "";
          const distName = userInfo.district || userInfo.city || "";
          const thanaName = userInfo.thana || "";
          const addr = userInfo.fullAddress || userInfo.address || "";

          if (addr) {
            setValue("customerAddress", addr, { shouldValidate: true });
          }

          if (divName) {
            const foundDiv = matchDivision(divName);
            if (foundDiv) {
              setValue("customerDivision", foundDiv.name, { shouldValidate: true });

              if (distName) {
                const foundDist = matchDistrict(foundDiv.districts, distName);
                if (foundDist) {
                  setValue("customerCity", foundDist.name, { shouldValidate: true });

                  if (
                    foundDist.name.toLowerCase().includes("dhaka") ||
                    foundDist.name.includes("ঢাকা")
                  ) {
                    setValue("deliveryArea", "inside_dhaka");
                  } else {
                    setValue("deliveryArea", "outside_dhaka");
                  }

                  if (thanaName) {
                    const foundThana = matchThana(foundDist.thanas, thanaName);
                    setValue("customerThana", foundThana, { shouldValidate: true });
                  }
                }
              }
            }
          }

          clearErrors(["customerDivision", "customerCity", "customerThana"]);
        }
      } catch (err) {
        console.error("Error auto-filling user profile in checkout:", err);
      }
    };

    fetchAndPopulateUser();
  }, [userRef, setValue, clearErrors]);

  const cartDetails = products?.data?.cartDetails || products?.cartDetails || [];

  const totalItems =
    cartDetails.reduce(
      (acc: number, item: any) => acc + (Number(item.quantity) || 1),
      0
    ) || 0;

  // Has free delivery on 3+ items discount OR product-level free shipping
  const isFreeShipping = Boolean(offerActive && totalItems >= 3);

  // Update shipping price based on area and free shipping
  useEffect(() => {
    if (isFreeShipping) {
      setShipping(0);
    } else if (selectedDeliveryArea === "inside_dhaka") {
      setShipping(60);
    } else {
      setShipping(120);
    }
  }, [isFreeShipping, selectedDeliveryArea, setShipping]);

  // ----------------- Price Calculations -----------------
  // Subtotal is price before discount
  const subtotal = cartDetails.reduce((sum: number, item: any) => {
    const origPrice =
      Number(item.product?.mrpPrice) > 0
        ? Number(item.product?.mrpPrice)
        : Number(item.product?.price || 0);
    return sum + origPrice * (Number(item.quantity) || 1);
  }, 0);

  // Product-level discounts sum
  const productDiscounts = cartDetails.reduce((sum: number, item: any) => {
    const origPrice =
      Number(item.product?.mrpPrice) > 0
        ? Number(item.product?.mrpPrice)
        : Number(item.product?.price || 0);
    const salePrice = Number(item.product?.price || origPrice);
    const itemDiscount = Math.max(0, origPrice - salePrice);
    return sum + itemDiscount * (Number(item.quantity) || 1);
  }, 0);

  // Coupon discount
  const couponDiscount =
    Number(products?.data?.couponDiscount || products?.couponDiscount) || 0;

  // Discount is all the sum of given discount
  const totalDiscount = productDiscounts + couponDiscount;

  // Grand total is subtotal + shipping - discount
  const grandTotal = Math.max(0, subtotal + (shipping || 0) - totalDiscount);

  // ----------------- Apply Coupon -----------------
  const handleAddCoupon = () => {
    const coupon = getValues("coupon")?.trim();
    if (coupon) {
      setCoupon(coupon);
      toast.success("Coupon code applied successfully!", {
        theme: "colored",
        autoClose: 4000,
      });
    } else {
      setCoupon(null);
      toast.info("Please enter a valid coupon code.", {
        theme: "colored",
        autoClose: 3000,
      });
    }
  };

  // ----------------- Submit Handler -----------------
  const onSubmit = async (data: FormData) => {
    try {
      const fullAddressString = `${data.customerAddress}, Thana: ${data.customerThana || "N/A"}, District: ${data.customerCity}, Division: ${data.customerDivision}`;

      const order = {
        productRef: products?.data?.productRef,
        quantity: totalItems || 1,
        userRef,
        subTotalPrice: subtotal,
        totalPrice: grandTotal,
        couponDiscount: totalDiscount,
        shippingCost: shipping || 0,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerDivision: data.customerDivision,
        customerCity: data.customerCity,
        customerThana: data.customerThana,
        customerAddress: fullAddressString,
        paymentMethod: data.paymentMethod,
        mobileBankingProvider: data.mobileBankingProvider,
        mobileNumber: data.mobileNumber,
        transactionId: data.transactionId,
        deliveryArea: data.deliveryArea,
      };

      setIsSubmitting(true);
      const result = (await addOrder(order)) as {
        status: string;
        message?: string;
        url?: string;
      };

      if (result?.url) {
        window.location.href = result.url;
        return;
      }

      setStartCar(true);
      setTimeout(() => {
        toast.success("Order placed successfully! Thank you for shopping.", {
          theme: "colored",
          autoClose: 4000,
        });
        router.push("/thank-you");
        setIsSubmitting(false);
        setStartCar(false);
      }, 1500);
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to confirm order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:mt-4 mt-2">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          কাস্টমার ও ডেলিভারি তথ্য (Checkout Info)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          অর্ডারটি সম্পন্ন করতে অনুগ্রহ করে আপনার সঠিক নাম, ঠিকানা ও মোবাইল নম্বর প্রদান করুন
        </p>
      </div>

      {autoFilledUser && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-[2px] flex items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Signed in as <strong>{autoFilledUser.name || autoFilledUser.phone}</strong>. Your saved contact &amp; address details have been auto-filled!
            </span>
          </div>
          <Link
            href="/dashboard/profile"
            className="text-xs font-bold text-[#FF6C0C] hover:underline shrink-0"
          >
            Update in Profile
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Basic Info */}
        <div className="bg-white p-5 sm:p-6 rounded-[2px] border border-gray-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                আপনার নাম *
              </label>
              <input
                type="text"
                placeholder="আপনার পূর্ণ নাম লিখুন *"
                className="w-full border border-gray-300 p-2.5 rounded-[2px] text-sm focus:border-[#FF6C0C] focus:ring-1 focus:ring-[#FF6C0C] focus:outline-none transition-all"
                {...register("customerName", { required: "আপনার নাম দেওয়া বাধ্যতামূলক" })}
              />
              {errors.customerName && (
                <span className="text-red-500 text-xs mt-1 block">
                  {String(errors.customerName.message)}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                আপনার মোবাইল নম্বর *
              </label>
              <input
                type="tel"
                placeholder="১১ ডিজিটের মোবাইল নাম্বার লিখুন *"
                className="w-full border border-gray-300 p-2.5 rounded-[2px] text-sm focus:border-[#FF6C0C] focus:ring-1 focus:ring-[#FF6C0C] focus:outline-none transition-all"
                {...register("customerPhone", {
                  required: "মোবাইল নাম্বার দেওয়া বাধ্যতামূলক",
                  pattern: {
                    value: /^01[3-9]\d{8}$/,
                    message: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)",
                  },
                })}
              />
              {errors.customerPhone && (
                <span className="text-red-500 text-xs mt-1 block">
                  {String(errors.customerPhone.message)}
                </span>
              )}
            </div>
          </div>

          {/* Cascading Address Selectors: Division -> District -> Thana */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Division */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                বিভাগ / Division *
              </label>
              <Controller
                name="customerDivision"
                control={control}
                rules={{ required: "বিভাগ নির্বাচন করুন" }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="customerDivision"
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      setValue("customerCity", "", { shouldValidate: true });
                      setValue("customerThana", "", { shouldValidate: true });
                    }}
                    className="w-full border border-gray-300 p-2.5 rounded-[2px] text-sm bg-white focus:border-[#FF6C0C] focus:ring-1 focus:ring-[#FF6C0C] focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="">-- বিভাগ নির্বাচন করুন --</option>
                    {BD_LOCATIONS.map((division) => (
                      <option key={division.name} value={division.name}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.customerDivision && (
                <span className="text-red-500 text-xs mt-1 block">
                  {String(errors.customerDivision.message)}
                </span>
              )}
            </div>

            {/* District */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                জেলা / District *
              </label>
              <Controller
                name="customerCity"
                control={control}
                rules={{ required: "জেলা নির্বাচন করুন" }}
                render={({ field }) => {
                  const currentValue = field.value || "";
                  const hasMatchingOption =
                    currentValue && districtsList.some((d) => d.name === currentValue);

                  return (
                    <select
                      {...field}
                      id="customerCity"
                      disabled={!selectedDivision}
                      value={currentValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        setValue("customerThana", "", { shouldValidate: true });
                        if (
                          val.toLowerCase().includes("dhaka") ||
                          val.includes("ঢাকা")
                        ) {
                          setValue("deliveryArea", "inside_dhaka");
                        } else if (val) {
                          setValue("deliveryArea", "outside_dhaka");
                        }
                      }}
                      className={`w-full border border-gray-300 p-2.5 rounded-[2px] text-sm bg-white focus:border-[#FF6C0C] focus:ring-1 focus:ring-[#FF6C0C] focus:outline-none transition-all ${
                        !selectedDivision
                          ? "bg-gray-100 cursor-not-allowed text-gray-400"
                          : "cursor-pointer"
                      }`}
                    >
                      <option value="">
                        {selectedDivision
                          ? "-- জেলা নির্বাচন করুন --"
                          : "আগে বিভাগ নির্বাচন করুন"}
                      </option>
                      {/* Safety: Render current value if it was saved and not yet in list */}
                      {currentValue && !hasMatchingOption && (
                        <option value={currentValue}>{currentValue}</option>
                      )}
                      {districtsList.map((district) => (
                        <option key={district.name} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  );
                }}
              />
              {errors.customerCity && (
                <span className="text-red-500 text-xs mt-1 block">
                  {String(errors.customerCity.message)}
                </span>
              )}
            </div>

            {/* Thana */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                থানা / উপজেলা / Thana
              </label>
              <Controller
                name="customerThana"
                control={control}
                render={({ field }) => {
                  const currentValue = field.value || "";
                  const hasMatchingOption =
                    currentValue &&
                    (thanasList.includes(currentValue) ||
                      currentValue === "Other / অন্যান্য");

                  return (
                    <select
                      {...field}
                      id="customerThana"
                      disabled={!selectedDistrict}
                      value={currentValue}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      className={`w-full border border-gray-300 p-2.5 rounded-[2px] text-sm bg-white focus:border-[#FF6C0C] focus:ring-1 focus:ring-[#FF6C0C] focus:outline-none transition-all ${
                        !selectedDistrict
                          ? "bg-gray-100 cursor-not-allowed text-gray-400"
                          : "cursor-pointer"
                      }`}
                    >
                      <option value="">
                        {selectedDistrict
                          ? "-- থানা / উপজেলা নির্বাচন করুন --"
                          : "আগে জেলা নির্বাচন করুন"}
                      </option>
                      {/* Safety: Render current value if saved and not in standard thanas */}
                      {currentValue && !hasMatchingOption && (
                        <option value={currentValue}>{currentValue}</option>
                      )}
                      {thanasList.map((thana) => (
                        <option key={thana} value={thana}>
                          {thana}
                        </option>
                      ))}
                      {selectedDistrict && (
                        <option value="Other / অন্যান্য">Other / অন্যান্য</option>
                      )}
                    </select>
                  );
                }}
              />
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Full Address (রোড, বাড়ি, গ্রাম ও বিস্তারিত ঠিকানা) *
            </label>
            <textarea
              rows={2}
              placeholder="রোড নম্বর, বাড়ি নম্বর, এলাকা বা গ্রামের নাম বিস্তারিত লিখুন *"
              className="w-full border border-gray-300 p-2.5 rounded-[2px] text-sm focus:border-[#FF6C0C] focus:ring-1 focus:ring-[#FF6C0C] focus:outline-none transition-all"
              {...register("customerAddress", {
                required: "পূর্ণাঙ্গ ঠিকানা দেওয়া বাধ্যতামূলক",
              })}
            />
            {errors.customerAddress && (
              <span className="text-red-500 text-xs mt-1 block">
                {String(errors.customerAddress.message)}
              </span>
            )}
          </div>
        </div>

        {/* Free Shipping Alert if active */}
        {isFreeShipping && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-[2px] flex items-center gap-2.5 text-xs sm:text-sm shadow-xs">
            <Sparkles className="text-emerald-600 shrink-0" size={18} />
            <span>
              <strong>Free Shipping on 3+ Items Applied!</strong> আপনি ৩টি বা তার বেশি পণ্য কার্টে রাখায় সারা দেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি (Tk 0)!
            </span>
          </div>
        )}

        {/* Delivery Options & Payment Options */}
        <div className="bg-white p-5 sm:p-6 rounded-[2px] border border-gray-200 shadow-xs space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
            Delivery Options (ডেলিভারি অপশন)
          </h2>

          {/* 1. SELECT DELIVERY AREA */}
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
              1. SELECT DELIVERY AREA
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Inside Dhaka */}
              <label
                className={`relative flex items-center justify-between p-3.5 border rounded-[2px] cursor-pointer transition-all duration-200 ${
                  selectedDeliveryArea === "inside_dhaka"
                    ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500 shadow-xs"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    value="inside_dhaka"
                    {...register("deliveryArea")}
                    className="accent-emerald-600 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    Inside Dhaka
                  </span>
                </div>

                <div className="text-right">
                  {isFreeShipping ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs line-through text-gray-400">Tk 60</span>
                      <span className="text-sm font-bold text-emerald-600">Free (Tk 0)</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-emerald-700">Tk 60</span>
                  )}
                </div>
              </label>

              {/* Outside Dhaka */}
              <label
                className={`relative flex items-center justify-between p-3.5 border rounded-[2px] cursor-pointer transition-all duration-200 ${
                  selectedDeliveryArea === "outside_dhaka"
                    ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500 shadow-xs"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    value="outside_dhaka"
                    {...register("deliveryArea")}
                    className="accent-emerald-600 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    Outside Dhaka
                  </span>
                </div>

                <div className="text-right">
                  {isFreeShipping ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs line-through text-gray-400">Tk 120</span>
                      <span className="text-sm font-bold text-emerald-600">Free (Tk 0)</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-emerald-700">Tk 120</span>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* 2. SELECT PAYMENT METHOD */}
          <div className="pt-2">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
              2. SELECT PAYMENT METHOD
            </label>

            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: "অনুগ্রহ করে পেমেন্ট মেথড নির্বাচন করুন" }}
              render={({ field }) => (
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center justify-between p-3.5 border rounded-[2px] cursor-pointer transition-all ${
                      field.value === "CashOnDelivery"
                        ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        {...field}
                        value="CashOnDelivery"
                        checked={field.value === "CashOnDelivery"}
                        onChange={(e) => {
                          field.onChange(e);
                          setShowMobileBanking(false);
                        }}
                        className="accent-emerald-600 w-4 h-4 cursor-pointer"
                      />
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Truck size={17} />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        Cash on Delivery (ক্যাশ অন ডেলিভারি)
                      </span>
                    </div>
                  </label>

                  {/* Mobile Banking / bKash Payment */}
                  <label
                    className={`flex items-center justify-between p-3.5 border rounded-[2px] cursor-pointer transition-all ${
                      field.value === "MobileBanking"
                        ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        {...field}
                        value="MobileBanking"
                        checked={field.value === "MobileBanking"}
                        onChange={(e) => {
                          field.onChange(e);
                          setShowMobileBanking(true);
                        }}
                        className="accent-emerald-600 w-4 h-4 cursor-pointer"
                      />
                      <div className="w-8 h-8 rounded-[2px] overflow-hidden bg-pink-100 flex items-center justify-center shrink-0">
                        <Image
                          src={bikashNagad}
                          alt="bKash Nagad"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        bKash / Nagad Payment (মোবাইল ব্যাংকিং)
                      </span>
                    </div>
                  </label>
                </div>
              )}
            />

            {/* Mobile Banking Fields */}
            {selectedPayment === "MobileBanking" && (
              <div className="mt-4 p-4 border border-orange-200 bg-orange-50/40 rounded-[2px] space-y-3.5 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Provider *
                  </label>
                  <select
                    {...register("mobileBankingProvider", {
                      required: selectedPayment === "MobileBanking" ? "Provider is required" : false,
                    })}
                    className="w-full p-2 border border-gray-300 rounded-[2px] text-sm bg-white focus:border-[#FF6C0C] focus:outline-none"
                  >
                    <option value="">Select Provider</option>
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Sender Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className="w-full p-2 border border-gray-300 rounded-[2px] text-sm bg-white focus:border-[#FF6C0C] focus:outline-none"
                      {...register("mobileNumber", {
                        required: selectedPayment === "MobileBanking" ? "Mobile number required" : false,
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Transaction ID (TrxID) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9J283H49K"
                      className="w-full p-2 border border-gray-300 rounded-[2px] text-sm bg-white focus:border-[#FF6C0C] focus:outline-none"
                      {...register("transactionId", {
                        required: selectedPayment === "MobileBanking" ? "TrxID required" : false,
                      })}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-white p-3 rounded-[2px] border border-orange-100">
                  <p className="font-semibold text-gray-800">পেমেন্ট নির্দেশনা:</p>
                  <p className="mt-0.5">১. মার্চেন্ট নম্বরে <strong>Send Money</strong> করুন: <strong>+8801623-726069</strong></p>
                  <p>২. যে নম্বর থেকে টাকা পাঠিয়েছেন এবং TrxID উপরে লিখুন।</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Breakdown Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-[2px] p-5 sm:p-6 text-center shadow-xs">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">
            Your total payable amount is
          </p>
          <h3 className="font-extrabold text-2xl sm:text-3xl text-[#FF6C0C] my-1.5">
            ৳{grandTotal}
          </h3>

          <div className="mt-4 border border-gray-200 bg-white rounded-[2px] overflow-hidden text-sm">
            <div className="flex justify-between font-bold bg-gray-100/80 px-4 py-2.5 border-b border-gray-200 text-gray-700">
              <span>Purpose</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between px-4 py-2.5 border-b border-gray-100 text-gray-600">
              <span>Subtotal (মূল মূল্য)</span>
              <span className="font-semibold text-gray-800">৳{subtotal}</span>
            </div>
            <div className="flex justify-between px-4 py-2.5 border-b border-gray-100 text-gray-600 items-center">
              <span className="flex items-center gap-1.5">
                <span>Shipping (ডেলিভারি চার্জ)</span>
                {isFreeShipping && (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    Free Delivery
                  </span>
                )}
              </span>
              <span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : "text-gray-800"}`}>
                {shipping === 0 ? "৳0 (Free)" : `৳${shipping}`}
              </span>
            </div>
            <div className="flex justify-between px-4 py-2.5 border-b border-gray-100 text-gray-600">
              <span>Discount (মোট ডিসকাউন্ট)</span>
              <span className="font-semibold text-emerald-600">-৳{totalDiscount}</span>
            </div>
            <div className="flex justify-between px-4 py-3 bg-orange-50/50 font-bold text-base text-gray-900">
              <span>Grand Total (সর্বমোট)</span>
              <span className="text-[#FF6C0C] font-extrabold">৳{grandTotal}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>অর্ডার কনফার্মেশনের পর ২-৩ কার্যদিবসের মধ্যে ডেলিভারি পাবেন।</span>
          </p>
        </div>

        {/* Coupon Code Box */}
        <div className="bg-white p-5 rounded-[2px] border border-gray-200 shadow-xs">
          <h4 className="font-bold text-sm text-gray-800 mb-2">
            Got any Coupon Code? (কুপন কোড আছে?)
          </h4>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              placeholder="Enter Coupon Code Here"
              className="border border-gray-300 p-2.5 rounded-[2px] text-sm uppercase font-medium focus:border-[#FF6C0C] focus:outline-none flex-1"
              {...register("coupon")}
            />
            <button
              type="button"
              onClick={handleAddCoupon}
              className="bg-[#FF6C0C] hover:bg-[#E55A00] transition-colors py-2.5 px-6 text-white text-sm font-bold rounded-[2px] cursor-pointer shadow-xs"
            >
              Add Coupon
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-2">
          <label className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 accent-[#FF6C0C] w-4 h-4 cursor-pointer shrink-0"
              {...register("terms", { required: "শর্তাবলী স্বীকার করতে হবে" })}
            />
            <span>
              I agree to the{" "}
              <Link href="/terms-condition" className="text-[#FF6C0C] font-semibold hover:underline">
                Terms &amp; Conditions
              </Link>
              ,{" "}
              <Link href="/returnPolicy" className="text-[#FF6C0C] font-semibold hover:underline">
                Refund Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacyPolicy" className="text-[#FF6C0C] font-semibold hover:underline">
                Privacy Policy
              </Link>{" "}
              of Silk Thread.
            </span>
          </label>
          {errors.terms && (
            <span className="text-red-500 text-xs block">
              {String(errors.terms.message)}
            </span>
          )}
        </div>

        {/* Confirm Order Button */}
        <button
          ref={buttonRef}
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-4 text-base font-bold text-white rounded-[2px] transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FF6C0C] hover:bg-[#E55A00] active:scale-[0.99]"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Processing Order...</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full px-2">
              <span>অর্ডার কনফার্ম করুন (Confirm Order)</span>
              <span className="bg-black/20 px-3 py-1 rounded-[2px] text-sm">
                ৳{grandTotal}
              </span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckOutForm;
