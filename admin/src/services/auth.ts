"use server";

import { BASE_URL } from "@/config/config";
import { AllUserResponse, TUser } from "@/types/shared";

export async function SignInUser(data: TUser): Promise<any> {
  const response = await fetch(`${BASE_URL}/auth/signin`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getAllUser(): Promise<AllUserResponse> {
  try {
    const response = await fetch(`${BASE_URL}/auth/user`);
    if (!response.ok) {
      return { success: false, data: [] } as any;
    }
    return response.json();
  } catch (error) {
    return { success: false, data: [] } as any;
  }
}

export async function forgotPassword(data: { email: string }) {
  const response = await fetch(`${BASE_URL}/auth/forget-password`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function resetPassword(data: {
  email: string;
  otp: string;
  password: string;
}) {
  const response = await fetch(`${BASE_URL}/auth/forget-password/otp-verification`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
