'use client';
import { useUser } from "@/context/UserContext";
import { sellerApply } from "@/service/auth";
import { User } from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const { user } = useUser();

  const handleApplyAsBuyer = async () => {
    try {
      const res = await sellerApply();

     

      if (res.ok) {
        toast("Successfully applied as Buyer!");
        window.location.reload();
      } else {
        toast(res.message || 'Something went wrong');
      }
    } catch (error) {
      console.error("Error applying as buyer:", error);
      alert("Failed to apply. Please try again.");
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
                  {user?.first_name || 'Property Buyer'}
                </h2>
                <p className="text-lg">
                  {user?.email || 'No email provided'}
                </p>
                <p>Role: {user?.role}</p>

                {/* Apply Button */}
                {user?.role === 'buyer' && (
                  <div className="mt-6">
                    <button
                      onClick={handleApplyAsBuyer}
                      className="px-6 py-3 bg-yellow-300 text-black rounded-xl hover:bg-yellow-400 transition"
                    >
                      Apply as seller
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
