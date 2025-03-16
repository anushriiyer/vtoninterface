import React, { useEffect, useState } from "react";
import { Client } from "@gradio/client";
import { Link } from 'react-router-dom';
import {initFlowbite } from 'flowbite';

//upload is file type, url also retrieves a file or does i

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
    initFlowbite();
  }, []);

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
    <div className="site-container">
        <nav className="flex justify-between items-center w-full px-8 py-4 fixed top-0 left-0 bg-transparent z-50">
        <div className="text-lg font-semibold logo">VIRTUAL-TRY<br></br> ON HUB.</div>
        
        <ul className="flex space-x-8 justify-end items-end py-6">
          <li><Link to="/" className="hover:text-600 font-semibold">HOME</Link></li>
          <li><a href="#project" className="hover:text-600 font-semibold">PROJECT</a></li>
          <li><a href="#tryon" className="hover:text-600 font-semibold">TRY ON</a></li>
          <li><a href="#contact" className="hover:text-600 font-semibold">CONTACT</a></li>
        </ul>
      </nav>


    <div className="text-container flex items-center justify-center flex-col space-y-7">
      <h1 className="text-8xl">Result Image</h1>
    <div className="h-5/6 w-3/5 rounded-xl upload-box mt-4 flex items-center justify-center px-8 cursor-pointer bg-gray-100 bg-cover bg-center">
    </div>
    </div>
        <div className="image-container flex-col">
        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-brand-green hover:bg-brand-green-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center inline-flex items-center dark:bg-brand-green dark:hover:bg-brand-green-dark dark:focus:ring-blue-800 -mt-56" type="button">Try-on Models <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
          </button>

<div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-64 dark:bg-gray-700 ">
    <ul class="py-2 text-2xl text-gray-700 dark:text-gray-200 bg-neutral-600 rounded-lg w-64" aria-labelledby="dropdownDefaultButton">
      <li>
        <a href="#" class="block px-4 py-2  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">IMAGDressing</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
      </li>
    </ul>
</div>
<p className="text-3xl text-left block w-[100%] -mr-[420px] mt-20" >Prompt:</p>
<div className="h-1/6 w-3/5 rounded-xl bg-brand-beige mt-4 flex items-center justify-center px-8 cursor-pointer bg-cover bg-center">
<input 
              type="text"
              placeholder="Example Prompt: A woman with t-shirt and jeans." 
              className="bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full text-xl text-center"></input>
    </div>
    </div>

    </div>


    
  );
};

export default ResultPage;