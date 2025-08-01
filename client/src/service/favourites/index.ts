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


// src/service/favourites/index.ts

export const addFavorites = async (propertyId: string) => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/favorites/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ property: propertyId }),
    });

    if (!res.ok) {
      throw new Error(`Error adding to favorites: ${res.statusText}`);
    }
    
    return await res.json(); // ✅ Direct return করো
  } catch (error) {
    console.error("Failed to add to favorites:", error);
    throw error;
  }
};


export  const removeFavorite = async (id: string) => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/favorites/remove/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Error removing favorite: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    throw error;
  }
}
export const getFavoriteProperties = async () => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/favorites/`,
      {
        method: 'GET',
   
      }
    );
    if (!res.ok) {
      throw new Error(`Error fetching favorite properties: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch favorite properties:", error);
    throw error;
  } 
}