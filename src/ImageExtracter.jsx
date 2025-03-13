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

        const data = await response.json();
        if (data.image) {
          setImage(data.image); 
        } else {
          setError("No image found for this URL.");
        }
      } catch (err) {
        setError("Failed to fetch image.");
      }
    };

    fetchImage();
  }, [url, setImage]); 

  return error ? <p style={{ color: "red", fontSize: "18px", fontFamily: "Arial"}}>{error}</p> : null;;
};

export default ImageExtractor;
