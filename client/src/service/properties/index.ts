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
        const errorMessage = errorData.error || errorData.detail || 'Failed to add property';
        throw new Error(errorMessage);
    }

    revalidateTag("PROPERTY");
 
    return res.json();

  } catch (error: any) {

    throw new Error(`Operation failed: ${error.message || error}`);
  }
};