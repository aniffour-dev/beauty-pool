"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import BookDashboard from "./BookDashboard";
import PaymentsDashboard from "./PaymentsDashboard";
import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Business/Global/Header";
import api from "@/services/auth";

interface UserData {
  id: string;
  first_name: string;
}

interface Appointment {
  date: string;
  price: number;
  status: string;
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  upcomingAppointments: number;
  monthlyData: {
    labels: string[];
    revenues: number[];
    bookings: number[];
  };
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomeDashboard = () => {
  const [activePage] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    upcomingAppointments: 0,
    monthlyData: {
      labels: [],
      revenues: [],
      bookings: [],
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me"); // Adjust the endpoint as needed
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);

  const fetchAndProcessData = async () => {
    try {
      if (!userData?.id) {
        console.error("User ID is not available.");
        return;
      }
  
      const response = await api.get("/items/appointments", {
        params: {
          fields: ["date", "price", "status"].join(","),
          filter: {
            business_user_id: userData.id, // Filter by the logged-in user's ID
          },
        },
      });
  
      const appointments: Appointment[] = response.data.data;
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
      // Process monthly data for the last 6 months
      const monthlyData: {
        [key: string]: { revenue: number; bookings: number };
      } = {};
      const labels: string[] = [];
      const revenues: number[] = [];
      const bookings: number[] = [];
  
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = monthDate.toLocaleString("default", {
          month: "short",
        });
        labels.push(monthKey);
        monthlyData[monthKey] = { revenue: 0, bookings: 0 };
      }
  
      // Calculate stats
      let totalBookingsLastMonth = 0;
      let totalRevenueLastMonth = 0;
      let upcomingAppointments = 0;
  
      appointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const monthKey = appointmentDate.toLocaleString("default", {
          month: "short",
        });
  
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].revenue += Number(appointment.price);
          monthlyData[monthKey].bookings += 1;
        }
  
        // Last month stats
        if (appointmentDate >= lastMonth && appointmentDate < now) {
          totalBookingsLastMonth++;
          totalRevenueLastMonth += Number(appointment.price);
        }
  
