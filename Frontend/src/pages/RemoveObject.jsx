import { Scissors, Sparkles, Download } from 'lucide-react';
import React, { useState } from 'react';
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!file) return toast.error("Please upload an image first");

      if (object.trim().split(' ').length > 1) {
        return toast.error('Please enter only one object name');
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('object', object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setContent(""); // Clear previous processed image
  };

  // Download function
  const handleDownload = () => {
    if (!content) return;
    const link = document.createElement("a");
    link.href = content;
    link.download = `processed-image.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700 bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
      {/* Left column */}
      <form
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
        onSubmit={onSubmitHandler}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        {/* File Upload */}
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          onChange={handleFileChange}
          required
        />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-4 h-48 w-full object-contain border rounded-md"
          />
        )}

        {/* Object Input */}
        <p className="mt-6 text-sm font-medium">Describe object name to remove</p>
        <textarea
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or spoon (Only single object name)"
          value={object}
          required
          onChange={(e) => setObject(e.target.value)}
        />

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition"
        >
          {loading ? (
            <span className="w-5 h-5 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          {!content ? (
            <div className="flex-1 flex flex-col items-center gap-5 text-gray-400 mt-10">
              <Scissors className="w-9 h-9" />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          ) : (
            <>
              <img
                src={content}
                alt="processed"
                className="m-3 h-full w-full object-contain"
              />
              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="mt-4 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                <Download className="w-4 h-4" />
                Download Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
