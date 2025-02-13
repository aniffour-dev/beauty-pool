// "use client";
// import React, { useState, useEffect } from "react";
// import { gsap } from "gsap";
// import { BsArrowLeft, BsCheck, BsPlus } from "react-icons/bs";
// import { GoChevronRight } from "react-icons/go";
// import { Elements } from "@stripe/react-stripe-js";
// import PaymentForm from "@/components/dynamic/Book/Forms/PaymentForm";
// import { loadStripe } from "@stripe/stripe-js";
// import Image from "next/image";
// import Visa from "../../../../../public/assets/payments/visa.svg";
// import Mastercard from "../../../../../public/assets/payments/mastercard.svg";
// import Discover from "../../../../../public/assets/payments/discover.svg";
// import AmericanExpress from "../../../../../public/assets/payments/american-express.svg";
// import { IoStar } from "react-icons/io5";
// import { PiSealWarning } from "react-icons/pi";
// import api from "@/services/auth";

// interface Review {
//   date_created: string;
//   rating: number;
//   comment: string;
//   article: number;
// }

// interface Article {
//   id: string;
//   label: string;
//   description: string;
//   reviews: Review[];
//   featured_image: string;
//   location: string;
//   monday_open?: string;
//   monday_close?: string;
//   tuesday_open?: string;
//   tuesday_close?: string;
//   wednesday_open?: string;
//   wednesday_close?: string;
//   thursday_open?: string;
//   thursday_close?: string;
//   friday_open?: string;
//   friday_close?: string;
//   saturday_open?: string;
//   saturday_close?: string;
//   sunday_open?: string;
//   sunday_close?: string;
// }

// interface SubService {
//   id: string; // Add the id property
//   name: string;
//   description: string;
//   price: string;
//   duration: string;
// }

// interface ParentService {
//   name: string;
//   description: string;
//   sub_services: SubService[];
// }

// interface Service {
//   id: string;
//   parent_service: ParentService;
// }

// interface BookingStepsProps {
//   article: Article;
//   services: Service[];
//   onClose: () => void;
// }

// const stripePromise = loadStripe(
//   "pk_test_51PqnMzCMCpxFz40MVwOUjcuR9TIEwHGKXk7G9SLptwqTq6RaC2EhUDa4QICmWgG6aPqihsjszOmHLq7F5MjwzoSC00HCbYjVe9"
// );

// const BookingSteps: React.FC<BookingStepsProps> = ({
//   article,
//   services,
//   onClose,
// }: BookingStepsProps) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedServices, setSelectedServices] = useState<SubService[]>([]);
//   const [savedServices, setSavedServices] = useState<SubService[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDay, setSelectedDay] = useState<string | null>(null);
//   const [availableTimes, setAvailableTimes] = useState<string[]>([]);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null); // Add state for selected date
//   const [paymentSuccess, setPaymentSuccess] = useState(false); // Add state for payment success

//   useEffect(() => {
//     if (paymentSuccess) {
//       setCurrentStep(4);
//     }
//   }, [paymentSuccess]);

//   useEffect(() => {
//     gsap.fromTo(
//       ".service-card",
//       { opacity: 0, y: 20 },
//       { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
//     );
//   }, []);

//   useEffect(() => {
//     if (currentStep === 3) {
//       const timer = setTimeout(() => {
//         setIsModalOpen(true);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [currentStep]);

//   useEffect(() => {
//     if (selectedDay && selectedServices.length > 0) {
//       fetchAvailableTimes(selectedDay);
//     }
//   }, [selectedDay, selectedServices]);

//   const fetchAvailableTimes = async (day: string) => {
//     const openTimeKey = `${day.toLowerCase()}_open` as keyof Article;
//     const closeTimeKey = `${day.toLowerCase()}_close` as keyof Article;

//     const openTime = article[openTimeKey];
//     const closeTime = article[closeTimeKey];

//     // Check if both open and close times exist and are not null
//     if (openTime && closeTime) {
//       const timeSlots = generateTimeSlots(
//         openTime as string,
//         closeTime as string
//       );
//       setAvailableTimes(timeSlots);
//     } else {
//       console.log(`No open or close time for ${day}`);
//       setAvailableTimes([]);
//     }
//   };

//   useEffect(() => {
//     // Set Monday as the default selected day when component mounts
//     setSelectedDay("Monday");

//     // Fetch available times for Monday automatically
//     if (article) {
//       fetchAvailableTimes("Monday");
//     }
//   }, [article]);

//   const generateTimeSlots = (openTime: string, closeTime: string): string[] => {
//     // Remove seconds from the time strings if present
//     const cleanOpenTime = openTime.slice(0, 5);
//     const cleanCloseTime = closeTime.slice(0, 5);

//     const startTime = new Date(`1970-01-01T${cleanOpenTime}:00`);
//     const endTime = new Date(`1970-01-01T${cleanCloseTime}:00`);
//     const timeSlots: string[] = [];
//     let currentTime = new Date(startTime);

