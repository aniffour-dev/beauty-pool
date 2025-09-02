// import React from "react";
// import { FaCoins } from "react-icons/fa";
// import { MdReadMore } from "react-icons/md";
// import Link from "next/link";

// interface LoyaltyPopupProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const LoyaltyPopup: React.FC<LoyaltyPopupProps> = ({ isOpen, onClose }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//         <div className="text-center">
//           <div className="flex justify-center items-center">
//             <FaCoins className="!text-amber-400 text-6xl mb-4" />
//           </div>
//           <h2 className="text-2xl font-bold mb-4">
//             Earn Free Services with Loyalty Points!
//           </h2>
//           <p className="text-gray-700 mb-6">
//             Collect 200 points and enjoy a free service on us! Start earning
//             points today with every visit.
//           </p>
//           <div className="flex flex-col mb-4 items-end">
//             {" "}
//             <Link
//               className=" flex gap-1 justify-center items-center underline text-gray-500 opacity-90 text-sm"
//               href="/page/loyalty-program"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               {" "}
//               learn more <MdReadMore className="flex gap-2" />
//             </Link>
//           </div>

//           <button
//             onClick={onClose}
//             className="bg-gold text-white px-6 py-3 rounded-full hover:bg-gold-dark"
//           >
//             Got It!
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoyaltyPopup;


import React from 'react'

const page = () => {
  return (
    <div></div>
  )
}

export default page
