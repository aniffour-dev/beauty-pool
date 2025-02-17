import React from "react";
import { MdOutlineFaceRetouchingNatural } from "react-icons/md";
import { MdCleanHands } from "react-icons/md";
import { IoDiamondOutline } from "react-icons/io5";
import { CiDiscount1 } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { FaHandHoldingMedical } from "react-icons/fa";

export default function WhyUs() {
  return (
      <div className="flex justify-center mb-10 md:mb-10 lg:mb-20 xl:mb-20">
        <div className="max-w-6xl w-full text-center">
          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 md:p-4 rounded-full text-[#f4b8ae] text-3xl md:text-4xl shadow-md">
                <MdOutlineFaceRetouchingNatural />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-bold mt-4 text-gray-800">
                Natural
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-500 mt-2 max-w-[300px]">
                Embrace beauty powered by 100% natural ingredients for healthier
                care.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 md:p-4 rounded-full text-[#f4b8ae] text-3xl md:text-4xl shadow-md">
                <MdCleanHands />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-bold mt-4 text-gray-800">
                Hygiene
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-500 mt-2 max-w-[300px]">
                Guaranteed cleanliness with carefully selected, safe
                ingredients.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 md:p-4 rounded-full text-[#f4b8ae] text-3xl md:text-4xl shadow-md">
                <FaHandHoldingMedical />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-bold mt-4 text-gray-800">
                Professional
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-500 mt-2 max-w-[300px]">
                Our talented team delivers unmatched expertise and quality.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 md:p-4 rounded-full text-[#f4b8ae] text-3xl md:text-4xl shadow-md">
                <IoDiamondOutline />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-bold mt-4 text-gray-800">
                Experience
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-500 mt-2 max-w-[300px]">
                Years of skill combined with a passion for enhancing beauty.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 md:p-4 rounded-full text-[#f4b8ae] text-3xl md:text-4xl shadow-md">
                <CiDiscount1 />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-bold mt-4 text-gray-800">
                Special Sale
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-500 mt-2 max-w-[300px]">
                Enjoy exclusive discounts on premium beauty products and
                services.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 md:p-4 rounded-full text-[#f4b8ae] text-3xl md:text-4xl shadow-md">
                <CiLight />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-bold mt-4 text-gray-800">
                Innovation
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-500 mt-2 max-w-[300px]">
                Pioneering new techniques to deliver cutting-edge beauty
                solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