//     while (currentTime <= endTime) {
//       // Format time in HH:MM with leading zeros
//       const timeString = currentTime.toTimeString().slice(0, 5);
//       timeSlots.push(timeString);

//       // Increment by 1 hour
//       currentTime.setHours(currentTime.getHours() + 1);
//     }

//     return timeSlots;
//   };

//   const handleServiceClick = (subService: SubService) => {
//     if (selectedServices.some((s) => s.name === subService.name)) {
//       setSelectedServices(
//         selectedServices.filter((s) => s.name !== subService.name)
//       );
//     } else {
//       setSelectedServices([...selectedServices, subService]);
//     }
//   };

//   const handleContinue = () => {
//     if (selectedServices.length > 0 && selectedTime) {
//       setSavedServices(selectedServices);
//       setCurrentStep(3);
//     }
//   };

//   const renderServices = () => {
//     return services.map((service, index) => (
//       <div key={index} className="mb-4">
//         <h3 className="font-bold mb-2">{service.parent_service.name}</h3>
//         {service.parent_service.sub_services.map((subService, index) => (
//           <div
//             key={index} // Ensure this is unique
//             className="service-card p-4 border rounded-lg flex justify-between items-center mb-2"
//           >
//             <div className="flex justify-start items-center gap-5">
//               <div>
//                 <p className="mask mask-squircle font-bold text-md h-14 w-14 bg-red-100 text-red-700 flex justify-center items-center">
//                   €{subService.price}
//                 </p>
//               </div>
//               <div>
//                 <h3 className="font-bold mb-1">{subService.name}</h3>
//                 <p className="text-[13px] mb-1 text-gray-500">
//                   {subService.duration}min
//                 </p>
//                 {subService.description && (
//                   <p className="text-sm text-gray-500">
//                     {subService.description}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <button
//               className="text-2xl text-gray-500"
//               onClick={() => handleServiceClick(subService)}
//             >
//               {selectedServices.some((s) => s.name === subService.name) ? (
//                 <BsCheck className="text-green-500 size-8" />
//               ) : (
//                 <BsPlus className="text-slate-600 size-8" />
//               )}
//             </button>
//           </div>
//         ))}
//       </div>
//     ));
//   };

//   const renderSelectedServices = () => {
//     return selectedServices.map((subService, index) => (
//       <div key={index} className="pb-4 border-b mb-4">
//         <h3 className="font-bold">{subService.name}</h3>
//         <p className="text-sm text-gray-500">{subService.duration}</p>
//         {subService.description && (
//           <p className="text-sm text-gray-500">{subService.description}</p>
//         )}
//         <p className="font-bold">€{subService.price}</p>
//       </div>
//     ));
//   };

//   const calculateTotal = () => {
//     return selectedServices.reduce(
//       (total, subService) =>
//         total + parseFloat(String(subService.price).replace("€", "")),
//       0
//     );
//   };

//   const calculateDiscountedTotal = () => {
//     const total = calculateTotal();
//     return total * 0.2;
//   };

//   const calculateSelectedDate = (day: string, time: string) => {
//     const today = new Date();
//     const daysOfWeek = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     const selectedDayIndex = daysOfWeek.indexOf(day);
//     const currentDayIndex = today.getDay();

//     let daysDifference = selectedDayIndex - currentDayIndex;
//     if (daysDifference <= 0) {
//       daysDifference += 7;
//     }

//     const selectedDate = new Date(today);
//     selectedDate.setDate(today.getDate() + daysDifference);
//     selectedDate.setHours(
//       parseInt(time.split(":")[0]),
//       parseInt(time.split(":")[1]),
//       0,
//       0
//     );

//     return selectedDate.toISOString().split("T")[0];
//   };

