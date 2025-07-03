/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode'; // Fixed import
import { DecodedUser } from '@/lib/type';
import { FieldValues } from 'react-hook-form';

export const getCurrentUser = async (): Promise<DecodedUser | null> => {
  const accessToken = (await cookies()).get('accessToken')?.value;
  if (!accessToken) return null;
  try {
    const decoded = jwtDecode<DecodedUser>(accessToken);
    console.log('Decoded user:', decoded);
    return decoded;
  } catch (error) {
    console.error('JWT Decode error:', error);
    return null;
  }
  
};

export const registerUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/accounts/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const result = await res.json();

    if (res.ok && result.access && result.refresh) {
      
      const cookieStore = await cookies(); 
      
      cookieStore.set('accessToken', result.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      cookieStore.set('refreshToken', result.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      }); 

      const decodedUser = jwtDecode<DecodedUser>(result.access);

      return { ok: true, data: { user: decodedUser } };
    }

    return { ok: false, data: result };

  } catch (error: any) {
    return { ok: false, data: { message: error.message } };
  }
};




export const logout = async () => {
  (await cookies()).delete("accessToken");
};