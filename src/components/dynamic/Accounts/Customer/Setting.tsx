"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dynamic/Accounts/Customer/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Customer/Global/Header";
import api from "@/services/auth";
import { Gruppo } from "next/font/google";
import Appointment from "./Loadings/Appointment";
import Cookies from "js-cookie";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

interface UserData {
  id: string;
  first_name: string;
}

interface SubService {
  sub_services_id: {
    name: string;
  };
}

interface Article {
  label: string;
  slug: string;
  featured_image: string;
}

interface Appointment {
  id: string;
  user_created: {
    first_name: string;
    last_name: string;
  };
  date_created: string;
  date: string;
  time: string; 
  booking_ref: string;
  services?: SubService[]; 
  price: string | number;
  article: Article;
}

const Setting = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/items/appointments", {
        params: {
          fields: [
            "id",
            "user_created.first_name",
            "user_created.last_name",
            "date_created",
            "date",
            "time", 
            "services.sub_services_id.name",
            "price",
            "booking_ref",
            "article.label",
            "article.slug",
            "article.featured_image",
          ].join(","),
          deep: {
            services: {
              sub_services_id: {
                fields: ["name"], 
              },
            },
          },
        },
      });

      console.log("API Response:", response.data.data);
      setAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchAppointments();
  
  }, []);
  

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now;
  };

  const isUpcoming = (appointment: Appointment) => {
    // Get the appointment date and time
    const [hours, minutes] = appointment.time.split(":").map(Number);
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Get current date and time
    const now = new Date();

    // Set both dates to start of their respective days for proper comparison
    const appointmentDay = new Date(appointmentDate).setHours(0, 0, 0, 0);
    const today = new Date(now).setHours(0, 0, 0, 0);

    // If the appointment is today, compare with current time
    if (appointmentDay === today) {
      return appointmentDate > now;
    }

    // If not today, simply compare the dates
    return appointmentDay > today;
  };

  const handleDeleteAccount = async () => {
    if (!userData) return;

    const token = Cookies.get("access_token"); // Retrieve the token from cookies

    if (!token) {
      console.error("Authentication token is missing.");
      alert("Authentication token is missing.");
      return;
    }

    try {
      console.log("Deleting account with ID:", userData.id);
      const response = await api.delete("/items/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: [userData.id], // Send the user ID in the payload
      });

      console.log("Delete account response:", response);

      if (response.status === 200 || response.status === 204) {
        // Account deleted successfully
        alert("Your account has been deleted successfully.");
        // Redirect to home or login page
        window.location.href = "/";
      } else {
        console.error(
          "Failed to delete account. Response status:",
          response.status
        );
        alert("Failed to delete account. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      alert("An error occurred while deleting your account. Please try again.");
    }
  };

  return (
    <div className="">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`p-4 transition-transform ${
          isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
        }`}
      >
        <div className="p-4 mt-20">
          <h2
            className={`${gruppo.className} text-4xl text-black font-bold mb-5`}
          >
            Setting
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-xl font-bold mb-2">Delete account</h1>
            <p className="text-gray-600 mb-4">
              Are you sure you want to leave BeautyPool?
            </p>
            <button
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              onClick={() => {
                console.log("Delete account button clicked");
                handleDeleteAccount();
              }}
            >
              Delete my account
            </button>
          </div>
          {loading ? <></> : <></>}
        </div>
      </div>
    </div>
  );
};

export default Setting;
