import React, { useEffect, useRef } from "react";
import api from "@/services/auth";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Gruppo } from "next/font/google";
import gsap from "gsap";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

interface Category {
  label: string;
}

interface Article {
  id: string;
  featured_image: string;
  slug: string;
  label: string;
  Address: string;
  category?: Category; // Make Category optional
}

export default function Trending() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const titleRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const getNewArticles = async () => {
      try {
        const response = await api.get(
          "/items/articles?fields[]=*,category.label"
        );
        console.log(response.data.data); // Debugging: Log the articles data
        setArticles(response.data.data); // Storing data as an array
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    getNewArticles();

    // GSAP animations
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    gsap.fromTo(
      swiperRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.5 }
    );
  }, []);

  return (
    <div className="py-10 px-6 bg-gray-50 pb-10 mb-8 md:mb-10 lg:mb-16 xl:mb-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className={`${gruppo.className} text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3`}
        >
          Trending
        </h2>

        <Swiper
          ref={swiperRef}
          slidesPerView={3}
          breakpoints={{
            // Mobile (default): 1 slide
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            // Tablet/iPad: 2 slides
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // Desktop: 3 slides
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation]}
          className="mySwiper relative !pb-5"
        >
          {articles.length > 0 ? (
            articles.map((article) => (
              <SwiperSlide key={article.id}>
                <Link href={`/a/${article.slug}`} key={article.id}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={`https://maoulaty.shop/assets/${article.featured_image}`}
                      alt={article.label}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      {/* Salon Name */}
                      <h3
                        className={`${gruppo.className} text-md sm:text-md lg:text-lg font-semibold text-gray-800 truncate`}
                      >
                        {article.label}
                      </h3>

                      {/* Rating */}
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <span className="text-yellow-500 mr-1">★</span>5
                        <span className="text-gray-500 ml-1">------</span>
                      </p>

                      {/* Location */}
                      <p className="text-xs text-gray-600 mt-2">
                        {article.Address}
                      </p>

                      {/* Category */}
                      {article.category && (
                        <span className="mt-2 inline-block text-xs font-medium bg-[#f4b9ae33] text-[#eca497] px-3 py-1 rounded-full">
                          {article.category.label}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="skeleton h-[250px] w-full"></div>
              <div className="skeleton h-[250px] w-full"></div>
              <div className="skeleton h-[250px] w-full"></div>
            </div>
          )}

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      </div>
    </div>
  );
}
