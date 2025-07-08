/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"
import { cookies } from "next/headers";
import { refreshToken, logout } from "../auth";

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  let accessToken = (await cookies()).get("accessToken")?.value;
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });

  if (res.status === 401 && accessToken) {
    const refreshTokenValue = (await cookies()).get("refreshToken")?.value;
    if (refreshTokenValue) {
      const refreshResult = await refreshToken(refreshTokenValue);
      if (refreshResult.ok) {
        accessToken = (await cookies()).get("accessToken")?.value; // Get the new access token
        res = await fetch(url, { // Retry the original request
          ...options,
          headers: {
            ...options.headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
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


export const addFavorites = async (data:FormData) => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/add/`, {
        method: 'POST',
        body:data
   
    });
    if (!res.ok) {
      throw new Error(`Error fetching favorites: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    throw error;
  }
};

export  const removeFavorite = async (id: string) => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/remove/${id}`, {
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
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/`);
    if (!res.ok) {
      throw new Error(`Error fetching favorite properties: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch favorite properties:", error);
    throw error;
  } 
}