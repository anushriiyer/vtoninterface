import { useState, useEffect } from "react";

const ImageExtractor = ({ url, setImage }) => {
  const [error, setError] = useState("");

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
          throw new Error("Failed to fetch image");
        }

        // Convert response to Blob
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);

        setImage(fileURL); // Set image as Blob URL
      } catch (err) {
        setError("Failed to fetch image.");
      }
    };

    fetchImage();
  }, [url, setImage]); // Depend on url and setImage to re-run when they change

  return error ? (
    <p style={{ color: "red", fontSize: "18px", fontFamily: "Arial" }}>{error}</p>
  ) : null;
};

export default ImageExtractor;
