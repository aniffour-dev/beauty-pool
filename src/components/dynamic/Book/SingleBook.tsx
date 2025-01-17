"use client";
import React, { useState, useRef, useEffect } from "react";
import api from "@/services/auth";
import Cookies from "js-cookie";
import { IoStar } from "react-icons/io5";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { GoShareAndroid } from "react-icons/go";
import { CiClock1, CiLocationOn } from "react-icons/ci";
import { FaArrowDown } from "react-icons/fa";
import Link from "next/link";
import BookingSteps from "@/components/dynamic/Book/Steps/BookingSteps";
import BookingHeader from "@/components/global/booking-header/BookingHeader";
import Services from "@/components/dynamic/Book/Services";
import { OrbitProgress } from "react-loading-indicators";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
}

interface Review {
  user_created: UserData;
  date_created: string;
  rating: number;
  comment: string;
  article: number;
}

interface Article {
  id: string;
  label: string;
  description: string;
  reviews: Review[];
  Address: string;
  featured_image: string;
  location: string;
  monday_open?: string;
  monday_close?: string;
  tuesday_open?: string;
  tuesday_close?: string;
  wednesday_open?: string;
  wednesday_close?: string;
  thursday_open?: string;
  thursday_close?: string;
  friday_open?: string;
  friday_close?: string;
  saturday_open?: string;
  saturday_close?: string;
  sunday_open?: string;
  sunday_close?: string;
  [key: string]: string | Review[] | undefined; // Index signature to allow dynamic property access
}


interface SubService {
  id: string; // Add the id property
  name: string;
  price: string;
  duration: string;
  description: string;
}

interface ParentService {
  name: string;
  description: string;
  sub_services: SubService[];
}

interface Service {
  id: string;
  parent_service: ParentService;
}

interface SingleBookProps {
  slug: string;
}

interface OpeningTime {
  day: string;
  time: string;
  open: boolean;
  bold?: boolean; // Optional property
}

const formatTime = (time: string | null): string => {
  if (!time) return "Closed";
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

const getCurrentOpeningTime = (article: Article): string => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const days = [
    { open: article.sunday_open ?? null, close: article.sunday_close ?? null },
    { open: article.monday_open ?? null, close: article.monday_close ?? null },
    { open: article.tuesday_open ?? null, close: article.tuesday_close ?? null },
    { open: article.wednesday_open ?? null, close: article.wednesday_close ?? null },
    { open: article.thursday_open ?? null, close: article.thursday_close ?? null },
    { open: article.friday_open ?? null, close: article.friday_close ?? null },
    { open: article.saturday_open ?? null, close: article.saturday_close ?? null },
  ];

  const today = days[dayOfWeek];
  if (!today.open || !today.close) return "Closed";

  const [openHour, openMinute] = today.open.split(":").map(Number);
  const [closeHour, closeMinute] = today.close.split(":").map(Number);

  const isOpen =
    (currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute)) &&
    (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute));

  return isOpen ? formatTime(today.close) : "Closed";
};

