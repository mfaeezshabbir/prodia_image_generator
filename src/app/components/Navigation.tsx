"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuMenu, LuX, LuUser, LuLogOut } from "react-icons/lu";
import { useAuth } from "../contexts/AuthContext";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  return (
    <nav className={`glass-effect py-5 px-8 flex justify-between items-center fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <Link href="/" className="font-bold text-2xl">
        <span className="text-gradient">Prodia</span><span className="font-light">Studio</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8">
        <Link href="/" className={`text-gray-800 font-medium hover:text-indigo-600 transition-all ${pathname === '/' ? 'border-b-2 border-indigo-500 pb-1' : ''}`}>
          Home
        </Link>
        <Link href="/generate" className={`text-gray-800 font-medium hover:text-indigo-600 transition-all ${pathname === '/generate' ? 'border-b-2 border-indigo-500 pb-1' : ''}`}>
          Create
        </Link>
        <Link href="/generated" className={`text-gray-800 font-medium hover:text-indigo-600 transition-all ${pathname === '/generated' ? 'border-b-2 border-indigo-500 pb-1' : ''}`}>
          Gallery
        </Link>
        {currentUser ? (
          <div className="relative">
            <button 
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 text-gray-800 hover:text-indigo-600 transition-all"
            >
              {userProfile?.photoURL ? (
                <Image 
                  src={userProfile.photoURL} 
                  alt={userProfile.displayName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <LuUser className="text-indigo-600" />
                </div>
              )}
              <span>{userProfile?.displayName}</span>
            </button>
            
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                <Link 
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link 
                  href="/profile/images"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  My Images
                </Link>
                <Link 
                  href="/profile/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  Settings
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setProfileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LuLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="text-gray-800 font-medium hover:text-indigo-600 transition-all">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="gradient-bg text-white font-medium py-2 px-4 rounded-lg transition-transform hover:scale-105 shadow-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={toggleMenu}>
        {isMenuOpen ? (
          <LuX className="text-2xl text-gray-800" />
        ) : (
          <LuMenu className="text-2xl text-gray-800" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 pt-20 px-6">
          <div className="flex flex-col gap-6">
            <Link 
              href="/" 
              className={`text-gray-800 font-medium text-lg ${pathname === '/' ? 'text-indigo-600' : ''}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              href="/generate" 
              className={`text-gray-800 font-medium text-lg ${pathname === '/generate' ? 'text-indigo-600' : ''}`}
              onClick={toggleMenu}
            >
              Create
            </Link>
            <Link 
              href="/generated" 
              className={`text-gray-800 font-medium text-lg ${pathname === '/generated' ? 'text-indigo-600' : ''}`}
              onClick={toggleMenu}
            >
              Gallery
            </Link>
            
            <div className="border-t border-gray-100 my-4"></div>
            
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  {userProfile?.photoURL ? (
                    <Image 
                      src={userProfile.photoURL} 
                      alt={userProfile.displayName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <LuUser className="text-indigo-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{userProfile?.displayName}</p>
                    <p className="text-sm text-gray-500">{userProfile?.email}</p>
                  </div>
                </div>
                <Link 
                  href="/profile"
                  className="text-gray-800 font-medium text-lg"
                  onClick={toggleMenu}
                >
                  My Profile
                </Link>
                <Link 
                  href="/profile/images"
                  className="text-gray-800 font-medium text-lg"
                  onClick={toggleMenu}
                >
                  My Images
                </Link>
                <Link 
                  href="/profile/settings"
                  className="text-gray-800 font-medium text-lg"
                  onClick={toggleMenu}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center text-red-600 font-medium text-lg mt-4"
                >
                  <LuLogOut className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-800 font-medium text-lg"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="gradient-bg text-white font-medium py-3 px-4 rounded-lg text-center text-lg mt-4"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
