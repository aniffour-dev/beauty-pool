"use client";
import React from "react";
import { IoIosArrowDropright } from "react-icons/io";
import Link from "next/link";
import BG from "../../../public/assets/register.webp";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import LoginCustomer from "./logins/LoginCustomer";
import LoginBusiness from "./logins/LoginBusiness";
import { Gruppo } from "next/font/google";

const gruppo = Gruppo({
    subsets: ["latin"],
    variable: "--font-geist-mono",
    weight: "400",
  });

const Register = () => {
  const [cutomers, setCustomers] = React.useState(false);
  const [business, setBusiness] = React.useState(false);
  const [formselection, setFormSelection] = React.useState(true);

  const handleBusiness = () => {
    setBusiness(true);
    setCustomers(false);
    setFormSelection(false);
  };

  const handleCustomer = () => {
    setCustomers(true);
    setBusiness(false);
    setFormSelection(false);
  };

  return (
    <div className="lg:flex">
      {/* Left side: Fixed background image */}
      <div className="lg:w-7/12 hidden lg:block fixed top-0 left-0 h-full">
        <div
          className="min-h-screen w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${"" + BG.src + ""})`,
            height: "100vh",
          }}
        >
          <div className="h-full w-full bg-gradient-to-r px-5 lg:px-0 from-[#f4b8ae]/60 via-[#f9c8bf]/60 to-[#f48673]/60  flex items-center justify-center"></div>
        </div>
      </div>

      {/* Right side: Scrollable content */}
      <div className="lg:w-5/12 ml-auto h-screen overflow-y-auto">
        <div className="bg-white min-h-screen w-full p-10">
          <div className="flex justify-start">
            <Link href="/">
              <MdOutlineKeyboardBackspace className="size-7 text-gray-600" />
            </Link>
          </div>
          {formselection && (
            <>
              <h2
                className={`${gruppo.className} text-2xl md:text-3xl my-5 text-gray-800 text-center font-serif`}
              >
                Sign In to BeautyPool
              </h2>
              <div className="flex flex-col items-center space-y-4 p-4">
                <button
                  onClick={handleCustomer}
                  className="w-full max-w-md p-4 border rounded-lg shadow-sm flex justify-between items-center transition-all hover:bg-slate-100"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-left">
                      Customers
                    </h2>
                    <p className="text-gray-600">
                      Book salons and spas near you
                    </p>
                  </div>
                  <IoIosArrowDropright className="size-7 text-gray-600" />
                </button>
                <button
                  onClick={handleBusiness}
                  className="w-full max-w-md p-4 border rounded-lg shadow-sm flex justify-between items-center transition-all hover:bg-slate-100"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-left">
                      Business
                    </h2>
                    <p className="text-gray-600">
                      Manage and grow your business
                    </p>
                  </div>
                  
                  <IoIosArrowDropright className="size-7 text-gray-600" />
                </button>
              </div>
            </>
          )}
          {cutomers && <LoginCustomer />}
          {business && <LoginBusiness />}
        </div>
      </div>
    </div>
  );
};

export default Register;
