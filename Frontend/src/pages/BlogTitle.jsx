import React, { useState } from "react";
import { Sparkles, Hash, Copy } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitle = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return toast.error("Please enter a topic");

    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword "${input}" in the category "${selectedCategory}"`;
      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(String(data.content || ""));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast.success("Title copied to clipboard!");
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col lg:flex-row gap-6 text-slate-700 bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-lg font-semibold text-gray-800">
            AI Blog Title Generator
          </h1>
        </div>

        {/* Topic Input */}
        <label className="block mt-6 text-sm font-medium text-gray-600">
          Topic
        </label>
        <input
          type="text"
          className="w-full p-3 mt-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition"
          placeholder="e.g. The future of artificial intelligence..."
          value={input}
          required
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Category Selector */}
        <label className="block mt-6 text-sm font-medium text-gray-600">
          Category
        </label>
        <div className="mt-3 flex gap-2 flex-wrap">
          {blogCategories.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1.5 rounded-full border transition-colors duration-200 ${
                selectedCategory === item
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "text-gray-600 border-gray-300 hover:bg-purple-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full mt-6 flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-3 text-sm rounded-lg shadow hover:opacity-90 transform hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Hash className="w-4 h-4" />
          )}
          {loading ? "Generating..." : "Generate Title"}
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition min-h-[350px] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-5 h-5 text-purple-600" />
          <h1 className="text-lg font-semibold text-gray-800">
            Generated Title
          </h1>
        </div>

        {/* Content */}
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <Hash className="w-10 h-10" />
              <p className="text-sm text-center">
                Enter a topic & category, then click "Generate Title"
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-700 leading-relaxed shadow-inner">
              <Markdown>{content}</Markdown>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              <Copy className="w-4 h-4" />
              Copy Title
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitle;
