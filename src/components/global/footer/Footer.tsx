"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import api from "@/services/auth";
import Logo from "../../../../public/assets/logo-2.png";
import { Gruppo } from "next/font/google";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiPhoneCall } from "react-icons/bi";
import { TbMailOpened } from "react-icons/tb";
import { BsChevronRight } from "react-icons/bs";
// import LoyaltyPopup from "@/components/popup/PopUp";
import gsap from "gsap";


const gruppo = Gruppo({ weight: "400", subsets: ["latin"] });

interface Article {
  id: string;
  title: string;
  slug: string;
}
export default function Footer() {
  const [articles, setArticles] = React.useState<Article[]>([]);

  useEffect(() => {
    const getNewArticles = async () => {
      try {
        const response = await api.get("/items/footer_menu");
        console.log(response.data.data); // Debugging: Log the articles data
        setArticles(response.data.data); // Storing data as an array
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    getNewArticles();
  }, []);

  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const headingRef = useRef(null);
  const bookingFormRef = useRef(null);

  useEffect(() => {
    // Optionally, you can use localStorage to show the popup only once per session
    // const hasSeenPopup = localStorage.getItem("hasSeenPopup");
    // if (hasSeenPopup) {
    //   setIsPopupOpen(false);
    // } else {
    //   localStorage.setItem("hasSeenPopup", "true");
    // }

    // // GSAP animations
    // gsap.fromTo(
    //   headingRef.current,
    //   { opacity: 0, y: 50 },
    //   { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    // );

    // gsap.fromTo(
    //   bookingFormRef.current,
    //   { opacity: 0, x: -50 },
    //   { opacity: 1, x: 0, duration: 1, ease: "power2.out", delay: 0.5 }
    // );
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
  };


  return (
    // <footer className="bg-gray-50 py-4 px-4 sm:py-6 md:py-8">
    //   <div className="max-w-5xl mx-auto">
    //     {/* Brand and App Links */}
    //     <div className="flex flex-col items-center justify-center mb-4">
    //       <Link href="/">
    //         {/* Responsive Logo */}
    //         <Image
    //           src="/assets/logo-2.png"
    //           alt="logo"
    //           width={120}
    //           height={40}
    //           className="object-contain sm:w-[90px] md:w-[120px] lg:w-[140px]"
    //         />
    //       </Link>
    //       <div className="flex gap-4 text-[#f4b8ae] mt-2">
    //         {/* Social Media Icons */}
    //         <FaFacebookF
    //           className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
    //           aria-label="Facebook"
    //         />
    //         <FaTwitter
    //           className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
    //           aria-label="Twitter"
    //         />
    //         <FaLinkedinIn
    //           className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
    //           aria-label="LinkedIn"
    //         />
    //         <FaInstagram
    //           className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
    //           aria-label="Instagram"
    //         />
    //       </div>

    //       {/* Smaller Text below logo */}
    //       <p className="text-gray-600 text-xs sm:text-sm mt-2 text-center">
    //         Empowering beauty and wellness, one click at a time
    //       </p>
    //     </div>

    //     {/* Links for Privacy Policy, Terms of Service, and Contact Us */}
    //     <div className="text-center ">
    //       <p className="text-gray-600 text-xs sm:text-sm">
    //       {articles.length > 0 ? (
    //         articles.map((article) => (
    //         <Link
    //           key={article.id}
    //           href={`/page/${article.slug}`}
    //           className="hover:underline transition-all duration-200 ml-4"
    //         >
    //           {article.title}
    //         </Link>
    //            ))
    //           ) : (
    //           <></>
    //           )}

    //         <Link
    //           href="/contact"
    //           className="hover:underline transition-all duration-200 ml-4"
    //         >
    //           Contact Us
    //         </Link>
    //       </p>
    //     </div>
    //   </div>

    //   {/* Bottom Section */}
    //   <div className="max-w-5xl mx-auto">
    //     <div className="border-t border-gray-300 mt-4 pt-4 flex flex-col sm:flex-row justify-between items-center text-gray-600 text-xs sm:text-sm">
    //       <div className="flex items-center gap-2">
    //         <span>by: BeeBoss</span>
    //       </div>
    //       <p className="mt-2 sm:mt-0 text-center">
    //         © 2024 BeautyPool. All Rights Reserved.
    //       </p>
    //     </div>
    //   </div>
    // </footer>
    <div className="bg-slate-50 py-10">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">
              Please feel free to get in touch with us
            </h1>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-start mb-4 md:mb-0">
              <i className="fas fa-map-marker-alt text-blue-500 text-2xl mr-4"></i>
              <div>
                <h2 className="font-semibold mb-1.5 text-lg">Our Location</h2>
                <p>
                  <HiOutlineLocationMarker className="inline size-5 text-[#f47c66] relative -top-[1px]" />{" "}
                  Business Bay, Dubai, UAE
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div>
                <h2 className="font-semibold mb-1.5 text-lg">
                  How Can We Help?
                </h2>
                <p>
                  <TbMailOpened className="inline size-5 relative text-[#f47c66] -top-[1px]" />{" "}
                  info@beautypool.ae
                </p>
                <p>
                  <BiPhoneCall className="inline size-5 relative text-[#f47c66] -top-[1px]" />{" "}
                  +971 585 212 534
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div>
                <h2 className="font-semibold mb-1.5 text-lg">Legal</h2>
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <li key={article.id} className="list-none">
                      <Link
                        href={`/page/${article.slug}`}
                        className="hover:text-[#f47c66]"
                      >
                        <BsChevronRight className="inline size-4 -mr-0.5 relative text-[#f47c66] -top-[1px]" />{" "}
                        {article.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>No Pages Found!</>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Link href="/" className="flex justify-center items-center">
                <Image
                  src={Logo}
                  alt="logo"
                  width={0}
                  height={0}
                  className="-mr-4 w-16"
                />
                <span
                  className={`${gruppo.className} text-3xl hidden md:block text-[#f4b8ae] font-bold`}
                >
                  eautypool
                </span>
              </Link>
            </div>
            <div className="text-gray-500 text-sm ml-3">
              © 2025 Beautypool | All Rights Reserved
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {/* <a href="#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-twitter"></i>
              </a> */}
              <a href="https://www.instagram.com/beautypool/" target="_blank" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-instagram"></i>
              </a>
              {/* <a href="#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-linkedin-in"></i>
              </a> */}
            </div>
      <div className="max-w-5xl mx-auto">
        {/* Brand and App Links */}
        <div className="flex flex-col items-center justify-center mb-4">
          <Link href="/">
            {/* Responsive Logo */}
            <Image
              src="/assets/logo-2.png"
              alt="logo"
              width={120}
              height={40}
              className="object-contain sm:w-[90px] md:w-[120px] lg:w-[140px]"
            />
          </Link>
          <div className="flex gap-4 text-[#f4b8ae] mt-2">
            {/* Social Media Icons */}
            <FaFacebookF
              className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
              aria-label="Facebook"
            />
            <FaTwitter
              className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
              aria-label="Twitter"
            />
            <FaLinkedinIn
              className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
              aria-label="LinkedIn"
            />
            <FaInstagram
              className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
              aria-label="Instagram"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
{/*     <LoyaltyPopup isOpen={isPopupOpen} onClose={closePopup} /> */}
    </div>
  );
}