//   // Render different steps
//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="flex flex-col lg:flex-row p-4 lg:p-8 pt-10 max-w-7xl mx-auto">
//             <div className="flex-1">
//               <div className="flex items-center mb-4">
//                 <BsArrowLeft
//                   className="size-7 text-black cursor-pointer"
//                   onClick={onClose}
//                 />
//               </div>
//               <div className="text-sm text-gray-500 mb-2">
//                 <span className="mr-1.5 font-semibold text-black">
//                   Services
//                 </span>
//                 <GoChevronRight className="inline" />
//                 <span className="ml-1.5 mr-1.5">Time</span>
//                 <GoChevronRight className="inline" />
//                 <span className="ml-1.5 text-sm text-gray-500 mb-2">
//                   Payments
//                 </span>
//                 <GoChevronRight className="inline" />
//                 <span className="ml-1.5 mr-1.5">Confirmation</span>
//               </div>
//               <h1 className="text-3xl font-bold mb-7 mt-4">Select services</h1>
//               <div className="space-y-4">{renderServices()}</div>
//             </div>
//             <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
//               <div className="border rounded-lg p-4">
//                 <div className="flex items-center mb-4">
//                   <img
//                     src={`https://maoulaty.shop/assets/${article.featured_image}`}
//                     alt={article.label}
//                     className="w-12 h-12 rounded-full mr-4"
//                   />
//                   <div>
//                     <h3 className="font-bold">{article.label}</h3>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <span className="mr-1">4.9</span>
//                       <div className="flex ml-2 text-yellow-500">
//                         <IoStar />
//                         <IoStar />
//                         <IoStar />
//                         <IoStar />
//                         <IoStar />
//                       </div>
//                       <span className="ml-1">(4,749)</span>
//                     </div>
//                     <p className="text-sm text-gray-500">{article.location}</p>
//                   </div>
//                 </div>
//                 {selectedServices.length > 0 ? (
//                   <div>{renderSelectedServices()}</div>
//                 ) : (
//                   <p className="text-sm text-gray-500 mb-4">
//                     No services selected
//                   </p>
//                 )}
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="font-bold">Total</span>
//                   <span className="font-bold text-green-500">
//                     €{calculateTotal()}
//                   </span>
//                 </div>
//                 <button
//                   className="w-full py-2.5 font-semibold bg-black text-white rounded-lg"
//                   disabled={selectedServices.length === 0}
//                   onClick={() => setCurrentStep(2)}
//                 >
//                   Continue
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <>
//             <div className="flex flex-col lg:flex-row p-4 lg:p-8 pt-10 max-w-7xl mx-auto">
//               <div className="flex-1">
//                 <div className="flex items-center mb-4">
//                   <BsArrowLeft
//                     className="size-7 text-black cursor-pointer"
//                     onClick={() => setCurrentStep(1)}
//                   />
//                 </div>
//                 <div className="text-sm text-gray-500 mb-2">
//                   <span className="mr-1.5">Services</span>
//                   <GoChevronRight className="inline" />
//                   <span className="ml-1.5 mr-1.5 font-semibold text-black">
//                     Time
//                   </span>
//                   <GoChevronRight className="inline" />
//                   <span className="ml-1.5 text-sm text-gray-500 mb-2">
//                     Payments
//                   </span>
//                   <GoChevronRight className="inline" />
//                   <span className="ml-1.5 mr-1.5">Confirmation</span>
//                 </div>
//                 <h1 className="text-3xl font-bold mb-7 mt-20">Select Time</h1>
//                 <div className="flex flex-wrap mb-4">
//                   {[
//                     "Monday",
//                     "Tuesday",
//                     "Wednesday",
//                     "Thursday",
//                     "Friday",
//                     "Saturday",
//                     "Sunday",
//                   ].map((day, index) => (
//                     <div
//                       key={index}
//                       className={`cursor-pointer py-1.5 px-3.5 m-1 rounded-full font-semibold ${
//                         selectedDay === day
//                           ? "bg-[#ffe1dc] text-[#f47c66]"
//                           : "bg-gray-100"
//                       }`}
//                       onClick={() => {
//                         setSelectedDay(day);
//                         fetchAvailableTimes(day);
//                       }}
//                     >
//                       {day}
//                     </div>
//                   ))}
//                 </div>
//                 {selectedDay && (
//                   <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
//                     {availableTimes.length > 0 ? (
//                       availableTimes.map((timeSlot, index) => (
//                         <button
//                           key={index}
//                           className={`py-4 border-2 border-slate-200 px-4 rounded w-full ${
//                             selectedTime === timeSlot
//                               ? "bg-slate-50 border-[#fe9f8e] text-lg font-semibold"
//                               : ""
//                           }`}
//                           onClick={() => {
//                             setSelectedTime(timeSlot);
//                             setSelectedDate(
//                               calculateSelectedDate(selectedDay!, timeSlot)
//                             ); // Set the selected date
//                           }}
//                         >
//                           {timeSlot}
//                         </button>
//                       ))
//                     ) : (
//                       <p>No available times for {selectedDay}</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
//                 <div className="border rounded-lg p-4">
//                   <div className="flex items-center mb-4">
//                     <img
//                       src={`https://maoulaty.shop/assets/${article.featured_image}`}
//                       alt={article.label}
//                       className="w-12 h-12 rounded-full mr-4"
//                     />
//                     <div>
//                       <h3 className="font-bold">{article.label}</h3>
//                       <div className="flex items-center text-sm text-gray-500">
//                         <span className="mr-1">4.9</span>
//                         <div className="flex ml-2 text-yellow-500">
//                           <IoStar />
//                           <IoStar />
//                           <IoStar />
//                           <IoStar />
//                           <IoStar />
//                         </div>
//                         <span className="ml-1">(4,749)</span>
//                       </div>
//                       <p className="text-sm text-gray-500">
//                         {article.location}
//                       </p>
//                     </div>
//                   </div>
//                   {savedServices.map((subService, index) => (
//                     <div
//                       key={index}
//                       className="flex justify-between items-center space-y-2"
//                     >
//                       <p>{subService.name}</p>{" "}
//                       <p className="font-bold">€{subService.price}</p>
//                     </div>
//                   ))}
//                   <div className="mb-4 mt-5 border-t border-slate-300 pt-5">
//                     <div className="h-48">
//                       <div className="flex justify-between items-center">
//                         <span className="font-bold">Total</span>
//                         <span className="font-bold text-green-500">
//                           €{calculateTotal()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     className="w-full py-2.5 font-semibold bg-black text-white rounded-lg"
//                     disabled={selectedServices.length === 0 || !selectedTime}
//                     onClick={handleContinue}
//                   >
//                     Continue
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         );
//       case 3:
//         return (
//           <div className="flex flex-col lg:flex-row p-4 lg:p-8 pt-10 max-w-7xl mx-auto">
//             <div className="flex-1">
//               <div className="flex items-center mb-4">
//                 <BsArrowLeft
//                   className="size-7 text-black cursor-pointer"
//                   onClick={() => setCurrentStep(2)}
//                 />
//               </div>
//               <div className="text-sm text-gray-500 mb-2">
//                 <span className="mr-1.5">Services</span>
//                 <GoChevronRight className="inline" />
//                 <span className="ml-1.5 mr-1.5">Time</span>
//                 <GoChevronRight className="inline" />
//                 <span className="font-semibold text-black ml-1.5">
//                   Payments
//                 </span>
//                 <GoChevronRight className="inline" />
//                 <span className="ml-1.5 mr-1.5">Confirmation</span>
//               </div>
//               <h2 className="text-3xl text-black mb-1 mt-8 font-bold">
//                 Payment method
//               </h2>
//               <p className="mb-3 text-sm">
//                 You won&apos;t be charged now, payment will be collected in
//                 store after your appointment
//               </p>
//               <div className="mt-16">
//                 <Elements stripe={stripePromise}>
//                   <PaymentForm
//                     calculateTotal={calculateDiscountedTotal}
//                     articleId={article.id}
//                     selectedServices={selectedServices.map((service) => ({
//                       id: service.id,
//                       price: service.price,
//                     }))}
//                     time={selectedTime!}
//                     date={selectedDate!}
//                     setPaymentSuccess={setPaymentSuccess}
//                   />
//                 </Elements>
//                 <div className="flex justify-start items-center gap-2 mt-5 mb">
//                   <div className="text-sm">Pay securely with:</div>
//                   <div className="flex justify-start items-center gap-1.5">
//                     <div>
//                       <Image src={Visa} alt="Visa" width={30} height={20} />
//                     </div>
//                     <div>
//                       <Image
//                         src={Mastercard}
//                         alt="Mastercard"
//                         width={30}
//                         height={20}
//                       />
//                     </div>
//                     <div>
//                       <Image
//                         src={Discover}
//                         alt="Discover"
//                         width={30}
//                         height={20}
//                       />
//                     </div>
//                     <div>
//                       <Image
//                         src={AmericanExpress}
//                         alt="American Express"
//                         width={30}
//                         height={20}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mb-8 mt-10">
//                   <h4 className="text-lg text-black font-semibold mb-1">
//                     Cancellation Policy:
//                   </h4>
//                   <p className="text-slate-700 font-medium text-sm max-w-[700px]">
//                     Cancel for free up to 24 hours before your appointment.
//                     Cancellations made less than 24 hours in advance will incur
//                     a fee of 30% of the service price. No-shows will be charged
//                     50% of the service price.
//                   </p>
//                 </div>
//                 <div className="mb-8">
//                   <h4 className="text-lg text-black font-semibold mb-1">
//                     Important Information
//                   </h4>
//                   <p className="text-slate-700 font-medium text-sm max-w-[700px]">
//                     Please ensure you are aware of the service you&apos;re
//                     booking to help with accurate timing. If you have any
//                     questions, feel free to contact David, David, or myself.
//                   </p>
//                   <p className="text-slate-700 font-medium text-sm max-w-[700px]">
//                     We understand that cancellations may occur, but we kindly
//                     ask that you provide us with as much notice as possible.
//                     Thank you.
//                   </p>
//                 </div>

