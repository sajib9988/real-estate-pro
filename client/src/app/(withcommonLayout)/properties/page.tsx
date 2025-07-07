'use client'

import Property from "@/homesection/Property";
import { Toaster } from "@/components/ui/toaster";

export default function PropertiesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Property />
      <Toaster />
    </main>
  );
}