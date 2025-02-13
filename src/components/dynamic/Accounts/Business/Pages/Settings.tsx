"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/dynamic/Accounts/Customer/Global/Header";
import Sidebar from "@/components/dynamic/Accounts/Customer/Global/Sidebar";
import { useRouter } from "next/navigation";
import api from "@/services/auth";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { Gruppo } from "next/font/google";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dialcode: string;
}

const Setting = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchUserData = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("Authentication token is missing.");
        return;
      }

      const response = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;
      setUserData(data);
      setNewFirstName(data.first_name);
      setNewLastName(data.last_name);
      setNewEmail(data.email);
      setNewPhoneNumber(data.phone);
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const handleUpdateName = async () => {
    if (!userData) return;

    const token = Cookies.get("access_token");
    if (!token) {
      console.error("Authentication token is missing.");
      return;
    }

    try {
      const response = await api.patch(
        `/users/${userData.id}`,
        {
          first_name: newFirstName,
          last_name: newLastName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Name updated successfully!");
        setUserData({
          ...userData,
          first_name: newFirstName,
          last_name: newLastName,
        });
      }
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name. Please try again.");
    }
  };

  const handleUpdateEmail = async () => {
    if (!userData) return;

    const token = Cookies.get("access_token");
    if (!token) {
      console.error("Authentication token is missing.");
      return;
    }

    try {
      const response = await api.patch(
        `/users/${userData.id}`,
        {
          email: newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Email updated successfully!");
        setUserData({
          ...userData,
          email: newEmail,
        });
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email. Please try again.");
    }
  };

  const handleUpdatePhoneNumber = async () => {
    if (!userData) return;

    const token = Cookies.get("access_token");
    if (!token) {
      console.error("Authentication token is missing.");
      return;
    }

    try {
      const response = await api.patch(
        `/users/${userData.id}`,
        {
          phone: newPhoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Phone number updated successfully!");
        setUserData({
          ...userData,
          phone: newPhoneNumber,
        });
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      toast.error("Failed to update phone number. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!userData) return;

    const token = Cookies.get("access_token");
    if (!token) {
      console.error("Authentication token is missing.");
      toast.error("Authentication token is missing.");
      return;
    }

    try {
      const response = await api.delete(`/users/${userData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        toast.success("Your account has been deleted successfully.");
        router.push("/");
      } else {
        console.error("Failed to delete account. Response status:", response.status);
        toast.error("Failed to delete account. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      toast.error("An error occurred while deleting your account. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="">
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`p-4 transition-transform ${
            isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
          }`}
        >
          <div className="p-4 mt-20 max-w-6xl mx-auto">
            {loading ? (
              <div>
                <Skeleton height={30} width={300} />
                <div className="lg:flex gap-10 mb-10 mt-8">
                  <div className="lg:w-4/12 mb-3">
                    <Skeleton height={600} />
                  </div>
                  <div className="lg:w-8/12">
                    <Skeleton height={400} />
                  </div>
                </div>
              </div>
            ) : userData ? (
              <>
                <h1 className={`${gruppo.className} text-3xl font-bold mb-8`}>Settings</h1>
                <div className="space-y-6">
                  {/* Change Full Name */}
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 sm:text-lg">Change Full Name</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 sm:text-sm">First Name</label>
                        <input
                          type="text"
                          value={newFirstName}
                          onChange={(e) => setNewFirstName(e.target.value)}
                          className="w-1/2 p-2 border rounded-lg text-sm sm:text-xs border-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 sm:text-sm">Last Name</label>
                        <input
                          type="text"
                          value={newLastName}
                          onChange={(e) => setNewLastName(e.target.value)}
                          className="w-full p-2 border rounded-lg text-sm sm:text-xs border-opacity-50"
                        />
                      </div>
                      <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-xs"
                        onClick={handleUpdateName}
                      >
                        Update Name
                      </button>
                    </div>
                  </div>

                  {/* Change Email */}
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 sm:text-lg">Change Email</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 sm:text-sm">New Email</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full p-2 border rounded-lg text-sm sm:text-xs border-opacity-50"
                        />
                      </div>
                      <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-xs"
                        onClick={handleUpdateEmail}
                      >
                        Update Email
                      </button>
                    </div>
                  </div>

                  {/* Change Phone Number */}
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 sm:text-lg">Change Phone Number</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 sm:text-sm">New Phone Number</label>
                        <input
                          type="tel"
                          value={newPhoneNumber}
                          onChange={(e) => setNewPhoneNumber(e.target.value)}
                          className="w-full p-2 border rounded-lg text-sm sm:text-xs border-opacity-50"
                        />
                      </div>
                      <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-xs"
                        onClick={handleUpdatePhoneNumber}
                      >
                        Update Phone Number
                      </button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 sm:text-lg">Delete Account</h2>
                    <p className="text-gray-600 mb-4 sm:text-sm">
                      Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                    <button
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm sm:text-xs"
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;