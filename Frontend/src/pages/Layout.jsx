import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/NavLogo.jpg";
import { Menu, X } from "lucide-react";
import { SignIn, useUser } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";  

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="w-full px-6 sm:px-8 h-14 flex items-center justify-between border-b border-gray-200 bg-white">
        <img
          src={logo}
          alt="Logo"
          className="h-8 cursor-pointer"
          onClick={() => navigate("/")}
        />
        {sidebar ? (
          <X
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
            onClick={() => setSidebar(false)}
          />
        ) : (
          <Menu
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
            onClick={() => setSidebar(true)}
          />
        )}
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        {/* Main Content */}
        <main className="flex-1 bg-[#F4F7FB] overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
