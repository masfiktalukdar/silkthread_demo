"use server";
import { apiRequest } from "@/lib/apiRequest";

import { TCorrelation, TResponse, TUser } from "@/types";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const parseJsonSafely = <T = any>(val: string | undefined | null): T | null => {
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(val));
    } catch {
      return null;
    }
  }
};

export const loginUser = async (credentials: {
  email?: string;
  phone?: string;
  identifier?: string;
  password: string;
  rememberMe?: boolean;
}) => {
  const result: TResponse = await apiRequest({
    endpoint: "/auth/signin",
    method: "POST",
    body: credentials,
  });

  if (result?.data?.accessToken) {
    const { accessToken, refreshToken, user } = result.data;
    const isProduction = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Client indicator cookie to hydrate navbar immediately without delay
    cookieStore.set("silk_auth", "true", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  return result;
};

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("user");
  cookieStore.delete("silk_auth");

  return { success: true, message: "Logged out successfully" };
};

export const setCorrelation = async () => {
  const cookieStore = await cookies();
  const existingCorrelation = cookieStore.get("correlation");

  if (existingCorrelation?.value) {
    const parsed = parseJsonSafely<TCorrelation>(existingCorrelation.value);
    if (parsed) return parsed;
  }

  const correlation: TCorrelation = {
    id: uuidv4(),
    name: "",
    email: "",
    roleRef: "",
    role: "user",
    warehouseRef: null,
    warehouse: null,
  };

  cookieStore.set("correlation", JSON.stringify(correlation), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return correlation;
};

const isDynamicServerError = (err: any) => {
  return (
    err?.digest === "DYNAMIC_SERVER_USAGE" ||
    (typeof err?.message === "string" && err.message.includes("Dynamic server usage"))
  );
};

/**
 * Returns the currently authenticated user if a valid access token and user session exist.
 * Returns null for guests / correlation IDs.
 */
export const getAuthenticatedUser = async (): Promise<TUser | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) return null;

    const parsedUser = parseJsonSafely<TUser>(userCookie);
    if (!parsedUser || !parsedUser.id) return null;

    // A real logged-in user in MongoDB has an ObjectId (not a UUID) or has accessToken
    const isGuestUuid = parsedUser.id.includes("-") && parsedUser.id.length === 36;
    if (isGuestUuid && !token) return null;

    return parsedUser;
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err;
    console.error("Error in getAuthenticatedUser:", err);
    return null;
  }
};

/**
 * Updates the user session stored in the cookie (e.g. after updating profile address)
 */
export const updateUserSession = async (updatedFields: Partial<TUser>): Promise<TUser | null> => {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;
    const existingUser = parseJsonSafely<TUser>(userCookie) || ({} as TUser);

    const mergedUser: TUser = {
      ...existingUser,
      ...updatedFields,
    };

    const isProduction = process.env.NODE_ENV === "production";
    cookieStore.set("user", JSON.stringify(mergedUser), {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return mergedUser;
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err;
    console.error("Error in updateUserSession:", err);
    return null;
  }
};

export const getUser = async (): Promise<TUser | TCorrelation | null> => {
  try {
    const cookieStore = await cookies();

    const userCookie = cookieStore.get("user");
    if (userCookie?.value) {
      const parsed = parseJsonSafely<TUser>(userCookie.value);
      if (parsed) return parsed;
    }

    const correlationCookie = cookieStore.get("correlation");
    if (correlationCookie?.value) {
      const parsed = parseJsonSafely<TCorrelation>(correlationCookie.value);
      if (parsed) return parsed;
    }

    return null;
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err;
    console.error("Error in getUser:", err);
    return null;
  }
};

export const registrationUser = async (credentials: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  try {
    const response = await apiRequest({
      endpoint: "/auth/singup",
      method: "POST",
      body: credentials,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
// forget-password
export const forgetPasswordOTPSender = async (credentials: {
  email: string;
  phone: string;
}) => {
  try {
    const response = await apiRequest({
      endpoint: "/auth/forget-password",
      method: "POST",
      body: credentials,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const verifyOTPAndSetPassword = async (credentials: {
  email: string;
  phone: string;
  otp: string;
  password: string;
}) => {
  try {
    const response = await apiRequest({
      endpoint: "/auth/forget-password/otp-verification",
      method: "POST",
      body: credentials,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

