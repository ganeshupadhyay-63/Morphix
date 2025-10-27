import React from 'react'
import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
  ArrowLeft,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const navigate = useNavigate()

  return (
    <>
      {/* Dark overlay for small screens */}
      {sidebar && (
        <div
          className="fixed inset-0 bg-black/30 max-sm:block hidden z-20 "
          onClick={() => setSidebar(false)}
        />
      )}

      <aside
        className={`w-64 bg-white border-r border-gray-300 flex flex-col justify-between max-sm:absolute top-14 bottom-0 bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen
        ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-transform duration-300 ease-in-out shadow-lg z-30`}
      >
        {/* Top Section */}
        <div className="py-6 px-5">
          {/* Back to homepage */}
          <div
            className="flex items-center gap-2 mb-6 cursor-pointer text-gray-6emi00 hover:text-gray-900 transition"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </div>

          {/* User Profile */}
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src={user?.imageUrl}
              alt="User"
              className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
            />
            <h1 className="mt-3 text-sm font-semibold text-gray-800">{user?.fullName}</h1>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={openUserProfile}
          >
            <img
              src={user?.imageUrl}
              alt="User"
              className="w-9 h-9 rounded-full border border-gray-300"
            />
            <div className="flex flex-col">
              <h1 className="text-sm font-medium text-gray-800">{user?.fullName}</h1>
              <p className="text-xs text-gray-500">
                <Protect plan="premium" fallback="Free">Premium</Protect> Plan
              </p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
