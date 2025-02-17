
import React, { useEffect, useState } from "react";
import { BackgroundGradientAnimation } from "@/app/ui/background";
import BookingForm from "@/components/dynamic/Book/Forms/Booking";
import Navbar from "@/components/global/header/Navbar";
import LiveCounter from "@/components/static/LiveCounter";
import { Gruppo } from "next/font/google";
import LoyaltyPopup from "@/components/popup/PopUp";

const gruppo = Gruppo({
  subsets: ['latin'],
  variable: "--font-geist-mono",
  weight: "400",
});

const Hero = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  useEffect(() => {
    // Optionally, you can use localStorage to show the popup only once per session
    const hasSeenPopup = localStorage.getItem("hasSeenPopup");
    if (hasSeenPopup) {
      setIsPopupOpen(false);
    } else {
      localStorage.setItem("hasSeenPopup", "true");
    }
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <BackgroundGradientAnimation>
      <div className="z-50 mb-20 relative">
        <Navbar />
      </div>
      <div className="absolute z-40 inset-0 flex pl-5 lg:pl-0 pr-8 lg:pr-0 items-center">
        <div className="max-w-5xl mx-auto mt-36 lg:mt-20">
          <h1
            className={`${gruppo.className} text-gray-900 text-3xl md:text-4xl lg:text-6xl xl:text-6xl text-center mx-auto`}
          >
            Explore local <span className="text-[#f4b8ae]">beauty</span> and
            wellness services tailored for you
          </h1>
          <div className="mt-10">
            <BookingForm />
          </div>
          <LiveCounter />
        </div>
      </div>
      <LoyaltyPopup isOpen={isPopupOpen} onClose={closePopup} />
    </BackgroundGradientAnimation>
  );
};

export default Hero;

