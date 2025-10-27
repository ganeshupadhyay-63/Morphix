import React, { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import Creationsitems from "../components/Creationsitems.jsx";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState("Free");
  const { getToken, userId } = useAuth();

  const getDashboardData = async () => {
    if (!userId) return; // Ensure user is logged in

    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations || []);
        setUserPlan(data.plan || "Free"); // Ensure backend sends plan
      } else {
        toast.error(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [userId]);

  return (
    <div className="h-full overflow-y-auto p-6 bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
      {/* Stats */}
      <div className="flex justify-start gap-4 flex-wrap mb-6">
        {/* Total Creations */}
        <div className="flex justify-between items-center w-72 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Active Plan */}
        <div className="flex justify-between items-center w-72 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">{userPlan}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center">
            <Gem className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-11 w-11 border-3 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-lg font-medium mb-3">Recent Creations</p>
          {creations.length === 0 ? (
            <p className="text-gray-400">No creations yet</p>
          ) : (
            creations.map((item, index) => (
              <Creationsitems key={item.id || index} item={item} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
