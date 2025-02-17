import React, { useEffect, useRef } from "react";
import { Gruppo } from "next/font/google";
import gsap from "gsap";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

export default function Achievement() {
  const appointmentsRef = useRef(null);
  const businessesRef = useRef(null);
  const countriesRef = useRef(null);
  const professionalsRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // GSAP animations for numbers
            gsap.fromTo(
              appointmentsRef.current,
              { innerText: 0 },
              {
                innerText: 70000,
                duration: 2,
                ease: "power2.out",
                snap: { innerText: 1 },
              }
            );

            gsap.fromTo(
              businessesRef.current,
              { innerText: 0 },
              {
                innerText: 2500,
                duration: 2,
                ease: "power2.out",
                snap: { innerText: 1 },
              }
            );

            gsap.fromTo(
              countriesRef.current,
              { innerText: 0 },
              {
                innerText: 8,
                duration: 2,
                ease: "power2.out",
                snap: { innerText: 1 },
              }
            );

            gsap.fromTo(
              professionalsRef.current,
              { innerText: 0 },
              {
                innerText: 1000,
                duration: 2,
                ease: "power2.out",
                snap: { innerText: 1 },
              }
            );

            // Stop observing after the animation has started
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup observer on component unmount
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="py-20 flex flex-col items-center justify-center sm:justify-center bg-gray-50 text-center px-3 md:px-2 lg:px-2 xl:px-2 shadow-lg mb-8 md:mb-10 lg:mb-16 xl:mb-16"
    >
      <h1
        className={`${gruppo.className} text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-gray-950 mb-4 max-w-[1000px] mx-auto`}
      >
        Your ultimate destination for beauty and self-care
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 mb-8">
        Discover simplicity with BeautyPool – your trusted partner in wellness
        and beauty services.
      </p>
      <div
        ref={appointmentsRef}
        className={`${gruppo.className} text-[#f4b8ae] font-extrabold text-5xl sm:text-6xl md:text-8xl mb-4`}
      >
        0
      </div>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-12">
        Appointments booked with BeautyPool
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center max-w-[800px] mx-auto">
        <div>
          <div
            ref={businessesRef}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800"
          >
            0
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            Businesses Trust Us
          </p>
        </div>
        <div>
          <div
            ref={countriesRef}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800"
          >
            0
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            Countries Using BeautyPool
          </p>
        </div>
        <div className="text-center">
          <div
            ref={professionalsRef}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800"
          >
            0
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            Stylists & Professionals
          </p>
        </div>
      </div>
    </div>
  );
}
