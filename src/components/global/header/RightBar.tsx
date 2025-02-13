"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiMiniUserPlus } from "react-icons/hi2";
import { IoBookmarkOutline, IoLogInSharp, IoLogOutOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import api from "@/services/auth";
import { FiUser } from "react-icons/fi";
import { LuHeart, LuSettings } from "react-icons/lu";
import { useRouter } from "next/navigation";

interface UserData {
  avatar?: string;
  first_name?: string;
  last_name?: string;
}

const RightBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  // Check authentication status first
  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  // Only fetch user data if authenticated
  useEffect(() => {
    const getMe = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/me");
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // If we get a 401 error, the token might be invalid
        if ((error as any)?.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      getMe();
    }
  }, [isAuthenticated]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("directus_session_token");
    Cookies.remove("refresh_token");
    setIsAuthenticated(false);
    setUserData(null);
    router.push("/");
    setDropdownVisible(false);
  };

  if (isLoading) {
    return <div className="skeleton h-10 w-40 rounded-full"></div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-0.5 py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 lg:py-1.5 lg:px-2 rounded-full border-2 border-[#f4b9ae55] text-white font-semibold hover:bg-slate-100 transition-all"
          >
            {userData ? (
              <>
                {userData.avatar ? (
                  <div
                    className="bg-slate-200 h-7 w-7 bg-cover bg-center rounded-full"
                    style={{
                      backgroundImage: `url('https://maoulaty.shop/assets/${userData.avatar}')`,
                    }}
                  ></div>
                ) : (
                  <div className="bg-purple-100 rounded-full h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 flex items-center justify-center text-purple-600 text-xs font-bold">
                    {userData.first_name?.[0]?.toUpperCase()}
                    {userData.last_name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-xs sm:text-sm md:text-base font-medium px-1.5 text-black">
                  {userData.first_name}{" "}
                  <span className="hidden lg:inline">{userData.last_name}</span>
                </span>
              </>
            ) : (
              <div className="animate-pulse">Loading...</div>
            )}
          </button>

          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-1 text-gray-900">
              <Link
                href="/profile"
                className="px-3 py-1.5 text-xs sm:text-sm md:text-base hover:bg-gray-100 font-semibold flex justify-start items-center gap-1.5"
              >
                <FiUser className="size-5 relative -top-[1px] text-black" />
                <span>Profile</span>
              </Link>
              <Link
                href="/setting"
                className="px-3 py-1.5 text-xs sm:text-sm md:text-base hover:bg-gray-100 font-semibold flex justify-start items-center gap-1.5"
              >
                <LuSettings className="size-5 relative -top-[1px] text-black" />
                <span>Settings</span>
              </Link>
              <Link
                href="/appointments"
                className="px-3 py-1.5 text-xs sm:text-sm md:text-base hover:bg-gray-100 font-semibold flex justify-start items-center gap-1.5"
              >
                <IoBookmarkOutline className="size-5 relative -top-[1px] text-black" />
                <span>Appointments</span>
              </Link>
              <Link
                href="/favourites"
                className="px-3 py-1.5 text-xs sm:text-sm md:text-base hover:bg-gray-100 font-semibold flex justify-start items-center gap-1.5"
              >
                <LuHeart className="size-5 relative -top-[1px] text-black" />
                <span>Favorites</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-1.5 text-xs sm:text-sm md:text-base hover:bg-gray-100 font-semibold flex justify-start items-center gap-1.5"
              >
                <IoLogOutOutline className="size-[23px] relative -top-[0.5px] text-black" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5 justify-center items-center pr-5 lg:pr-0">
          <Link href="/signup">
            <button className="py-1.5 px-4 text-md rounded-full bg-gray-900 border-[1px] border-black text-white font-semibold hover:bg-black/80 transition-all">
              Sign Up{" "}
              <HiMiniUserPlus className="inline-block size-4.5 relative -top-[1px] ml-1" />
            </button>
          </Link>
          <Link href="/login">
            <button className="py-1.5 px-4 text-md rounded-full bg-white border-[1px] border-gray-800 border-opacity-30 text-gray-900 font-semibold hover:bg-slate-100 transition-all">
              Sign In{" "}
              <IoLogInSharp className="inline-block size-5 relative -top-[1px] ml-1" />
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default RightBar;