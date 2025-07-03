"use client";
import UserProvider from "@/context/UserContext";
export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};