//                 <div className="mb-8">
//                   <h4 className="text-lg text-black font-semibold mb-2">
//                     Booking notes
//                   </h4>
//                   <textarea
//                     className="w-full h-36 max-h-36 min-h-36 p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f657a175]"
//                     placeholder="Include comments or requests about your booking"
//                   ></textarea>
//                 </div>
//               </div>
//             </div>
//             <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
//               <div className="border rounded-lg p-4 sticky top-0">
//                 <div className="flex items-center mb-4">
//                   <img
//                     src={`https://maoulaty.shop/assets/${article.featured_image}`}
//                     alt={article.label}
//                     className="w-12 h-12 rounded-full mr-4"
//                   />
//                   <div>
//                     <h3 className="font-bold">{article.label}</h3>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <span className="mr-1">4.9</span>
//                       <div className="flex ml-2 text-yellow-500">
//                         <IoStar />
//                         <IoStar />
//                         <IoStar />
//                         <IoStar />
//                         <IoStar />
//                       </div>
//                       <span className="ml-1">(4,749)</span>
//                     </div>
//                     <p className="text-sm text-gray-500">{article.location}</p>
//                   </div>
//                 </div>
//                 {savedServices.map((subService, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center space-y-2"
//                   >
//                     <p>{subService.name}</p>{" "}
//                     <p className="font-bold">€{subService.price}</p>
//                   </div>
//                 ))}
//                 <div className="mb-4 mt-5 border-t border-slate-300 pt-5">
//                   <div className="h-26">
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold">Total</span>
//                       <div>
//                         <span className="line-through text-gray-500">
//                           €{calculateTotal()}
//                         </span>
//                         <span className="font-bold text-green-500 ml-2">
//                           €{calculateDiscountedTotal()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       case 4:
//         return (
//           <div className="flex flex-col lg:flex-row p-4 lg:p-8 pt-10 max-w-7xl mx-auto">
//             <div className="flex-1">
//               <div className="text-sm text-gray-500 mb-2">
//                 <span className="mr-1.5">Services</span>
//                 <GoChevronRight className="inline" />
//                 <span className="ml-1.5 mr-1.5">Time</span>
//                 <GoChevronRight className="inline" />
//                 <span className="ml-1.5">Payment</span>
//                 <GoChevronRight className="inline" />
//                 <span className="ml-1.5 font-semibold text-black">
//                   Confirmation
//                 </span>
//               </div>
//               <div className="mt-8 text-center">
//                 <div className="mb-4">
//                   <BsCheck className="mx-auto text-green-500 size-16" />
//                 </div>
//                 <h2 className="text-3xl text-black mb-4 font-bold">
//                   Booking Confirmed!
//                 </h2>
//                 <p className="text-gray-600 mb-6">
//                   Thank you for your booking. We've sent a confirmation email
//                   with all the details.
//                 </p>
//                 <div className="border rounded-lg p-6 max-w-md mx-auto text-left">
//                   <h3 className="font-bold mb-4">Booking Details</h3>
//                   <p className="mb-2">
//                     <span className="font-semibold">Date:</span> {selectedDate}
//                   </p>
//                   <p className="mb-2">
//                     <span className="font-semibold">Time:</span> {selectedTime}
//                   </p>
//                   <p className="mb-4">
//                     <span className="font-semibold">Location:</span>{" "}
//                     {article.location}
//                   </p>
//                   <div className="border-t pt-4">
//                     <p className="font-semibold">Services:</p>
//                     {savedServices.map((service, index) => (
//                       <div key={index} className="flex justify-between mt-2">
//                         <span>{service.name}</span>
//                         <span>€{service.price}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className="mt-8 py-2.5 px-6 bg-black text-white rounded-lg font-semibold"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       {renderStep()}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3">
//           <div className="max-w-2xl mx-auto">
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <div className="flex justify-start items-center gap-1">
//                 <PiSealWarning className="inline size-7 text-red-700 relative -top-[11px]" />
//                 <h3 className="text-xl md:text-2xl text-slate-900 font-semibold mb-6">
//                   Booking and Payment Policy
//                 </h3>
//               </div>
//               <p className="text-md text-slate-700 font-normal mb-3">
//                 To secure your appointment, we require a 20% deposit of the
//                 total service cost at the time of booking. This deposit is
//                 non-refundable and ensures that your appointment is reserved
//                 just for you.
//               </p>
//               <p className="text-md text-slate-700 font-normal mb-5">
//                 The remaining 80% of the payment will be due at the time of your
//                 visit to the salon. This allows us to provide you with a
//                 seamless and convenient booking experience.
//               </p>
//               <p className="text-slate-900 text-sm font-semibold">
//                 Thank you for your trust in BEAUTYPOOL.
//               </p>
//               <div className="flex justify-center items-center mt-10">
//                 <button
//                   className="py-1.5 px-3 bg-black text-white rounded font-semibold text-sm"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   I understand
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingSteps;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BsArrowLeft, BsCheck, BsPlus } from "react-icons/bs";
import { GoChevronRight } from "react-icons/go";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/dynamic/Book/Forms/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import Visa from "../../../../../public/assets/payments/visa.svg";
import Mastercard from "../../../../../public/assets/payments/mastercard.svg";
import Discover from "../../../../../public/assets/payments/discover.svg";
import AmericanExpress from "../../../../../public/assets/payments/american-express.svg";
import { IoStar } from "react-icons/io5";
import { PiSealWarning } from "react-icons/pi";
import api from "@/services/auth";

