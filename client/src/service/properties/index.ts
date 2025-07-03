/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const addProperties = async (propertyData: FormData): Promise<any> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/properties/`, {
      method: "POST",
      body: propertyData,
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    revalidateTag("PROPERTY");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
