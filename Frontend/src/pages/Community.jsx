import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCreations(data.creations || []);
      } else {
        toast.error(data.message || "Failed to fetch creations");
      }
    } catch (error) {
      console.error("Fetch creations error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message || "Action successful");
        fetchCreations(); // refresh after like/unlike
      } else {
        toast.error(data.message || "Failed to like");
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCreations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
        <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold text-slate-700 mb-2">Community Creations</h1>
      <div className="bg-white h-full rounded-xl overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {creations.length === 0 ? (
          <p className="text-gray-400 col-span-full">No creations yet</p>
        ) : (
          creations.map((creation, index) => (
            <div key={creation.id || index} className="relative group rounded-lg overflow-hidden">
              <img
                src={creation.content}
                alt="Community creation"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition">
                <p className="text-sm text-white mb-2">{creation.prompt}</p>
                <div className="flex items-center gap-1 text-white">
                  <p>{creation.likes?.length || 0}</p>
                  <Heart
                    onClick={() => toggleLike(creation.id)}
                    className={`w-5 h-5 hover:scale-110 cursor-pointer transition ${
                      creation.likes?.includes(user?.id) ? "fill-red-500 text-red-600" : "text-white"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