interface Review {
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
}

interface SubService {
  id: string; // Add the id property
  name: string;
  description: string;
  price: string;
  duration: string;
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

interface BookingStepsProps {
  article: Article;
  services: Service[];
  onClose: () => void;
}

const stripePromise = loadStripe(
  "pk_test_51QBbcOAufKKBd4a0cutDWMMz2eIFkrhBPi2R8MwEhs0gYxv1sxMGt576gvQsiXJ6yrXNWpZ0ofzsoM8zJrKRDns500oRFyMmBb"
);

const generateTimeSlots = (openTime: string, closeTime: string): string[] => {
  // Remove seconds from the time strings if present
  const cleanOpenTime = openTime.slice(0, 5);
  const cleanCloseTime = closeTime.slice(0, 5);

  const startTime = new Date(`1970-01-01T${cleanOpenTime}:00`);
  const endTime = new Date(`1970-01-01T${cleanCloseTime}:00`);
  const timeSlots: string[] = [];
  let currentTime = new Date(startTime);

  while (currentTime <= endTime) {
    // Format time in HH:MM with leading zeros
    const timeString = currentTime.toTimeString().slice(0, 5);
    timeSlots.push(timeString);

    // Increment by 1 hour
    currentTime.setHours(currentTime.getHours() + 1);
  }

  return timeSlots;
};

const generateMonthlyTimeSlots = (article: Article, year: number, month: number): { [key: string]: string[] } => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const timeSlots: { [key: string]: string[] } = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const openTimeKey = `${dayOfWeek}_open` as keyof Article;
    const closeTimeKey = `${dayOfWeek}_close` as keyof Article;

