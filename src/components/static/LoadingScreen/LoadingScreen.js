"use client"
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

const LoadingScreen = ({ onAnimationComplete }) => {
  const loadingRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onAnimationComplete,
    });

    tl.to(loadingRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      delay: 3,
    });
  }, [onAnimationComplete]);

  return (
    <div
      ref={loadingRef}
      className="fixed inset-0 flex items-center justify-center bg-[#faa8a1] z-50"
    >
      <Image
        src="/path/to/your/logo.png" // Replace with the path to your logo
        alt="Logo"
        width={100}
        height={100}
        className="animate-spin"
      />
    </div>
  );
};

export default LoadingScreen;
