import React from "react";
import { useNavigate } from "react-router-dom";

const stepTitles = [
  "Basic\nDetails",
  "Residential\nDetails",
  "Business\nDetails",
  "Aadhaar\nDetails",
  "PAN\nDetails",
  "Bank\nDetail",
  "Video\nKYC",
];

const stepRoutes = [
  "/basic-details",
  "/residential-details",
  "/business-details",
  "/aadhaar-details",
  "/pan-details",
   "/bank-detail",
  "/video-kyc",
];

const Stepper = ({ currentStep }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center w-full px-2 mb-6 ml-2">
      {stepTitles.map((title, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center w-full relative mb-6">
            {/* Step Circle */}
            <div
              // onClick={() => navigate(stepRoutes[index])}
              className={`w-8 h-8 z-10 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-all duration-300
                ${isCompleted ? "bg-green-500 text-white"
                  : isCurrent ? "bg-[#2C2DCB] text-white"
                  : "bg-gray-300 text-gray-700"}`}
            >
              {index + 1}
            </div>

            {/* Step Label */}
            <div
              onClick={() => navigate(stepRoutes[index])}
              className="absolute top-9 left-1/4 -translate-x-1/2 w-24 text-center text-[10px] text-gray-600 cursor-pointer whitespace-pre-line leading-[13px]"
            >
              {title}
            </div>

            {/* Connector Line */}
            {index < stepTitles.length - 1 && (
              <div className={`flex-1 h-1 mx-1 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;