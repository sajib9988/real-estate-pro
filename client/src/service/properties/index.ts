/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const addProperties = async (Data: FormData) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/`, {
      method: "POST",
      body: Data,
      headers: {
       Authorization: `Bearer ${accessToken as string}`,
      },
    });


   if (!res.ok) {
  const errorData = await res.json();
  console.error('Server responded with error:', errorData); // এটায় বিস্তারিত দেখা যাবে
  const errorMessage = errorData.error || errorData.detail || 'Failed to add property';
  throw new Error(errorMessage);
}


    revalidateTag("PROPERTY");
 
    return res.json();

  } catch (error: any) {

    throw new Error(`Operation failed: ${error.message || error}`);
  }
};

export const getProperties = async () => {
  try {
     const accessToken = (await cookies()).get("accessToken")?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken as string}`,
      },
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

export const updateProperty = async (id: string, Data: FormData) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/${id}`, {
      method: "PUT",
      body: Data,
      headers: {
        Authorization: `Bearer ${accessToken as string}`,
      },
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
}

export const deleteProperty = async (id: string) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken as string}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Server responded with error:', errorData);
      throw new Error(errorData.error || errorData.detail || 'Failed to delete property');
    }

    revalidateTag("PROPERTY");

    return res.json();
  } catch (error: any) {
    throw new Error(`Operation failed: ${error.message || error}`);
  }
};