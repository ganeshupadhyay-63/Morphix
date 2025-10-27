import React, { useState } from "react";
import Logo from "../assets/NavLogo.jpg";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) {
      toast.error("Please enter your email!");
      return;
    }
    if (!feedback.trim()) {
      toast.error("Please write your feedback!");
      return;
    }

    // for future to add bck 
    toast.success("Thanks for subscribing and sharing your feedback!");

    // reset inputs
    setEmail("");
    setFeedback("");
  };

  return (
    <footer className="relative w-full text-sm text-gray-700 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url(/bg.png)] bg-cover bg-center -z-10"></div>
      <div className="absolute inset-0 bg-black/20 -z-10"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-12 px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Logo & description */}
        <div className="flex flex-col justify-start">
          <img src={Logo} alt="Logo" className="h-10 w-45 mb-4" />
          <p className="text-gray-800 leading-relaxed font-semibold">
            Morphix empowers creators with AI-driven tools to streamline content creation,
            generate stunning visuals, and write smarter, faster, and more efficiently.
          </p>
        </div>

        {/* Company links */}
        <div className="flex flex-col lg:items-start lg:justify-start mt-6 sm:mt-0">
          <h2 className="font-bold mb-4 text-gray-800 text-[18px]">Company</h2>
          <div className="flex flex-col space-y-2 text-gray-800 font-semibold">
            <a href="#" className="hover:text-gray-600 transition">About Us</a>
            <a href="#" className="hover:text-gray-600 transition">Contact Us</a>
            <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
          </div>
        </div>

        {/* Newsletter + Feedback */}
        <div className="mt-6 sm:mt-0">
          <h2 className="font-bold text-gray-800 text-[18px] mb-4">Subscribe & Feedback</h2>
          <p className="text-gray-800 mb-4 font-semibold text-[13px]">
            Enter your email and share feedback — we’d love to hear from you!
          </p>

          {/* Email input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full mb-3 py-2 px-3 rounded border border-white/50 bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Feedback textarea */}
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback..."
            rows="3"
            className="w-full mb-3 py-2 px-3 rounded border border-white/50 bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />

          <button
            onClick={handleSubscribe}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Subscribe & Send
          </button>
        </div>
      </div>

      <p className="text-center text-gray-700 text-[15px] border-t border-white/30 mt-10 py-4">
        &copy; 2025 Morphix. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
