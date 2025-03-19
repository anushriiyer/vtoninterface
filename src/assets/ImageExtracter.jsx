import { useState, useEffect } from "react";
import "flowbite";

const ImageExtractor = ({ url, setImage }) => {
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false); // Controls visibility of toast

  useEffect(() => {
    if (!url) return; // Don't run if no URL is provided

    setError("");
    setImage(""); // Reset image before fetching

    const fetchImage = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/extract-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch image.");
        }

        // Convert response to Blob
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);

        setImage(fileURL); // Set image as Blob URL
      } catch (err) {
        setError("Failed to fetch image.  Kindly screenshot the image from the site and upload as file.");
        setShowToast(true); // Show toast when an error occurs
      }
    };

    fetchImage();
  }, [url, setImage]); // Depend on url and setImage to re-run when they change

  return (
    <>
      {showToast && (
        <div
          id="toast-danger"
          className="z-30 flex items-center w-full h-36 max-w-2xl -mt-20 p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          {/* Error Icon */}
          <div className="ml-10 inline-flex items-center justify-center shrink-0 w-12 h-12 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
            </svg>
            <span className="sr-only">Error icon</span>
          </div>

          {/* Error Message */}
          <div className="ms-3 text-xl ml-16 font-normal text-white w-96 text-justify">{error}</div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setShowToast(false)} // Hide toast on click
            className="ms-auto -mx-1.5 -my-1.5 mr-6 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default ImageExtractor;
