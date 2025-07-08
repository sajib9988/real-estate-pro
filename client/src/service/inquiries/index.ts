/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"
import { cookies } from "next/headers";
import { refreshToken, logout } from "../auth";

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  let accessToken = (await cookies()).get("accessToken")?.value;

  const createAuthHeaders = (token?: string) => {
    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  };

  let res = await fetch(url, {
    ...options,
    headers: createAuthHeaders(accessToken),
  });

  if (res.status === 401 && accessToken) {
    const refreshTokenValue = (await cookies()).get("refreshToken")?.value;
    if (refreshTokenValue) {
      const refreshResult = await refreshToken(refreshTokenValue);
      if (refreshResult.ok) {
        accessToken = (await cookies()).get("accessToken")?.value; // Get the new access token
        res = await fetch(url, { // Retry the original request
          ...options,
          headers: createAuthHeaders(accessToken),
        });
      } else {
        // Refresh token failed, log out user
        await logout();
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      // No refresh token, log out user
      await logout();
      throw new Error("Session expired. Please log in again.");
    }
  }

  return res;
};

export const sendInquiry = async (propertyId: string, message: string, contactNumber: string) => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/inquiries/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ property: propertyId, message, contact_number: contactNumber }),
    });

    if (!res.ok) {
      throw new Error(`Error sending inquiry: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Failed to send inquiry:", error);
    throw error;
  }
};

export const getInquiries = async () => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/inquiries/`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`Error fetching inquiries: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    throw error;
  }
};
