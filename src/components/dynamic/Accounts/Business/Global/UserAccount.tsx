// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { IoLogOutOutline, IoNotificationsOutline } from "react-icons/io5";
// import Cookies from "js-cookie";
// import api from "@/services/auth";
// import { FiUser } from "react-icons/fi";
// import { LuSettings } from "react-icons/lu";
// import { useRouter } from "next/navigation";

// interface UserData {
//   avatar?: string;
//   first_name?: string;
//   last_name?: string;
// }

// const UserAccount = () => {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [, setLoading] = useState(true);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const router = useRouter();

//   const fetchUserData = useCallback(async () => {
//     try {
//       const response = await api.get("/users/me");
//       setUserData(response.data.data);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setUserData(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     // Add a flag to prevent race conditions
//     let isMounted = true;

//     if (isMounted) {
//       fetchUserData();
//     }

//     // Cleanup function
//     return () => {
//       isMounted = false;
//     };
//   }, [fetchUserData]);

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const handleLogout = () => {
//     Cookies.remove("access_token");
//     Cookies.remove("directus_session_token");
//     Cookies.remove("refresh_token");
//     router.push("/");
//     setDropdownVisible(false);
//   };

//   return (
//     <div className="relative top-0.5">
//       <div className="flex justify-center items-center gap-3">
// <div className="mr-1">
//   <IoNotificationsOutline className="size-7 text-black" />
// </div>
//         <div className="relative">
//           <div
//             onClick={toggleDropdown}
//             className="flex items-center gap-1.5 transition-all cursor-pointer"
//           >
//             {userData ? (
//               <>
//                 {userData.avatar ? (
//                   <div
//                     className="bg-purple-100 rounded-full h-7 w-7 bg-cover bg-center"
//                     style={{
//                       backgroundImage: `url(https://maoulaty.shop/assets/${userData.avatar})`,
//                     }}
//                   ></div>
//                 ) : (
//                   <div className="bg-purple-100 rounded-full h-8 w-8 flex items-center justify-center text-purple-600 text-sm font-bold">
//                     {userData.first_name?.[0]?.toUpperCase()}
//                     {userData.last_name?.[0]?.toUpperCase()}
//                   </div>
//                 )}
//                 <span className="font-semibold text-black">
//                   {userData.first_name}
//                 </span>
//               </>
//             ) : (
//               "Loading..."
//             )}
//           </div>

//           {dropdownVisible && (
//             <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-1.5 text-gray-900">
//               <Link
//                 href="/profile"
//                 className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
//               >
//                 <FiUser className="size-4 relative -top-[1px]" />
//                 <span>Profile</span>
//               </Link>
//               <Link
//                 href="/settings"
//                 className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
//               >
//                 <LuSettings className="size-4 relative -top-[1px]" />
//                 <span>Settings</span>
//               </Link>
//               <div
//                 onClick={handleLogout}
//                 className="w-full px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1 cursor-pointer"
//               >
//                 <IoLogOutOutline className="size-[19px] relative -top-[0.5px]" />
//                 <span>Logout</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserAccount;

// UserAccount.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IoLogOutOutline, IoNotificationsOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { FiUser } from "react-icons/fi";
import { LuSettings } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const UserAccount = () => {
  const { userData, loading } = useUser();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("directus_session_token");
    Cookies.remove("refresh_token");
    router.push("/");
    setDropdownVisible(false);
  };

  const renderUserAvatar = () => {
    if (loading) {
      return <div className="skeleton h-8 w-32 rounded-full"></div>;
    }

    if (userData?.avatar) {
      return (
        <div
          className="bg-purple-100 rounded-full h-7 w-7 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://maoulaty.shop/assets/${userData.avatar})`,
          }}
        ></div>
      );
    }

    return (
      <div className="bg-purple-100 rounded-full h-8 w-8 flex items-center justify-center text-purple-600 text-sm font-bold">
        {userData?.first_name?.[0]?.toUpperCase()}
        {userData?.last_name?.[0]?.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="relative top-0.5">
      <div className="flex justify-center items-center gap-3">
        <div className="mr-1">
          <IoNotificationsOutline className="size-7 text-black" />
        </div>
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {renderUserAvatar()}
            {userData && (
              <span className="font-semibold text-black">
                {userData.first_name} {userData.last_name}
              </span>
            )}
          </div>

          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-1.5 text-gray-900">
              <Link
                href="/profile"
                className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
              >
                <FiUser className="size-4 relative -top-[1px]" />
                <span>Profile</span>
              </Link>
              <Link
                href="/setting"
                className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
              >
                <LuSettings className="size-4 relative -top-[1px]" />
                <span>Settings</span>
              </Link>
              <div
                onClick={handleLogout}
                className="w-full px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1 cursor-pointer"
              >
                <IoLogOutOutline className="size-[19px] relative -top-[0.5px]" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