const SingleBook: React.FC<SingleBookProps> = ({ slug }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, ] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [booking, setBooking] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  const handleBooking = () => {
    setBooking(true);
  };

  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = (currentIndex * carouselRef.current.clientWidth) / 3;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    console.log("useEffect triggered with slug:", slug);
    const getArticle = async () => {
      const accessToken = Cookies.get("access_token");
      if (slug && accessToken) {
        try {
          const response = await api.get("/items/articles", {
            params: {
              filter: {
                slug: {
                  _eq: slug,
                },
              },
              fields:
                "*,reviews.*,reviews.user_created.first_name,reviews.user_created.last_name,monday_open,monday_close,tuesday_open,tuesday_close,wednesday_open,wednesday_close,thursday_open,thursday_close,friday_open,friday_close,saturday_open,saturday_close,sunday_open,sunday_close",
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const articleData = response.data.data[0];
          console.log("Article Data:", articleData);

          if (articleData) {
            const adjustedArticleData: Article = {
              ...articleData,
              reviews: articleData.reviews ? [articleData.reviews] : [],
            };
            setArticle(adjustedArticleData);

            const servicesResponse = await api.get(
              `https://maoulaty.shop/items/articles/${articleData.id}?fields=service.Services_id.name,service.Services_id.sub_services.sub_services_id.name,service.Services_id.sub_services.sub_services_id.price,service.Services_id.sub_services.sub_services_id.duration,service.Services_id.sub_services.sub_services_id.description`
            );
            const servicesData = servicesResponse.data.data.service;

            const parentServices: { [key: string]: ParentService } = {};

            servicesData.forEach((service: { Services_id: { name: string, sub_services: { sub_services_id: SubService }[] } }) => {
              const serviceName = service.Services_id.name;
              if (!parentServices[serviceName]) {
                parentServices[serviceName] = {
                  name: serviceName,
                  description: "",
                  sub_services: [],
                };
              }
              service.Services_id.sub_services.forEach((subService) => {
                if (subService.sub_services_id) {
                  parentServices[serviceName].sub_services.push(subService.sub_services_id);
                }
              });
            });

            const formattedServices = Object.keys(parentServices).map((key, index) => ({
              id: String(index + 1),
              parent_service: parentServices[key],
            }));

            setServices(formattedServices);
          } else {
            setArticle(null);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching article:", error);
          setLoading(false);
        }
      }
    };
    getArticle();

    return () => {
      setArticle(null);
      setServices([]);
      setLoading(true);
    };
  }, [slug]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/users/me");
        setCurrentUser(response.data.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    const checkIfFavorited = async () => {
      if (article && currentUser) {
        try {
          const response = await api.get("/items/favorites", {
            params: {
              filter: {
                article: article.id,
                favorited: currentUser.id,
              },
            },
          });
          const favorites = response.data.data;
          if (favorites.length > 0) {
            setIsFavorited(true);
            setFavoriteId(favorites[0].id);
          }
        } catch (error) {
          console.error("Error checking if article is favorited:", error);
        }
      }
    };

    fetchCurrentUser();
    checkIfFavorited();
  }, [article, currentUser]);

  const handleFavorite = async (article: Article) => {
    if (!currentUser) return;

    setFavoriteLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        if (favoriteId) {
          await api.delete(`/items/favorites/${favoriteId}`);
          setIsFavorited(false);
          setFavoriteId(null);
        }
      } else {
        // Add to favorites
        const response = await api.post("/items/favorites", {
          favorited: currentUser.id,
          article: article.id,
          status: "published"
        });
        setIsFavorited(true);
        setFavoriteId(response.data.data.id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  console.log("Rendering with slug:", slug);

  if (loading) {
    return (
      <div className="flex justify-center items-center mx-auto">
        <div className="flex justify-center items-center">
          <>Loading...</>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center mx-auto">
        <div className="flex justify-center items-center">
          <>No article found</>
        </div>
      </div>
    );
  }

  const openingTimes: OpeningTime[] = [
    {
      day: "Monday",
      time: formatTime(article.monday_open ?? null) + " – " + formatTime(article.monday_close ?? null),
      open: !!article.monday_open && !!article.monday_close,
    },
    {
      day: "Tuesday",
      time: formatTime(article.tuesday_open ?? null) + " – " + formatTime(article.tuesday_close ?? null),
      open: !!article.tuesday_open && !!article.tuesday_close,
    },
    {
      day: "Wednesday",
      time: formatTime(article.wednesday_open ?? null) + " – " + formatTime(article.wednesday_close ?? null),
      open: !!article.wednesday_open && !!article.wednesday_close,
    },
    {
      day: "Thursday",
      time: formatTime(article.thursday_open ?? null) + " – " + formatTime(article.thursday_close ?? null),
      open: !!article.thursday_open && !!article.thursday_close,
      bold: true, // Example of setting bold to true
    },
    {
      day: "Friday",
      time: formatTime(article.friday_open ?? null) + " – " + formatTime(article.friday_close ?? null),
      open: !!article.friday_open && !!article.friday_close,
    },
    {
      day: "Saturday",
      time: formatTime(article.saturday_open ?? null) + " – " + formatTime(article.saturday_close ?? null),
      open: !!article.saturday_open && !!article.saturday_close,
    },
    {
      day: "Sunday",
      time: formatTime(article.sunday_open ?? null) + " – " + formatTime(article.sunday_close ?? null),
      open: !!article.sunday_open && !!article.sunday_close,
    },
  ];

  return (
    <div className="h-screen w-full bg-white" key={article.id}>
      <div className="">
        <BookingHeader />
      </div>
      <div className="px-5 lg:px-12 relative top-28">
        <div className="">
          <ol className="flex items-center whitespace-nowrap">
            <li className="inline-flex items-center">
              <Link
                className="flex items-center text-sm text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                href="#"
              >
                Home
              </Link>
              <svg
                className="shrink-0 mx-2 size-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </li>
            <li className="inline-flex items-center">
              <Link
                className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                href="#"
              >
                Hair Salons
                <svg
                  className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li
              className="inline-flex items-center text-sm font-semibold text-gray-500 truncate"
              aria-current="page"
            >
              {article.label}
            </li>
          </ol>
        </div>
        <header className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">{article.label}</h1>
            <div className="flex flex-col md:flex-row items-start md:items-center text-sm text-gray-600 mt-3">
              <span className="text-lg font-bold mr-1 text-black">5.0</span>
              <span className="flex items-center justify-center">
                <IoStar className="text-yellow-500" />
                <IoStar className="text-yellow-500" />
                <IoStar className="text-yellow-500" />
                <IoStar className="text-yellow-500" />
                <IoStar className="text-yellow-500" />
                <span className="ml-1 text-[#dd0067dc] font-semibold">
                  (5,113)
                </span>
              </span>
              <span className="hidden md:inline mx-2">•</span>
              <span>Open until {getCurrentOpeningTime(article)}</span>
              <span className="hidden md:inline mx-2">•</span>
              <span>{article.location}</span>
              <Link
                href={`https://www.google.com/maps?q=${article.Address}`}
                target="_blank"
                className="text-[#dd0067dc] ml-1 font-semibold"
              >
                Get directions
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => handleFavorite(article)}
              className="text-gray-800 border border-slate-200 h-12 w-12 flex justify-center items-center rounded-full"
              disabled={favoriteLoading}
            >
              {favoriteLoading ? (
                <OrbitProgress variant="disc" color="#d3d3d3" size="small" text="" textColor="" />
              ) : isFavorited ? (
                <GoHeartFill className="size-6 text-red-500" />
              ) : (
                <GoHeart className="size-6" />
              )}
            </button>
            <button className="text-gray-800 border border-slate-200 h-12 w-12 flex justify-center items-center rounded-full">
              <GoShareAndroid className="size-6" />
            </button>
          </div>
        </header>
        <div className="mt-8 mb-16">
          <div className="lg:flex gap-8">
            <div className="lg:w-1/12">
              <div className="grid grid-cols-1 gap-4">
                <img
                  src={`https://maoulaty.shop/assets/${article.featured_image}`}
                  alt="Another view of the salon interior"
                  className="w-full rounded-lg h-28 object-cover"
                />
                <img
                  src={`https://maoulaty.shop/assets/${article.featured_image}`}
                  alt="Exterior view of the salon building"
                  className="w-full rounded-lg h-28 object-cover"
                />
                <img
                  src={`https://maoulaty.shop/assets/${article.featured_image}`}
                  alt="Exterior view of the salon building"
                  className="w-full rounded-lg h-28 object-cover"
                />
                <button className="text-violet-500 text-sm font-semibold">
                  See all Images
                </button>
              </div>
            </div>
            <div className="lg:w-7/12">
              <div className="md:col-span-2">
                <img
                  src={`https://maoulaty.shop/assets/${article.featured_image}`}
                  alt={article.label}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
            <div className="lg:w-4/12">
              <div className="bg-white shadow-xl rounded-lg p-4 flex flex-col sticky top-0">
                <h1 className="text-4xl font-bold">{article.label}</h1>
                <div className="flex items-center mt-2">
                  <span className="text-lg font-bold">5.0</span>
                  <span className="ml-1 text-yellow-500 flex justify-center items-center relative -top-[1px]">
                    <IoStar />
                    <IoStar />
                    <IoStar />
                    <IoStar />
                    <IoStar />
                  </span>
                  <Link
                    href="#reviews"
                    className="ml-2 text-[#dd0067dc] font-semibold"
                  >
                    (5,113)
                  </Link>
                </div>
                <button
                  onClick={handleBooking}
                  className="mt-4 bg-black font-semibold text-white py-3.5 px-4 rounded-lg w-full"
                >
                  Book now
                </button>
                <div className="mt-6">
                  <div
                    className="flex items-center text-green-600 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <CiClock1 className="size-7 text-slate-600 -mr-0.5" />
                    <span className="ml-2">Open until {getCurrentOpeningTime(article)}</span>
                    <FaArrowDown
                      className={`fas fa-chevron-${
                        isOpen ? "up" : "down"
                      } ml-2`}
                    ></FaArrowDown>
                  </div>
                  {isOpen && (
                    <div className="mt-4">
                      {openingTimes.map((item, index) => (
                        <div key={index} className="flex items-center mt-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              item.open ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></span>
                          <span
                            className={`ml-2 ${item.bold ? "font-bold" : ""}`}
                          >
                            {item.day}
                          </span>
                          <span
                            className={`ml-auto ${
                              item.bold ? "font-bold" : ""
                            }`}
                          >
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-3.5 flex items-center">
                  <CiLocationOn className="text-gray-600 size-7" />
                  <span className="ml-2 text-gray-600">
                    {article.Address}
                    <br />
                    <Link
                      href={`https://www.google.com/maps?q=${article.Address}`}
                      target="_blank"
                      className="text-[#dd0067dc] ml-0 font-semibold"
                    >
                      Get directions
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Services Section */}
        <section className="mt-5">
          <div className="lg:flex">
            <div className="lg:w-8/12">
              <div>
                <h1 className="text-3xl font-bold mb-4">Services</h1>
                <Services services={services} />

                {/* Reviews Section */}
                <div className="mt-16" id="reviews">
                  <div className="lg:flex gap-10">
                    <div className="lg:w-12/12">
                      <h3 className="text-3xl font-bold mb-4">Reviews</h3>
                      <div className="relative">
                        <div className="">
                          {article.reviews && article.reviews.length > 0 ? (
                            <>
                              <div className="mt-4">
                                {article.reviews.map((review, index) => (
                                  <div
                                    key={index}
                                    className="max-w-md mx-auto space-y-4 mt-5"
                                  >
                                    <div className="flex items-center space-x-4">
                                      <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                          D
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-lg font-medium text-black">
                                          {review.user_created.first_name}{" "}
                                          {review.user_created.last_name}
                                        </div>
                                        <div className="text-gray-500">
                                          {review.date_created}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="flex space-x-1">
                                        <IoStar className="fas fa-star text-black" />
                                        <IoStar className="fas fa-star text-black" />
                                        <IoStar className="fas fa-star text-black" />
                                        <IoStar className="fas fa-star text-black" />
                                        <IoStar className="fas fa-star text-black" />
                                      </div>
                                    </div>
                                    <div className="text-gray-700">
                                      {review.comment}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <p>No reviews available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-24">
                  <h3 className="text-3xl font-bold mb-4">About</h3>
                  <p className="text-black font-medium">
                    {article.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {booking && (
        <div className="bg-white fixed left-0 top-0 w-full h-full z-50 p-2 overflow-auto">
          <div>
            <BookingSteps
              article={article}
              onClose={() => setBooking(false)}
              services={services}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBook;