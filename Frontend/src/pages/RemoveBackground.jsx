import { Eraser, Sparkles, Download } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please upload an image first');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', file);

      const token = await getToken();

      const { data } = await axios.post('/api/ai/remove-image-background', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        setContent(data.content);
        toast.success('Background removed successfully!');
      } else {
        toast.error(data.message || 'Failed to remove background');
      }
    } catch (error) {
      console.error('Background removal error:', error);
      toast.error(error.response?.data?.message || error.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  // Download function
  const handleDownload = () => {
    if (!content) return;
    const link = document.createElement('a');
    link.href = content;
    link.download = `background-removed.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setContent(''); // Clear previous processed image
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700 bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
      {/* Left column */}
      <form
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
        onSubmit={onSubmitHandler}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        {/* File Upload */}
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
          onChange={handleFileChange}
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports JPG, PNG, and other image formats
        </p>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          Remove Background
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" />
              <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img
              src={content}
              alt="Processed"
              className="m-3 h-full w-full object-contain"
            />
            <button
              onClick={handleDownload}
              className="mt-4 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
