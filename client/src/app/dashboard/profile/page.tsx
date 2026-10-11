"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getAuthenticatedUser, getUser, updateUserSession } from "@/services/auth";
import {
  getUserInformation,
  updateUserInformation,
} from "@/services/userInformation";
import { BD_LOCATIONS, District } from "@/utilits/bdLocations";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiEdit3,
  FiSave,
  FiX,
  FiShoppingBag,
  FiShield,
  FiAlertCircle,
  FiTruck,
  FiPackage,
  FiCheck,
  FiCopy,
} from "react-icons/fi";
import { TUser } from "@/types";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  fullAddress: string;
}

const UserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<TUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    division: "",
    district: "",
    thana: "",
    fullAddress: "",
  });

  const [initialData, setInitialData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    division: "",
    district: "",
    thana: "",
    fullAddress: "",
  });

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

  // Synchronously derived cascading lists from selected division & district
  const currentDivisionObj = useMemo(() => {
    if (!formData.division) return null;
    return matchDivision(formData.division);
  }, [formData.division]);

  const districtsList = useMemo(() => {
    return currentDivisionObj ? currentDivisionObj.districts : [];
  }, [currentDivisionObj]);

  const currentDistrictObj = useMemo(() => {
    if (!formData.district || !districtsList.length) return null;
    return matchDistrict(districtsList, formData.district);
  }, [formData.district, districtsList]);

  const thanasList = useMemo(() => {
    return currentDistrictObj ? currentDistrictObj.thanas : [];
  }, [currentDistrictObj]);

  useEffect(() => {
    const loadData = async () => {
      try {
        let authUser = await getAuthenticatedUser();
        if (!authUser) {
          // Fallback check
          const fallback = await getUser();
          if (fallback && "id" in fallback && !fallback.id.includes("-")) {
            authUser = fallback as TUser;
          }
        }

        if (!authUser || !authUser.id) {
          router.replace("/login?redirect=/dashboard/profile");
          return;
        }

        setUser(authUser);

        let userInfo: any = null;
        try {
          const userInfoResponse = await getUserInformation(authUser.id);
          userInfo = (userInfoResponse as { data: any })?.data;
        } catch (err) {
          console.error("Error loading extra user info:", err);
        }

        const divisionVal =
          userInfo?.division ||
          userInfo?.state ||
          authUser?.division ||
          authUser?.state ||
          "";
        const districtVal =
          userInfo?.district ||
          userInfo?.city ||
          authUser?.district ||
          authUser?.city ||
          "";
        const thanaVal = userInfo?.thana || authUser?.thana || "";
        const fullAddressVal =
          userInfo?.fullAddress ||
          userInfo?.address ||
          authUser?.fullAddress ||
          authUser?.address ||
          "";

        const matchedDiv = matchDivision(divisionVal);
        const resolvedDiv = matchedDiv ? matchedDiv.name : divisionVal;

        const matchedDist = matchedDiv
          ? matchDistrict(matchedDiv.districts, districtVal)
          : null;
        const resolvedDist = matchedDist ? matchedDist.name : districtVal;

        const matchedTh = matchedDist
          ? matchThana(matchedDist.thanas, thanaVal)
          : thanaVal;

        const resolvedData: ProfileFormData = {
          name: userInfo?.name || authUser?.name || "",
          email: userInfo?.email || authUser?.email || "",
          phone: userInfo?.phone || (authUser as any)?.phone || "",
          division: resolvedDiv,
          district: resolvedDist,
          thana: matchedTh,
          fullAddress: fullAddressVal,
        };

        setFormData(resolvedData);
        setInitialData(resolvedData);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Division Change
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDivision = e.target.value;
    setFormData((prev) => ({
      ...prev,
      division: selectedDivision,
      district: "",
      thana: "",
    }));
  };

  // District Change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict,
      thana: "",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(initialData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Please login to update your profile");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please provide your full name");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please provide your mobile number for courier deliveries");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        division: formData.division,
        district: formData.district,
        thana: formData.thana,
        fullAddress: formData.fullAddress.trim(),
        address: formData.fullAddress.trim(),
        city: formData.district,
        state: formData.division,
      };

      // 1. Update in backend database
      await updateUserInformation(user.id, payload);

      // 2. Update user session cookie so checkout auto-fill has access immediately
      await updateUserSession({
        ...user,
        ...payload,
      });

      setInitialData(formData);
      setUser((prev) => (prev ? { ...prev, ...payload } : null));
      setIsEditing(false);
      toast.success("Profile & Shipping Address saved! Checkout will now auto-fill.");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyAddress = () => {
    const fullText = [
      formData.fullAddress,
      formData.thana,
      formData.district,
      formData.division,
    ]
      .filter(Boolean)
      .join(", ");

    if (fullText) {
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.info("Address copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF6C0C] rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-semibold tracking-wide">
          Loading your profile &amp; address...
        </p>
      </div>
    );
  }

  const hasCompleteAddress = Boolean(
    formData.division && formData.district && formData.fullAddress
  );

  const isDhaka =
    formData.district?.toLowerCase().includes("dhaka") ||
    formData.district?.includes("ঢাকা");

  // Calculate profile completeness score
  const requiredFields = [
    formData.name,
    formData.phone,
    formData.division,
    formData.district,
    formData.fullAddress,
  ];
  const filledCount = requiredFields.filter(Boolean).length;
  const completionPercentage = Math.round((filledCount / requiredFields.length) * 100);

  const avatarInitial = (formData.name || user?.name || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header Card */}
      <div className="bg-white border border-[#EFECE6] rounded-[2px] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-100/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#FF6C0C] via-[#FF8533] to-[#E55A00] text-white flex items-center justify-center text-3xl font-black shadow-md ring-4 ring-orange-50">
                {avatarInitial}
              </div>
              <div
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs"
                title="Active Member"
              >
                <FiCheck className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {formData.name || user?.name || "Silk Thread Member"}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <FiCheckCircle className="w-3 h-3" /> Active Member
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-xs font-semibold bg-orange-50 text-[#FF6C0C] border border-orange-200/80">
                  <FiShield className="w-3 h-3" /> Silk Thread Club
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600">
                {formData.phone && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <FiPhone className="w-3.5 h-3.5 text-[#FF6C0C]" />
                    {formData.phone}
                  </span>
                )}
                {formData.email && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <FiMail className="w-3.5 h-3.5 text-[#FF6C0C]" />
                    {formData.email}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="pt-2 max-w-sm">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                  <span>Profile &amp; Address Completeness</span>
                  <span
                    className={
                      completionPercentage === 100
                        ? "text-emerald-600"
                        : "text-[#FF6C0C]"
                    }
                  >
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      completionPercentage === 100
                        ? "bg-emerald-500"
                        : "bg-gradient-to-r from-orange-400 to-[#FF6C0C]"
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#FF6C0C] hover:bg-[#E55A00] rounded-[2px] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit Profile &amp; Address</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[2px] transition-colors cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#FF6C0C] hover:bg-[#E55A00] rounded-[2px] shadow-sm transition-all cursor-pointer disabled:opacity-75"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auto-fill Guarantee Banner */}
      <div
        className={`p-4 sm:p-5 rounded-[2px] border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
          hasCompleteAddress
            ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
            : "bg-amber-50/70 border-amber-200 text-amber-950"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2 rounded-[2px] shrink-0 mt-0.5 ${
              hasCompleteAddress
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {hasCompleteAddress ? (
              <FiCheckCircle className="w-5 h-5" />
            ) : (
              <FiAlertCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold">
              {hasCompleteAddress
                ? "1-Click Checkout Auto-Fill is Active!"
                : "Complete Your Delivery Destination"}
            </h3>
            <p className="text-xs sm:text-sm mt-0.5 text-opacity-90 max-w-2xl leading-relaxed">
              {hasCompleteAddress
                ? "Your saved Division, District, Thana, and Full Address will automatically populate the checkout form whenever you purchase silk sarees or fabrics."
                : "Please specify your Division, District, and Detailed Street Address below so your future orders can be placed instantly with 1-click."}
            </p>
          </div>
        </div>

        {hasCompleteAddress && (
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-bold bg-white text-emerald-800 border border-emerald-300 shadow-2xs">
              <FiTruck className="w-3.5 h-3.5 text-emerald-600" />
              {isDhaka ? "Inside Dhaka (৳60 Delivery)" : "Outside Dhaka (৳120 Delivery)"}
            </span>
          </div>
        )}
      </div>

      {/* Main Form & Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Personal Credentials */}
        <div className="bg-white border border-[#EFECE6] rounded-[2px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[2px] bg-orange-50 text-[#FF6C0C]">
                  <FiUser className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    Personal Information
                  </h3>
                  <p className="text-xs text-gray-500">
                    Primary contact for order confirmations &amp; account security
                  </p>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-[2px]">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Full Customer Name
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {formData.name || (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-[2px]">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Email Address
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {formData.email || (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-[2px]">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Primary Mobile Phone (বাংলাদেশ)
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {formData.phone || (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-300 rounded-[2px] focus:border-[#FF6C0C] focus:ring-2 focus:ring-[#FF6C0C]/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-300 rounded-[2px] focus:border-[#FF6C0C] focus:ring-2 focus:ring-[#FF6C0C]/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Mobile Phone (১১ ডিজিটের নম্বর) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-300 rounded-[2px] focus:border-[#FF6C0C] focus:ring-2 focus:ring-[#FF6C0C]/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Default Shipping Address */}
        <div className="bg-white border border-[#EFECE6] rounded-[2px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[2px] bg-orange-50 text-[#FF6C0C]">
                  <FiMapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    Default Shipping Address (বাংলাদেশ)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Destination for Pathao &amp; Steadfast express delivery
                  </p>
                </div>
              </div>

              {!isEditing && formData.fullAddress && (
                <button
                  type="button"
                  onClick={copyAddress}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                  title="Copy full address"
                >
                  {copied ? (
                    <>
                      <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-[2px]">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      বিভাগ / Division
                    </span>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {formData.division || (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </p>
                  </div>

                  <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-[2px]">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      জেলা / District
                    </span>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {formData.district || (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-[2px]">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    থানা / উপজেলা / Thana
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {formData.thana || (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-[2px]">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    রোড, বাড়ি, গ্রাম ও বিস্তারিত ঠিকানা
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-relaxed">
                    {formData.fullAddress || (
                      <span className="text-gray-400 italic">
                        No street address provided yet. Click &quot;Edit Profile &amp; Address&quot; above to set.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Division */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    বিভাগ / Division *
                  </label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleDivisionChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-[2px] focus:border-[#FF6C0C] focus:ring-2 focus:ring-[#FF6C0C]/20 outline-none transition-all cursor-pointer"
                  >
                    <option value="">-- বিভাগ নির্বাচন করুন --</option>
                    {BD_LOCATIONS.map((division) => (
                      <option key={division.name} value={division.name}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    জেলা / District *
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    disabled={!formData.division}
                    className={`w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-[2px] focus:border-[#FF6C0C] focus:ring-2 focus:ring-[#FF6C0C]/20 outline-none transition-all ${
                      !formData.division
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white cursor-pointer"
                    }`}
                  >
                    <option value="">
                      {formData.division
                        ? "-- জেলা নির্বাচন করুন --"
                        : "আগে বিভাগ নির্বাচন করুন"}
                    </option>
                    {formData.district &&
                      !districtsList.some((d) => d.name === formData.district) && (
                        <option value={formData.district}>{formData.district}</option>
                      )}
                    {districtsList.map((dist) => (
                      <option key={dist.name} value={dist.name}>
                        {dist.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Thana */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    থানা / উপজেলা / Thana
                  </label>
                  <select
                    name="thana"
                    value={formData.thana}
                    onChange={handleInputChange}
                    disabled={!formData.district}
                    className={`w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-[2px] focus:border-[#FF6C0C] focus:ring-2 focus:ring-[#FF6C0C]/20 outline-none transition-all ${
                      !formData.district
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white cursor-pointer"
                    }`}
                  >
                    <option value="">
                      {formData.district
                        ? "-- থানা / উপজেলা নির্বাচন করুন --"
                        : "আগে জেলা নির্বাচন করুন"}
                    </option>
                    {formData.thana &&
                      !thanasList.includes(formData.thana) &&
                      formData.thana !== "Others / অন্যান্য" && (
                        <option value={formData.thana}>{formData.thana}</option>
                      )}
                    {thanasList.map((thana) => (
                      <option key={thana} value={thana}>
                        {thana}
                      </option>
                    ))}
                    <option value="Others / অন্যান্য">Others / অন্যান্য</option>
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Full Address (রোড, বাড়ি, গ্রাম ও বিস্তারিত ঠিকানা) *
                  </label>
                  <textarea
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="বাড়ি / ফ্ল্যাট নং, রোড নং, এলাকা / গ্রাম..."
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-300 rounded-[2px] focus:border-[#FF6C0C] focus:ring-2 focus:ring-[#FF6C0C]/20 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button for Edit Mode */}
      {isEditing && (
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[2px] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-2.5 text-sm font-bold text-white bg-[#FF6C0C] hover:bg-[#E55A00] rounded-[2px] shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-75 flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Profile & Shipping Address"}</span>
          </button>
        </div>
      )}

      {/* Quick Action Footer Banner */}
      <div className="bg-gradient-to-r from-[#FFF9F5] via-white to-amber-50/50 border border-orange-100/90 rounded-[2px] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
        <div className="space-y-1">
          <h4 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Ready to explore our luxury handloom collection?
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
            Silk sarees, exclusive three-pieces, and handcrafted fabrics delivered swiftly to your doorstep across Bangladesh.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href="/dashboard/orderHistory"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 rounded-[2px] border border-gray-200 transition-colors"
          >
            <FiPackage className="w-4 h-4 text-[#FF6C0C]" />
            <span>My Orders</span>
          </Link>
          <Link
            href="/shop"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#FF6C0C] hover:bg-[#E55A00] rounded-[2px] shadow-xs hover:shadow-sm transition-all"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>Shop Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;