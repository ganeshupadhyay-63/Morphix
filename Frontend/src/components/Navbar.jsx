import React, { useState } from "react";
import Logo from "../assets/NavLogo.jpg";
import { ArrowRight, Menu, X } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "About", id: "about" },
    { label: "AI Tools", id: "ai-tools" },
    { label: "Reviews", id: "reviews" },
    { label: "Subscription", id: "subscription" },
    { label: "Contact", id: "contact" },
  ];

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false); // close menu after click
  };

  return (
    <div className="fixed z-40 flex w-full justify-between items-center py-3 px-4 sm:px-8 bg-gray-100 border-b shadow-md">
      {/* Logo */}
      <img
        src={Logo}
        alt="Logo"
        className="w-24 sm:w-40 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6 font-medium text-gray-700">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleScroll(item.id)}
            className="hover:text-primary transition"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Auth (desktop) */}
      <div className="hidden md:block">
        {user ? (
          <UserButton />
        ) : (
          <button
            className="flex items-center gap-2 rounded-full text-sm bg-primary text-white px-6 py-2 hover:bg-primary/90 transition "
            onClick={openSignIn}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-gray-800"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-200 shadow-md flex flex-col items-center py-6 space-y-4 md:hidden">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleScroll(item.id)}
              className="text-gray-800 hover:text-primary transition text-lg"
            >
              {item.label}
            </button>
          ))}

          {user ? (
            <UserButton />
          ) : (
            <button
              className="flex items-center gap-2 rounded-full text-sm bg-primary text-white px-6 py-2 hover:bg-primary/90 transition"
              onClick={openSignIn}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
