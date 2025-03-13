import React, { useEffect, useState } from "react";
import { Client } from "@gradio/client";

// Function to get saved files from localStorage
function getSavedFile(key) {
    const fileData = localStorage.getItem(key);
    if (!fileData) return null;
  
    try {
      const { base64, type } = JSON.parse(fileData);
      if (!base64) return null;
  
      // Convert base64 back to Blob
      const byteString = atob(base64.split(",")[1]);
      const byteArray = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
      }
      return new File([byteArray], "image.png", { type });
    } catch (error) {
      console.error("Error parsing saved file:", error);
      return null;
    }
  }
  

const ResultPage = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runTryOn = async (retryCount = 10, delay = 5000) => {
      const faceImage = getSavedFile("userImageFile"); 
      const garmentImage = getSavedFile("garmentImageFile"); 
      const poseImage = getSavedFile("poseImageFile"); 

      if (!faceImage || !garmentImage) {
        console.error("Face image or garment image is missing. Aborting API call.");
        setError("Missing required images.");
        return;
      }

      let app;
      try {
        app = await Client.connect("anushriiyer/IMAGDressing-v1");
      
        console.log("API Connected:", app);
      } catch (error) {
        console.error("Failed to connect to API:", error);
        setError("API connection failed.");
        return;
      }

      setLoading(true);
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          console.log(`Attempt ${attempt} to fetch try-on result...`);

          const result = await app.predict("/IMAGDressing-v1", [
            garmentImage,
            faceImage,
            poseImage || garmentImage,
            "Hello!",
            0.85,
            6.5,
            0.9,
            0.2,
            0.2,
            true,
            true,
            20,
            20240508
          ]);

          console.log("📩 Full API Response:", result);

          if (result && result.data) {
            console.log("API Data:", result.data);
            console.log("✅ Valid result received!");
            setImageSrc(result.data[0].url);
            setLoading(false);
            return;
          } else {
            console.warn("⚠️ No valid result. API response:", result);
          }
        } catch (error) {
          console.error("❌ API Request Error:", error);
          //setError(`API Error: ${error.message || "Unknown error"}`);
          if (attempt === retryCount) {
            setLoading(false);
          }
        }
        await new Promise((res) => setTimeout(res, delay));
      }
    };

    runTryOn();
  }, []);

  return (
    <div>
      <h1>Try-On Result</h1>
      <button onClick={() => window.location.reload()} disabled={loading}>
        {loading ? "Processing..." : "Run Try-On"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageSrc && <img src={imageSrc} alt="Try-On Result" />}
    </div>
  );
};

export default ResultPage;