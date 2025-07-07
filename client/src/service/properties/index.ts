/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { refreshToken, logout } from "../auth";
import { PropertyFilterParams } from "@/lib/type";


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


// @/service/properties/index.ts




export const getProperties = async (params?: PropertyFilterParams) => {
  try {
    // Clean only valid, non-empty params and convert all to string
    const cleanedParams: Record<string, string> = {}
    if (params) {
      for (const key in params) {
        const value = params[key as keyof PropertyFilterParams]
        if (value !== undefined && value !== '') {
          cleanedParams[key] = String(value)
        }
      }
    }

    const query = new URLSearchParams(cleanedParams).toString()
    const url = `${process.env.NEXT_PUBLIC_BASE_API}/properties/?${query}`

    const res = await fetch(url, {
      method: "GET",
      next: { tags: ["PROPERTY"] },
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Server responded with error:', errorData)
      throw new Error(errorData.error || errorData.detail || 'Failed to fetch properties')
    }

    return res.json()
  } catch (error: any) {
    throw new Error(`Operation failed: ${error.message || error}`)
  }
}


export const addProperties = async (Data: FormData) => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/`, {
      method: "POST",
      body: Data,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Server responded with error:', errorData);
      const errorMessage = errorData.error || errorData.detail || 'Failed to add property';
      throw new Error(errorMessage);
    }

    revalidateTag("PROPERTY");

    return res.json();
  } catch (error: any) {
    throw new Error(`Operation failed: ${error.message || error}`);
  }
};



export const getSingleProperty = async (id: string) => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/${id}/`, {
      method: "GET",
      next: { tags: ["PROPERTY"] },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Server responded with error:', errorData);
      throw new Error(errorData.error || errorData.detail || 'Failed to fetch property');
    }

    return res.json();
  } catch (error: any) {
    throw new Error(`Operation failed: ${error.message || error}`);
  }
};

export const updateProperties = async (id: string, Data: FormData) => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/${id}/`, {  // <-- trailing slash added
      method: "PUT",
      body: Data,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Server responded with error:', errorData);
      throw new Error(errorData.error || errorData.detail || 'Failed to update property');
    }

    revalidateTag("PROPERTY");

    return res.json();
  } catch (error: any) {
    throw new Error(`Operation failed: ${error.message || error}`);
  }
};

export const getPropertiesBySeller = async () => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/my-properties/`, {  // <-- corrected path
      method: "GET",
      next: { tags: ["PROPERTY"] },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Server responded with error:', errorData);
      throw new Error(errorData.error || errorData.detail || 'Failed to fetch properties');
    }

    return res.json();
  } catch (error: any) {
    throw new Error(`Operation failed: ${error.message || error}`);
  }
};

export const deleteProperty = async (id: string) => {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/${id}/`, {  // <-- trailing slash added
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Server responded with error:', errorData);
      throw new Error(errorData.error || errorData.detail || 'Failed to delete property');
    }

    revalidateTag("PROPERTY");

    // DELETE likely returns 204 No Content — no json response
    return true;
  } catch (error: any) {
    throw new Error(`Operation failed: ${error.message || error}`);
  }
};


