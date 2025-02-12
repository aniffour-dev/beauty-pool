import React from "react";
import { Gruppo } from "next/font/google";
import Pic from "../../../../public/assets/register.webp";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

const Reviews = () => {
  const reviews = [
    {
      name: "John Doe",
      image: `https://maoulaty.shop/assets/7a6c834d-ec06-48eb-b3e9-87baae178c08?cache-buster=2024-12-21T19:28:22.000Z&key=system-large-contain`,
      review:
        "BeautyPool is amazing! Booking my appointments has never been this easy. Highly recommend it!",
      rating: 5,
    },
    {
      name: "Jane Smith",
      image: `https://maoulaty.shop/assets/7a6c834d-ec06-48eb-b3e9-87baae178c08?cache-buster=2024-12-21T19:28:22.000Z&key=system-large-contain`,
      review:
        "Great platform with excellent service providers. It saves so much time, and I always find top-rated salons.",
      rating: 4,
    },
    {
      name: "Michael Lee",
      image: `https://maoulaty.shop/assets/7a6c834d-ec06-48eb-b3e9-87baae178c08?cache-buster=2024-12-21T19:28:22.000Z&key=system-large-contain`,
      review:
        "A very user-friendly platform! It helped me discover hidden gems in my city. Absolutely love it!",
      rating: 5,
    },
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2
          className={`${gruppo.className} text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3`}
        >
          What Our Customers Say
        </h2>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
            >
              {/* Customer Image */}
              <img
                src={review.image}
                alt={review.name}
                className="w-16 h-16 rounded-full mb-4 object-cover"
              />
              {/* Customer Name */}
              <h3 className="text-lg font-semibold text-gray-800">
                {review.name}
              </h3>
              {/* Star Rating */}
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      i < review.rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.832 1.42 8.38L12 18.902l-7.42 4.733L6 15.255l-6-5.832 8.332-1.268z" />
                  </svg>
                ))}
              </div>
              {/* Review Text */}
              <p className="text-gray-600 mt-4 text-sm sm:text-base text-center">
                &ldquo;{review.review}&ldquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
