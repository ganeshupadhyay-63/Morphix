import React, { useState } from "react";
import { Sparkles,Image } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyles = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "3D style",
    "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [showSubscription, setShowSubscription] = useState(false);
  const [freeRemaining, setFreeRemaining] = useState(null);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return toast.error("Please describe your image");

    try {
      setLoading(true);
      setShowSubscription(false);

      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const token = await getToken();

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setContent(String(data.content || ""));
        if (data.remainingFreeUsage !== undefined) {
          setFreeRemaining(data.remainingFreeUsage);
          toast.success(
            `Image generated successfully! ${data.remainingFreeUsage} free images remaining.`
          );
        }
      } else {
        if (data.message?.includes("Free usage limit")) {
          setShowSubscription(true);
          setFreeRemaining(data.remainingFreeUsage ?? 0);
          toast.error(data.message);
        } else {
          toast.error(data.message || "Failed to generate image");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || showSubscription || !input.trim();

  return (
    <div className="h-full overflow-y-scroll p-6 flex flex-wrap gap-4 text-slate-700 bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
      {/* Left Column */}
      <form
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
        onSubmit={onSubmitHandler}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        {/* Image Description */}
        <p className="mt-6 text-sm font-medium">Describe your image</p>
        <textarea
          rows={4}
          className="w-full p-2 mt-2 text-sm rounded-md border border-gray-300 outline-none disabled:bg-gray-100"
          placeholder="Describe what your image should look like..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        {/* Image Style Selector */}
        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {imageStyles.map((style) => (
            <span
              key={style}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition ${
                selectedStyle === style
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "text-gray-500 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => !loading && setSelectedStyle(style)}
            >
              {style}
            </span>
          ))}
        </div>

        {/* Publish Toggle */}
        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="sr-only peer"
              disabled={loading}
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition" />
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4" />
          </label>
          <p className="text-sm">Make this image public</p>
        </div>

        {/* Generate Button */}
        <button
          disabled={isDisabled}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin" />
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>

        {/* Free Usage Info */}
        {freeRemaining !== null && !showSubscription && (
          <p className="text-sm text-gray-500 mt-2">
            Free usage remaining: {freeRemaining}
          </p>
        )}

        {/* Subscription Prompt */}
        {showSubscription && (
          <div className="mt-4 p-4 border border-yellow-400 bg-yellow-50 rounded-md text-yellow-800 flex flex-col gap-2">
            <p>
              You’ve reached your free usage limit. Upgrade your subscription to generate more images!
            </p>
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={() => (window.location.href = "/subscribe")}
            >
              Buy Subscription
            </button>
          </div>
        )}
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-gray-400 text-sm flex-col gap-5">
            <Image className="w-9 h-9" />
            <p>Enter a description and click "Generate Image" to get started</p>
          </div>
        ) : (
          <div className="mt-3 h-full flex justify-center items-center transition-all duration-500">
            <img
              src={content}
              alt="Generated AI"
              className="max-w-full max-h-[550px] object-contain rounded-md shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
