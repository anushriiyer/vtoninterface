import React, { useEffect, useState } from "react";

const CircularProgress = ({ duration = 5000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = Date.now();
    const timer = setInterval(() => {
      const timePassed = Date.now() - start;
      const percentage = Math.min((timePassed / duration) * 100, 100);
      setProgress(percentage);
      if (percentage === 100) clearInterval(timer);
    }, 50);

    return () => clearInterval(timer);
  }, [duration]);

  // Increase radius for larger size
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center w-40 h-40">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb" // light background ring
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#374151" // dark gray progress ring
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="22"
          fill="#374151"
        >
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
};

export default CircularProgress;
