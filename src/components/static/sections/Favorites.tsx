"use client";
import React, { useEffect, useState, useRef } from "react";
import api from "@/services/auth";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Gruppo } from "next/font/google";
import { TiLocationOutline } from "react-icons/ti";
import { GoHeartFill } from "react-icons/go";
import { OrbitProgress } from "react-loading-indicators";
import Image from "next/image";
import gsap from "gsap";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

interface UserData {
  id: string;
  first_name: string;
}

interface Article {
  id: string;
  slug: string;
  label: string;
  featured_image: string;
  Address: string;
  user_created: string;
}

interface Favorite {
  id: string;
  article: Article;
}

export default function Favorites() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [removingFavoriteId, setRemovingFavoriteId] = useState<string | null>(
    null
  );
  const titleRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me");
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userData?.id) {
        try {
          const response = await api.get(
            `/items/favorites?filter[user_created][_eq]=${userData.id}&fields=*,article.id,article.slug,article.label,article.featured_image,article.Address`
          );
          setFavorites(response.data.data);
        } catch (error) {
          console.error("Error fetching favorites:", error);
          setError("Failed to fetch favorites");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFavorites();
  }, [userData?.id]);

  useEffect(() => {
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
  }, [loading]);

  const handleRemoveFavorite = async (
    event: React.MouseEvent,
    favoriteId: string
  ) => {
    event.stopPropagation(); // Prevent event from bubbling up
    event.preventDefault(); // Prevent default link navigation

    setRemovingFavoriteId(favoriteId);
    try {
      await api.delete(`/items/favorites/${favoriteId}`);
      setFavorites(favorites.filter((favorite) => favorite.id !== favoriteId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      setError("Failed to remove favorite");
    } finally {
      setRemovingFavoriteId(null);
    }
  };

  return (
    <div className="py-10 px-6 pb-10">
      {favorites.length > 0 && (
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <h2
            ref={titleRef}
            className={`${gruppo.className} text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3`}
          >
            Favorites
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
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <SwiperSlide
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-300"></div>
                      <div className="absolute top-2 right-2">
                        <div className="bg-white rounded-full p-2 shadow-md">
                          <div className="w-5 h-5 bg-gray-300"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3 mt-4"></div>
                    </div>
                  </SwiperSlide>
                ))
              : favorites.map((favorite) => (
                  <SwiperSlide key={favorite.article?.id ?? "unknown"}>
                    <Link
                      href={
                        favorite.article?.slug
                          ? `/a/${favorite.article.slug}`
                          : "#"
                      }
                    >
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative">
                          <Image
                            alt="Therapy room with two massage tables"
                            className="w-full h-48 object-cover"
                            height={400}
                            src={`https://maoulaty.shop/assets/${favorite.article?.featured_image}`}
                            width={600}
                          />
                          <div className="absolute top-2 right-2">
                            <button
                              className="bg-white rounded-full p-2 shadow-md"
                              onClick={(e) =>
                                handleRemoveFavorite(e, favorite.id)
                              }
                              disabled={removingFavoriteId === favorite.id}
                            >
                              {removingFavoriteId === favorite.id ? (
                                <OrbitProgress
                                  variant="disc"
                                  color="#d3d3d3"
                                  size="small"
                                  text=""
                                  textColor=""
                                />
                              ) : (
                                <GoHeartFill className="size-5 text-red-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h2 className="text-lg font-semibold">
                            {favorite.article?.label}
                          </h2>
                          <div className="flex items-center text-sm text-gray-600 mt-2">
                            <i className="fas fa-star text-black"></i>
                            <span className="ml-1">5.0</span>
                            <span className="ml-1">(214)</span>
                          </div>
                          <p className="text-gray-600 mt-2 text-sm flex justify-start items-center gap-0.5">
                            <TiLocationOutline className="size-5 text-slate-500" />
                            <span>{favorite.article?.Address}</span>
                          </p>
                          <div className="mt-4">
                            <span className="inline-block bg-[#ffeeeb] text-[#f47c66] font-semibold text-xs px-2 py-1 rounded-full">
                              Therapy Center
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}

            {/* Custom Navigation Buttons */}
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </Swiper>
        </div>
      )}
    </div>
  );
}
