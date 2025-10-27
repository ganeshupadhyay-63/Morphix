import { FileText, Sparkles, Copy } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a resume first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file); // ✅ send actual file

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "multipart/form-data", // required for file uploads
        },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Resume analyzed successfully!");
      } else {
        toast.error(data.message || "Failed to analyze resume");
      }
    } catch (error) {
      console.error("Resume review error:", error);
      toast.error(error.response?.data?.message || error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast.success("Analysis copied to clipboard!");
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-wrap gap-6 text-slate-700 bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
      {/* Left Column */}
      <form
        className="w-full max-w-lg p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"
        onSubmit={onSubmitHandler}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        {/* File Upload */}
        <label htmlFor="resume-upload" className="mt-6 text-sm font-medium block">
          Upload Resume
        </label>
        <input
          id="resume-upload"
          type="file"
          accept="application/pdf"
          className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <p className="text-xs text-gray-500 font-light mt-1">Supports PDF resumes only</p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <FileText className="w-5" />
          )}
          Review Resume
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-6 bg-white rounded-lg flex flex-col border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
          {content && (
            <button
              onClick={handleCopy}
              className="ml-auto flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          )}
        </div>

        <div className="flex-1 flex justify-center items-start mt-6">
          {!content ? (
            <div className="flex flex-col items-center gap-5 text-gray-400 mt-10">
              <FileText className="w-9 h-9" />
              <p>Upload a PDF resume and click "Review Resume" to get started</p>
            </div>
          ) : (
            <div className="mt-3 h-full overflow-y-auto text-sm text-slate-600">
              <div className="prose prose-sm max-w-none leading-relaxed text-gray-700">
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