        // Upcoming appointments
        if (appointmentDate >= now && appointmentDate <= nextWeek) {
          upcomingAppointments++;
        }
      });
  
      // Fill in the arrays for the chart
      labels.forEach((month) => {
        revenues.push(monthlyData[month].revenue);
        bookings.push(monthlyData[month].bookings);
      });
  
      setStats({
        totalBookings: totalBookingsLastMonth,
        totalRevenue: totalRevenueLastMonth,
        upcomingAppointments,
        monthlyData: { labels, revenues, bookings },
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchAndProcessData();
    }
  }, [userData]); // Re-run when userData changes

  const revenueChartData = {
    labels: stats.monthlyData.labels,
    datasets: [
      {
        label: "Revenue",
        data: stats.monthlyData.revenues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const bookingsChartData = {
    labels: stats.monthlyData.labels,
    datasets: [
      {
        label: "Bookings",
        data: stats.monthlyData.bookings,
        fill: false,
        borderColor: "rgb(153, 102, 255)",
        tension: 0.1,
      },
    ],
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
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="text-3xl font-semibold">
                Welcome, {userData?.first_name || "Loading..."}
              </div>
            </div>

            {/* Search Bar */}
            <form className="">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-violet-500 focus:border-slate-300 !outline-none"
                  placeholder="Search Mockups, Logos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="text-white absolute end-2.5 bottom-2.5 bg-[#f39685] hover:bg-[#f08774] transition-all duration-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="my-14">
              <div className="border-t border-slate-200"></div>
            </div>

            {activePage === "home" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-xl rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Total Bookings</h3>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  <p className="text-sm text-gray-500">Last month</p>
                </div>

                <div className="bg-white shadow-xl rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Last month</p>
                </div>

                <div className="bg-white shadow-xl rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Upcoming Appointments
                  </h3>
                  <p className="text-3xl font-bold">
                    {stats.upcomingAppointments}
                  </p>
                  <p className="text-sm text-gray-500">Next 7 days</p>
                </div>
              </div>
            )}

            {activePage === "bookings" && (
              <BookDashboard searchTerm={searchTerm} />
            )}
            {activePage === "payments" && <PaymentsDashboard />}

            {/* Analytics (Charts) */}
            <div className="lg:flex gap-10">
              <div className="lg:w-6/12 mb-6">
                <div className="bg-white shadow-xl rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
                  <Line data={revenueChartData} />
                </div>
              </div>
              <div className="lg:w-6/12">
                <div className="bg-white shadow-xl rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">Booking Trends</h3>
                  <Line data={bookingsChartData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;






// "use client";
// import React, { useState, useEffect } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import BookDashboard from "./BookDashboard";
// import PaymentsDashboard from "./PaymentsDashboard";
// import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
// import Header from "@/components/dynamic/Accounts/Business/Global/Header";
// import api from "@/services/auth";

// interface UserData {
//   id: string;
//   first_name: string;
// }

// interface Appointment {
//   date: string;
//   price: number;
//   status: string;
// }

// interface DashboardStats {
//   totalBookings: number;
//   totalRevenue: number;
//   upcomingAppointments: number;
//   monthlyData: {
//     labels: string[];
//     revenues: number[];
//     bookings: number[];
//   };
// }

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const HomeDashboard = () => {
//   const [activePage] = useState("home");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalBookings: 0,
//     totalRevenue: 0,
//     upcomingAppointments: 0,
//     monthlyData: {
//       labels: [],
//       revenues: [],
//       bookings: [],
//     },
//   });

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleUserDataFetched = (data: UserData | null) => {
//     setUserData(data);
//   };

//   const fetchAndProcessData = async (userId: string) => {
//     try {
//       const response = await api.get("/items/appointments", {
//         params: {
//           fields: ["date", "price", "status"].join(","),
//           filter: {
//             user_id: userId,
//           },
//         },
//       });

//       const appointments: Appointment[] = response.data.data;
//       const now = new Date();
//       const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//       const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//       // Process monthly data for the last 6 months
//       const monthlyData: {
//         [key: string]: { revenue: number; bookings: number };
//       } = {};
//       const labels: string[] = [];
//       const revenues: number[] = [];
//       const bookings: number[] = [];

//       for (let i = 5; i >= 0; i--) {
//         const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const monthKey = monthDate.toLocaleString("default", {
//           month: "short",
//         });
//         labels.push(monthKey);
//         monthlyData[monthKey] = { revenue: 0, bookings: 0 };
//       }

//       // Calculate stats
//       let totalBookingsLastMonth = 0;
//       let totalRevenueLastMonth = 0;
//       let upcomingAppointments = 0;

//       appointments.forEach((appointment) => {
//         const appointmentDate = new Date(appointment.date);
//         const monthKey = appointmentDate.toLocaleString("default", {
//           month: "short",
//         });

//         if (monthlyData[monthKey]) {
//           monthlyData[monthKey].revenue += Number(appointment.price);
//           monthlyData[monthKey].bookings += 1;
//         }

//         // Last month stats
//         if (appointmentDate >= lastMonth && appointmentDate < now) {
//           totalBookingsLastMonth++;
//           totalRevenueLastMonth += Number(appointment.price);
//         }

//         // Upcoming appointments
//         if (appointmentDate >= now && appointmentDate <= nextWeek) {
//           upcomingAppointments++;
//         }
//       });

//       // Fill in the arrays for the chart
//       labels.forEach((month) => {
//         revenues.push(monthlyData[month].revenue);
//         bookings.push(monthlyData[month].bookings);
//       });

//       setStats({
//         totalBookings: totalBookingsLastMonth,
//         totalRevenue: totalRevenueLastMonth,
//         upcomingAppointments,
//         monthlyData: { labels, revenues, bookings },
//       });
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await api.get("/users/me");
//         handleUserDataFetched(response.data);
//         if (response.data && response.data.id) {
//           fetchAndProcessData(response.data.id);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const revenueChartData = {
//     labels: stats.monthlyData.labels,
//     datasets: [
//       {
//         label: "Revenue",
//         data: stats.monthlyData.revenues,
//         fill: false,
//         borderColor: "rgb(75, 192, 192)",
//         tension: 0.1,
//       },
//     ],
//   };

//   const bookingsChartData = {
//     labels: stats.monthlyData.labels,
//     datasets: [
//       {
//         label: "Bookings",
//         data: stats.monthlyData.bookings,
//         fill: false,
//         borderColor: "rgb(153, 102, 255)",
//         tension: 0.1,
//       },
//     ],
//   };

//   return (
//     <div className="">
//       <Header toggleSidebar={toggleSidebar} />
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div
//         className={`p-4 transition-transform ${
//           isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
//         }`}
//       >
//         <div className="p-4 mt-20">
//           <div className="max-w-6xl mx-auto">
//             <div className="flex justify-between items-center mb-8">
//               <div className="text-3xl font-semibold">
//                 Welcome, {userData?.first_name || "Loading..."}
//               </div>
//             </div>

//             {/* Search Bar */}
//             <form className="">
//               <label
//                 htmlFor="default-search"
//                 className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
//               >
//                 Search
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                   <svg
//                     className="w-4 h-4 text-gray-500"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   type="search"
//                   id="default-search"
//                   className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-violet-500 focus:border-slate-300 !outline-none"
//                   placeholder="Search Mockups, Logos..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="submit"
//                   className="text-white absolute end-2.5 bottom-2.5 bg-[#f39685] hover:bg-[#f08774] transition-all duration-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
//                 >
//                   Search
//                 </button>
//               </div>
//             </form>

//             <div className="my-14">
//               <div className="border-t border-slate-200"></div>
//             </div>

//             {activePage === "home" && (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                 <div className="bg-white shadow-xl rounded-lg p-6">
//                   <h3 className="text-xl font-semibold mb-2">Total Bookings</h3>
//                   <p className="text-3xl font-bold">{stats.totalBookings}</p>
//                   <p className="text-sm text-gray-500">Last month</p>
//                 </div>

//                 <div className="bg-white shadow-xl rounded-lg p-6">
//                   <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
//                   <p className="text-3xl font-bold">
//                     ${stats.totalRevenue.toLocaleString()}
//                   </p>
//                   <p className="text-sm text-gray-500">Last month</p>
//                 </div>

//                 <div className="bg-white shadow-xl rounded-lg p-6">
//                   <h3 className="text-xl font-semibold mb-2">
//                     Upcoming Appointments
//                   </h3>
//                   <p className="text-3xl font-bold">
//                     {stats.upcomingAppointments}
//                   </p>
//                   <p className="text-sm text-gray-500">Next 7 days</p>
//                 </div>
//               </div>
//             )}

//             {activePage === "bookings" && (
//               <BookDashboard searchTerm={searchTerm} />
//             )}
//             {activePage === "payments" && <PaymentsDashboard />}

//             {/* Analytics (Charts) */}
//             <div className="lg:flex gap-10">
//               <div className="lg:w-6/12 mb-6">
//                 <div className="bg-white shadow-xl rounded-lg p-4">
//                   <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
//                   <Line data={revenueChartData} />
//                 </div>
//               </div>
//               <div className="lg:w-6/12">
//                 <div className="bg-white shadow-xl rounded-lg p-4">
//                   <h3 className="text-xl font-semibold mb-4">Booking Trends</h3>
//                   <Line data={bookingsChartData} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeDashboard;
