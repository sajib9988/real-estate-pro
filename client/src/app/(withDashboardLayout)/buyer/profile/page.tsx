'use client';
import { useUser } from "@/context/UserContext";
import { sellerApply } from "@/service/auth";
import { User } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const sellerApplicationSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_address: z.string().min(1, "Company address is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const Page = () => {
  const { user } = useUser();
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const form = useForm<z.infer<typeof sellerApplicationSchema>>({
    resolver: zodResolver(sellerApplicationSchema),
    defaultValues: {
      company_name: "",
      company_address: "",
      phone_number: "",
      website: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof sellerApplicationSchema>) => {
    try {
      const res = await sellerApply(values);

      if (res.ok) {
        toast("Successfully applied as Seller!");
        window.location.reload();
      } else {
        toast(res.data?.error || res.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error applying as seller:", error);
      toast("Failed to apply. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Buyer Profile
          </h1>
          <p className="text-gray-600">
            Manage your real estate preferences and property search
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-12 text-white relative">
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 rounded-full p-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {user?.first_name || "Property Buyer"}
                </h2>
                <p className="text-lg">
                  {user?.email || "No email provided"}
                </p>
                <p>Role: {user?.role}</p>

                {/* Apply Button */}
                {user?.role === "buyer" && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setShowApplicationForm(true)}
                      className="px-6 py-3 bg-yellow-300 text-black rounded-xl hover:bg-yellow-400 transition"
                    >
                      Apply as seller
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seller Application Form */}
          {showApplicationForm && user?.role === "buyer" && (
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Seller Application
              </h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Phone Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourcompany.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-4">
                    <Button type="submit">Submit Application</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplicationForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;