    const openTime = article[openTimeKey];
    const closeTime = article[closeTimeKey];

    if (openTime && closeTime) {
      timeSlots[date.toISOString().split('T')[0]] = generateTimeSlots(openTime as string, closeTime as string);
    }
  }

  return timeSlots;
};

const BookingSteps: React.FC<BookingStepsProps> = ({
  article,
  services,
  onClose,
}: BookingStepsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<SubService[]>([]);
  const [savedServices, setSavedServices] = useState<SubService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Add state for selected date
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Add state for payment success
  const [monthlyTimeSlots, setMonthlyTimeSlots] = useState<{ [key: string]: string[] }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paymentSuccess) {
      setCurrentStep(4);
    }
  }, [paymentSuccess]);

  useEffect(() => {
    gsap.fromTo(
      ".service-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    );
  }, []);

  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    const timeSlots = generateMonthlyTimeSlots(article, currentMonth.getFullYear(), currentMonth.getMonth());
    setMonthlyTimeSlots(timeSlots);
  }, [article, currentMonth]);

  useEffect(() => {
    if (selectedDay) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay);
      const dateKey = date.toISOString().split('T')[0];
      setSelectedDate(dateKey);
      setAvailableTimes(monthlyTimeSlots[dateKey] || []);
      if (calendarRef.current) {
        calendarRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedDay, monthlyTimeSlots, currentMonth]);

  const handleServiceClick = (subService: SubService) => {
    if (selectedServices.some((s) => s.name === subService.name)) {
      setSelectedServices(
        selectedServices.filter((s) => s.name !== subService.name)
      );
    } else {
      setSelectedServices([...selectedServices, subService]);
    }
  };

  const handleContinue = () => {
    if (selectedServices.length > 0 && selectedTime) {
      setSavedServices(selectedServices);
      setCurrentStep(3);
    }
  };

  const renderServices = () => {
    return services.map((service, index) => (
      <div key={index} className="mb-4">
        <h3 className="font-bold mb-2">{service.parent_service.name}</h3>
        {service.parent_service.sub_services.map((subService, index) => (
          <div
            key={index}
            className="service-card p-4 border rounded-lg flex justify-between items-center mb-2"
          >
            <div className="flex justify-start items-center gap-5">
              <div>
                <p className="mask mask-squircle font-bold text-md h-14 w-14 bg-red-100 text-red-700 flex justify-center items-center">
                  €{subService.price}
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">{subService.name}</h3>
                <p className="text-[13px] mb-1 text-gray-500">
                  {subService.duration}min
                </p>
                {subService.description && (
                  <p className="text-sm text-gray-500">
                    {subService.description}
                  </p>
                )}
              </div>
            </div>
            <button
              className="text-2xl text-gray-500"
              onClick={() => handleServiceClick(subService)}
            >
              {selectedServices.some((s) => s.name === subService.name) ? (
                <BsCheck className="text-green-500 size-8" />
              ) : (
                <BsPlus className="text-slate-600 size-8" />
              )}
            </button>
          </div>
        ))}
      </div>
    ));
  };

  const renderSelectedServices = () => {
    return selectedServices.map((subService, index) => (
      <div key={index} className="pb-4 border-b mb-4">
        <h3 className="font-bold">{subService.name}</h3>
        <p className="text-sm text-gray-500">{subService.duration}</p>
        {subService.description && (
          <p className="text-sm text-gray-500">{subService.description}</p>
        )}
        <p className="font-bold">€{subService.price}</p>
      </div>
    ));
  };

  const calculateTotal = () => {
    return selectedServices.reduce(
      (total, subService) =>
        total + parseFloat(String(subService.price).replace("€", "")),
      0
    );
  };

  const calculateDiscountedTotal = () => {
    const total = calculateTotal();
    return total * 0.2;
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    return (
      <div className="flex flex-col items-center overflow-x-auto overflow-y-auto" ref={calendarRef}>
        <h2 className="font-bold text-xl mb-2">
          {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className={`h-14 w-14 flex justify-center items-center m-1 rounded-full font-semibold cursor-pointer ${
                selectedDay === day
                  ? "bg-[#ffe1dc] text-[#f47c66]"
                  : "bg-gray-100"
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col lg:flex-row p-4 lg:p-8 pt-10 max-w-7xl mx-auto">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <BsArrowLeft
                  className="size-7 text-black cursor-pointer"
                  onClick={onClose}
                />
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <span className="mr-1.5 font-semibold text-black">
                  Services
                </span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 mr-1.5">Time</span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 text-sm text-gray-500 mb-2">
                  Payments
                </span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 mr-1.5">Confirmation</span>
              </div>
              <h1 className="text-3xl font-bold mb-7 mt-4">Select services</h1>
              <div className="space-y-4">{renderServices()}</div>
            </div>
            <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <img
                    src={`https://maoulaty.shop/assets/${article.featured_image}`}
                    alt={article.label}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">{article.label}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">4.9</span>
                      <div className="flex ml-2 text-yellow-500">
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                      </div>
                      <span className="ml-1">(4,749)</span>
                    </div>
                    <p className="text-sm text-gray-500">{article.location}</p>
                  </div>
                </div>
                {selectedServices.length > 0 ? (
                  <div>{renderSelectedServices()}</div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">
                    No services selected
                  </p>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-500">
                    €{calculateTotal()}
                  </span>
                </div>
                <button
                  className="w-full py-2.5 font-semibold bg-black text-white rounded-lg"
                  disabled={selectedServices.length === 0}
                  onClick={() => setCurrentStep(2)}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <div className="flex flex-col lg:flex-row p-4 lg:p-8 pt-10 max-w-7xl mx-auto">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <BsArrowLeft
                    className="size-7 text-black cursor-pointer"
                    onClick={() => setCurrentStep(1)}
                  />
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  <span className="mr-1.5">Services</span>
                  <GoChevronRight className="inline" />
                  <span className="ml-1.5 mr-1.5 font-semibold text-black">
                    Time
                  </span>
                  <GoChevronRight className="inline" />
                  <span className="ml-1.5 text-sm text-gray-500 mb-2">
                    Payments
                  </span>
                  <GoChevronRight className="inline" />
                  <span className="ml-1.5 mr-1.5">Confirmation</span>
                </div>
                <h1 className="text-3xl font-bold mb-7 mt-20">Select Time</h1>
                <div className="mb-4">
                  {renderCalendar()}
                </div>
                {selectedDay && (
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
                    {availableTimes.length > 0 ? (
                      availableTimes.map((timeSlot, index) => (
                        <button
                          key={index}
                          className={`py-4 border-2 border-slate-200 px-4 rounded w-full ${
                            selectedTime === timeSlot
                              ? "bg-slate-50 border-[#fe9f8e] text-lg font-semibold"
                              : ""
                          }`}
                          onClick={() => setSelectedTime(timeSlot)}
                        >
                          {timeSlot}
                        </button>
                      ))
                    ) : (
                      <p>No available times for {selectedDay}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <img
                      src={`https://maoulaty.shop/assets/${article.featured_image}`}
                      alt={article.label}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold">{article.label}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1">4.9</span>
                        <div className="flex ml-2 text-yellow-500">
                          <IoStar />
                          <IoStar />
                          <IoStar />
                          <IoStar />
                          <IoStar />
                        </div>
                        <span className="ml-1">(4,749)</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {article.location}
                      </p>
                    </div>
                  </div>
                  {savedServices.map((subService, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center space-y-2"
                    >
                      <p>{subService.name}</p>{" "}
                      <p className="font-bold">€{subService.price}</p>
                    </div>
                  ))}
                  <div className="mb-4 mt-5 border-t border-slate-300 pt-5">
                    <div className="h-48">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-green-500">
                          €{calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full py-2.5 font-semibold bg-black text-white rounded-lg"
                    disabled={selectedServices.length === 0 || !selectedTime}
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <div className="flex flex-col lg:flex-row p-4 lg:p-8 pt-10 max-w-7xl mx-auto">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <BsArrowLeft
                  className="size-7 text-black cursor-pointer"
                  onClick={() => setCurrentStep(2)}
                />
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <span className="mr-1.5">Services</span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 mr-1.5">Time</span>
                <GoChevronRight className="inline" />
                <span className="font-semibold text-black ml-1.5">
                  Payments
                </span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 mr-1.5">Confirmation</span>
              </div>
              <h2 className="text-3xl text-black mb-1 mt-8 font-bold">
                Payment method
              </h2>
              <p className="mb-3 text-sm">
                You won&apos;t be charged now, payment will be collected in
                store after your appointment
              </p>
              <div className="mt-16">
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    calculateTotal={calculateDiscountedTotal}
                    articleId={article.id}
                    selectedServices={selectedServices.map((service) => ({
                      id: service.id,
                      price: service.price,
                    }))}
                    time={selectedTime!}
                    date={selectedDate!}
                    setPaymentSuccess={setPaymentSuccess}
                  />
                </Elements>
                <div className="flex justify-start items-center gap-2 mt-5 mb">
                  <div className="text-sm">Pay securely with:</div>
                  <div className="flex justify-start items-center gap-1.5">
                    <div>
                      <Image src={Visa} alt="Visa" width={30} height={20} />
                    </div>
                    <div>
                      <Image
                        src={Mastercard}
                        alt="Mastercard"
                        width={30}
                        height={20}
                      />
                    </div>
                    <div>
                      <Image
                        src={Discover}
                        alt="Discover"
                        width={30}
                        height={20}
                      />
                    </div>
                    <div>
                      <Image
                        src={AmericanExpress}
                        alt="American Express"
                        width={30}
                        height={20}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-8 mt-10">
                  <h4 className="text-lg text-black font-semibold mb-1">
                    Cancellation Policy:
                  </h4>
                  <p className="text-slate-700 font-medium text-sm max-w-[700px]">
                    Cancel for free up to 24 hours before your appointment.
                    Cancellations made less than 24 hours in advance will incur
                    a fee of 30% of the service price. No-shows will be charged
                    50% of the service price.
                  </p>
                </div>
                <div className="mb-8">
                  <h4 className="text-lg text-black font-semibold mb-1">
                    Important Information
                  </h4>
                  <p className="text-slate-700 font-medium text-sm max-w-[700px]">
                    Please ensure you are aware of the service you&apos;re
                    booking to help with accurate timing. If you have any
                    questions, feel free to contact David, David, or myself.
                  </p>
                  <p className="text-slate-700 font-medium text-sm max-w-[700px]">
                    We understand that cancellations may occur, but we kindly
                    ask that you provide us with as much notice as possible.
                    Thank you.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg text-black font-semibold mb-2">
                    Booking notes
                  </h4>
                  <textarea
                    className="w-full h-36 max-h-36 min-h-36 p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f657a175]"
                    placeholder="Include comments or requests about your booking"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
              <div className="border rounded-lg p-4 sticky top-0">
                <div className="flex items-center mb-4">
                  <img
                    src={`https://maoulaty.shop/assets/${article.featured_image}`}
                    alt={article.label}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">{article.label}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">4.9</span>
                      <div className="flex ml-2 text-yellow-500">
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                      </div>
                      <span className="ml-1">(4,749)</span>
                    </div>
                    <p className="text-sm text-gray-500">{article.location}</p>
                  </div>
                </div>
                {savedServices.map((subService, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center space-y-2"
                  >
                    <p>{subService.name}</p>{" "}
                    <p className="font-bold">€{subService.price}</p>
                  </div>
                ))}
                <div className="mb-4 mt-5 border-t border-slate-300 pt-5">
                  <div className="h-26">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <div>
                        <span className="line-through text-gray-500">
                          €{calculateTotal()}
                        </span>
                        <span className="font-bold text-green-500 ml-2">
                          €{calculateDiscountedTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col lg:flex-row p-4 lg:p-8 pt-10 max-w-7xl mx-auto">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">
                <span className="mr-1.5">Services</span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 mr-1.5">Time</span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5">Payment</span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 font-semibold text-black">
                  Confirmation
                </span>
              </div>
              <div className="mt-8 text-center">
                <div className="mb-4">
                  <BsCheck className="mx-auto text-green-500 size-16" />
                </div>
                <h2 className="text-3xl text-black mb-4 font-bold">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your booking. We've sent a confirmation email
                  with all the details.
                </p>
                <div className="border rounded-lg p-6 max-w-md mx-auto text-left">
                  <h3 className="font-bold mb-4">Booking Details</h3>
                  <p className="mb-2">
                    <span className="font-semibold">Date:</span> {selectedDate}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Time:</span> {selectedTime}
                  </p>
                  <p className="mb-4">
                    <span className="font-semibold">Location:</span>{" "}
                    {article.location}
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">Services:</p>
                    {savedServices.map((service, index) => (
                      <div key={index} className="flex justify-between mt-2">
                        <span>{service.name}</span>
                        <span>€{service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="mt-8 py-2.5 px-6 bg-black text-white rounded-lg font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStep()}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-start items-center gap-1">
                <PiSealWarning className="inline size-7 text-red-700 relative -top-[11px]" />
                <h3 className="text-xl md:text-2xl text-slate-900 font-semibold mb-6">
                  Booking and Payment Policy
                </h3>
              </div>
              <p className="text-md text-slate-700 font-normal mb-3">
                To secure your appointment, we require a 20% deposit of the
                total service cost at the time of booking. This deposit is
                non-refundable and ensures that your appointment is reserved
                just for you.
              </p>
              <p className="text-md text-slate-700 font-normal mb-5">
                The remaining 80% of the payment will be due at the time of your
                visit to the salon. This allows us to provide you with a
                seamless and convenient booking experience.
              </p>
              <p className="text-slate-900 text-sm font-semibold">
                Thank you for your trust in BEAUTYPOOL.
              </p>
              <div className="flex justify-center items-center mt-10">
                <button
                  className="py-1.5 px-3 bg-black text-white rounded font-semibold text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  I understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSteps;
