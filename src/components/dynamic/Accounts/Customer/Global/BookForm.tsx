"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/auth";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import DatePicker from "@/components/dynamic/Book/Forms/DatePicker";

type Location = {
  name: string;
  adminName1?: string;
  countryName?: string;
  latitude: number;
  longitude: number;
};

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  context: {
    text: string;
  }[];
}

const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  const accessToken =
    "pk_test_51QBbcOAufKKBd4a0cutDWMMz2eIFkrhBPi2R8MwEhs0gYxv1sxMGt576gvQsiXJ6yrXNWpZ0ofzsoM8zJrKRDns500oRFyMmBb"; // Replace with your Mapbox API key
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return feature.place_name;
    } else {
      console.error("No data found");
      return "";
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "";
  }
};

export default function BookForm() {
  const [venueAndTreatment, setVenueAndTreatment] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTime, setSelectedTime] = useState("anytime");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [results, setResults] = useState<Location[]>([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [, setTime] = useState("");
  const timePopupRef = useRef<HTMLDivElement>(null);

  const fetchLocations = async (query: string): Promise<Location[]> => {
    const accessToken =
      "pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g"; // Replace with your Mapbox API key
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if data is available
      if (data.features) {
        return data.features.map((feature: MapboxFeature) => ({
          name: feature.place_name,
          latitude: feature.center[1],
          longitude: feature.center[0],
          adminName1: feature.context?.[0]?.text,
          countryName: feature.context?.[feature.context.length - 1]?.text,
        }));
      } else {
        console.error("No data found");
        return [];
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length >= 2) {
      const locations = await fetchLocations(value);
      setResults(locations);
    } else {
      setResults([]);
    }
  };

  const handleTimeSelection = (timeSlot: string) => {
    setSelectedTime(timeSlot);

    // Set the actual time value based on the selection
    switch (timeSlot) {
      case "Morning":
        setTime("09:00");
        setFromTime("06:00");
        setToTime("12:00");
        break;
      case "Afternoon":
        setTime("13:00");
        setFromTime("12:00");
        setToTime("17:00");
        break;
      case "Evening":
        setTime("17:00");
        setFromTime("17:00");
        setToTime("00:00");
        break;
      case "Anytime":
        setTime("00:00"); // or whatever default you want
        setFromTime("");
        setToTime("");
        break;
    }

    // Close the time selection popup
    setShowFilter(false);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/items/Categorie");
        setCategories(response.data.data); // Storing data as an array
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        const readableAddress = await reverseGeocode(latitude, longitude);
        setLocation(readableAddress); // Set the location input field with the readable address
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (
        !venueAndTreatment ||
        !location ||
        !date ||
        !selectedTime ||
        !selectedCategoryId
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (!currentLocation?.latitude || !currentLocation?.longitude) {
        throw new Error("Location coordinates are required");
      }

      // Create the booking object
      const bookingData = {
        venueAndTreatment,
        location,
        date: date?.toISOString().split("T")[0],
        time: selectedTime,
        coordinates: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
      };

      // Log the booking data
      console.log("Booking details:", bookingData);

      // Save the selected category ID and location coordinates in local storage
      localStorage.setItem("selectedCategoryId", selectedCategoryId);
      localStorage.setItem(
        "selectedLocation",
        JSON.stringify({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        })
      );

      // Construct the query parameters
      const queryParams = new URLSearchParams({
        venue: venueAndTreatment,
        date: date?.toISOString().split("T")[0],
        time: selectedTime,
        location,
        latitude: currentLocation.latitude.toString(),
        longitude: currentLocation.longitude.toString(),
        categoryId: selectedCategoryId,
      });

      // Redirect to the booking page
      router.push(`/book?${queryParams.toString()}`);

      // Reset form
      setVenueAndTreatment("");
      setLocation("");
      setDate(null);
      setTime("");
      setSelectedTime("anytime");
      setSelectedCategoryId(null);
    } catch (error) {
      console.error("Booking error:", error);
      // Here you could add user feedback for the error
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="shadow-md bg-slate-50 rounded-full p-1 flex justify-center items-center"
      >
        {/* Venue and Treatment Selection */}
        <div className="lg:flex gap-2">
          {/* Location Input */}
          <div className="lg:w-3/12 relative">
            <div className="flex items-center border-r-2 border-slate-200">
              <input
                type="text"
                placeholder="Current location"
                onChange={handleInputChange}
                value={location}
                className="outline-none border-none focus:outline-none bg-transparent focus:ring-0"
              />
            </div>
            {results.length > 0 && (
              <div className="mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto absolute w-full">
                <ul>
                  {results.map((result, index) => (
                    <li
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setLocation(result.name);
                        setCurrentLocation({
                          latitude: result.latitude,
                          longitude: result.longitude,
                        });
                        setResults([]);
                      }}
                    >
                      <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                      <div>
                        <div className="font-semibold">{result.name}</div>
                        {result.adminName1 && (
                          <div className="text-sm text-gray-500">{result.adminName1}</div>
                        )}
                        {result.countryName && (
                          <div className="text-sm text-gray-500">{result.countryName}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Treatment Input */}
          <div className="lg:w-3/12 relative">
            <div
              className="flex items-center bg-white border-r-2 border-slate-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <input
                type="text"
                placeholder="All treatments and venues"
                className="outline-none border-none focus:outline-none focus:ring-0"
                value={venueAndTreatment}
                onChange={(e) => setVenueAndTreatment(e.target.value)}
              />
            </div>
            {dropdownOpen && (
              <div className="bg-white p-4 rounded-lg shadow-md absolute w-full mt-2">
                <div className="space-y-4">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => {
                          setVenueAndTreatment(category.label);
                          setSelectedCategoryId(category.id);
                          setDropdownOpen(false);
                        }}
                      >
                        <div
                          className="w-7 h-7 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(https://maoulaty.shop/assets/${category.icon})`,
                          }}
                        ></div>
                        <span>{category.label}</span>
                      </div>
                    ))
                  ) : (
                    <div>No categories available</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="lg:w-2/12">
            <div className="flex items-center border rounded-full px-4 py-0.5">
              <DatePicker
                id="date-picker"
                value={date ? date.toISOString().split("T")[0] : ""}
                onChange={(selectedDate) => setDate(selectedDate)}
              />
            </div>
          </div>

          {/* Time Input */}
          <div className="lg:w-2/12 relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Set Time"
                className="outline-none border-none focus:outline-none bg-transparent focus:ring-0 placeholder-gray-400"
                onClick={() => setShowFilter(!showFilter)}
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
            {showFilter && (
              <div
                ref={timePopupRef}
                className="mt-4 bg-white rounded-lg shadow-md p-4 absolute w-full"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Anytime", "Morning", "Afternoon", "Evening"].map((time) => (
                    <button
                      key={time}
                      className={`px-4 py-2 rounded-full ${
                        selectedTime === time
                          ? "bg-[#eca4977c] text-slate-900"
                          : "border border-gray-300 text-gray-700"
                      }`}
                      onClick={() => handleTimeSelection(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative w-1/2">
                    <select
                      className="block w-full bg-white border text-gray-700 py-2 px-4 rounded focus:outline-none"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                    >
                      <option>From</option>
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i}>{i.toString().padStart(2, "0")}:00</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative w-1/2">
                    <select
                      className="block w-full bg-white border text-gray-700 py-2 px-4 rounded focus:outline-none"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                    >
                      <option>To</option>
                      {Array.from({ length: 23 }, (_, i) => (
                        <option key={i}>{(i + 1).toString().padStart(2, "0")}:00</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}