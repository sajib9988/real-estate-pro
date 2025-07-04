/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const addProperties = async (Data: FormData): Promise<Response> => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/`, {
      method: "POST",
      body: Data,
      headers: {
       Authorization: `Bearer ${accessToken as string}`, // ✅ correct syntax

              },


    });
    revalidateTag("PROPERTY");
    return res;
  } catch (error: any) {
    throw new Error(`Network error or failed to fetch: ${error.message || error}`);
  }
};


export const addService = async (data: FormData) => {
 const accessToken = (await cookies()).get("accessToken")?.value;

 const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/service/add-service`, {
    method: 'POST',
    body: data,
      headers: {
      Authorization : accessToken as string
    },
  });

  console.log('resss', res);

  if (!res.ok) {
    const errText = await res.text();
    console.log("📛 Server Error:", errText);
    throw new Error('Failed to add service');
  }

  return res.json();
}