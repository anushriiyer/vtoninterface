import React from "react";

const VerticalProgressBar = ({ currentStep }) => {
  const steps = [
    { title: "Add Garment Image" },
    { title: "Add User Image" },
    { title: "Result" }
  ];

  // Calculate the height of the green progress line dynamically
  const progressHeight = (currentStep - 1) * (500 / (steps.length - 1)); 

  return (
    <div className="relative flex flex-col items-start">
      {/* Full Gray Line (Background) */}
      <div className="absolute left-[19px] top-5 w-1 h-[500px] bg-gray-500"></div>

      {/* Dynamic Green Line (Progress) */}
      <div
        className="absolute left-[19px] top-5 w-1 bg-brand-green-dark transition-all duration-300"
        style={{ height: `${progressHeight}px` }} // Adjusts dynamically
      ></div>

      {steps.map((step, index) => {
        const isCompleted = index + 1 < currentStep;
        const isActive = index + 1 === currentStep;

        return (
          <div
            key={index}
            className={`relative flex items-center ${
              index === 1 ? "mt-[210px]" : index === 2 ? "mt-[200px]" : "mt-0"
            }`}
          >
            {/* Circle */}
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                isCompleted
                  ? "bg-brand-green-dark"
                  : isActive
                  ? "bg-brand-green-dark"
                  : "bg-gray-700"
              }`}
            ></div>

            {/* Step Text - Properly Aligned to the Right */}
            <p
              className={`ml-6 text-3xl font-bold ${
                isCompleted ? "text-white" : isActive ? "text-brand-green-dark-300" : "text-gray-500"
              }`}
            >
              {step.title}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default VerticalProgressBar;
