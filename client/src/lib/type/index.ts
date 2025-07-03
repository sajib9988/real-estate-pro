export interface DecodedUser {
  user_id: number;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'superadmin';
  exp: number;
  iat: number;
}

export interface TUser {
  user_id: number;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'superadmin';
  first_name?: string;
  last_name?: string;
  exp: number;
  iat: number;
}