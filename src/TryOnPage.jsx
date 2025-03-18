import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import ImageExtractor from "./assets/ImageExtracter.jsx";
import Navbar from './assets/Navbar.jsx';
import { initAccordions, initFlowbite } from 'flowbite'

const TryOnPage = () => {
  const [showExamples, setShowExamples] = useState(false);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [extractedImage, setExtractedImage] = useState(null); // Holds extracted image before upload

  const navigate = useNavigate();

  const GoUserImage = () => {
    navigate('/user-image');
  };

  useEffect(() => {
      initFlowbite();
    }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowExamples(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleImageUpload = (event) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleUrlUpload = async (imageUrl) => {
    // Use extractedImage if available, otherwise use imageUrl
    const imageToUse = extractedImage || imageUrl;

    if (!imageToUse) {
        console.error("No image available for upload.");
        return;
    }

    console.log("Setting image:", imageToUse);
    setImage(imageToUse);

    try {
        // Fetch the image and convert to blob
        const response = await fetch(imageToUse);
        const blob = await response.blob();

        // Create file from blob
        const fileName = extractedImage ? "extracted_image.jpg" : "user_image.jpg";
        const file = new File([blob], fileName, { type: blob.type });

        // Save to localStorage using the same logic from original functions
        if (extractedImage) {
            await saveFileToLocalStorage("garmentImageFile", file);
            console.log("Extracted image saved to localStorage:", file);
        } else {
            await saveFileToLocalStorage("userImageFile", file);
            console.log("User image saved to localStorage:", file);
        }
    } catch (error) {
        console.error("Error converting image to file:", error);
    }
};


/*
  const handleUrlUpload = () => {
    if (extractedImage) {
        console.log("Setting extractedImage:", extractedImage);
        setImage(extractedImage);

        // Convert extractedImage to a file for saving
        fetch(extractedImage)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "extracted_image.jpg", { type: "image/jpeg" });
                saveFileToLocalStorage("garmentImageFile", file);
                console.log("File saved to localStorage:", file);
            })
            .catch(error => console.error("Error converting extracted image:", error));
    }
};*/

// Debug if `image` state updates
useEffect(() => {
    console.log("Updated image state:", image);
}, [image]);

  
function saveFileToLocalStorage(key, file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          const base64String = reader.result;
          const fileData = { base64: base64String };  // Store in the same format as `userImageFile`
          
          localStorage.setItem(key, JSON.stringify(fileData)); // Store as JSON object
          resolve(fileData);
      };
      reader.onerror = (error) => reject(error);
  });
}

  return (
    <div className='site-container'>
      {/* Navbar */}
      <Navbar/>

      {/* Garment Upload Section */}
      <div className="flex flex-col w-1/2 h-10/12 mt-32 items-center justify-center overflow-hidden">
        <h1 className="text-8xl font-bold">GARMENT IMAGE.</h1>
        <h3 className="w-3/5 text-xl  text-justify font-semibold font-Arial">Select a clothing image, preferably with minimal/plain background for a better quality output. High quality images will have better outputs.</h3>
        {/* Upload Box */}
        <div data-tooltip-target = "tooltip-box" data-tooltip-placement="bottom" data-tooltip-trigger="hover"
          className="h-4/6 w-3/5 rounded-xl upload-box mt-4 flex items-center justify-center px-8 cursor-pointer bg-gray-100 bg-cover bg-center"
          style={{ backgroundImage: image ? `url(${image})` : 'none' }}
          onClick={() => document.getElementById('fileInput').click()}
        >
          {!image && (
            <p className='text-3xl text-center'>Drop the image of the garment you want to try on / Click to Upload</p>
          )}
          <input 
            type="file" 
            id="fileInput" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        
        </div>
        <div id="tooltip-box"  role="tooltip"  className="absolute z-10 invisible inline-block px-3 py-2 text-lg font-Arial max-w-56 text-white bg-gray-700 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
        Select a garment image of choice from your files.
       </div>
      </div>

      {/* URL Input for Image Extraction */}
      <div className="flex w-1/2 h-3/4 items-center justify-center flex-col mt-40 mr-10">
        <div className="text-white p-4 rounded-lg">
          <p className="text-4xl mb-8">
            Like something specific? Add a link from your favourite shopping site here:
          </p>

          <div className="flex items-center bg-brand-beige rounded-full px-4 py-5 w-full max-w-4xl">
            <input 
              type="url" 
              placeholder="Example: www.zara.com/" 
              value={url}
              className="bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full text-xl text-center"
              onChange={(e) => setUrl(e.target.value)}
              style={{ marginRight: "10px" }}
            />
          </div>
        </div>

  
        <ImageExtractor url={url} setImage={setExtractedImage} />

        <div className="flex gap-6 mt-6 self-center">
        <button data-tooltip-target = "tooltip-upload" data-tooltip-placement="bottom"  data-tooltip-trigger="hover" className="bg-brand-green px-4 py-2 rounded-lg w-44 h-16 text-xl" onClick={handleUrlUpload}>Upload</button>
        <div id="tooltip-upload"  role="tooltip"  className="absolute z-10 invisible inline-block px-3 py-2 text-lg font-Arial max-w-56 text-white bg-gray-700 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
        Click Upload for the URL image to appear on the left-panel.
       </div>

        <button data-tooltip-target = "tooltip-remove" data-tooltip-placement="bottom"  data-tooltip-trigger="hover" className="bg-brand-green px-4 py-2 rounded-lg w-44 h-16 text-xl" onClick={() => setImage(null)}>Remove</button>
        <div id="tooltip-remove"  role="tooltip"  className="absolute z-10 invisible inline-block px-3 py-2 text-lg font-Arial max-w-56 text-white bg-gray-700 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
        Click Remove to remove the image from the left panel.
       </div>
      </div>
    

      <div id="default-carousel" className="relative max-w-4xl h-[400px] mt-20" data-carousel="static">
          <p className='text-4xl'>Alternatively, click on one of these sample images to try-it-on!</p>
            
          {/* Image Wrapper */}
          <div className="relative overflow-hidden rounded-lg h-[400px] flex items-center justify-center py-24 mt-7">
          
          <div className="hidden absolute inset-0 flex items-center justify-center transition" data-carousel-item>
            <button onClick={() => handleUrlUpload("/black-dress-female.jpg")}>
            <img src="./public/black-dress-female.jpg" className="carousell-slide" alt="..." />
            </button>
          </div>

          <div className="hidden absolute inset-0 flex items-center justify-center transition " data-carousel-item>
            <button onClick={() => handleUrlUpload("/green-shirt-male.jpg")}>
            <img src="./public/green-shirt-male.jpg" className="carousell-slide" alt="..." />
            </button>
          </div>

          <div className="hidden absolute inset-0 flex items-center justify-center transition " data-carousel-item>
            <button onClick={() => handleUrlUpload("/red-shirt-male.jpg")}>
            <img src="./public/red-shirt-male.jpg" className="carousell-slide" alt="..." />
            </button>
          </div>
          <div className="hidden absolute inset-0 flex items-center justify-center transition " data-carousel-item>
            <button onClick={() => handleUrlUpload("/red-sweater-female.jpg")}>
            <img src="./public/red-sweater-female.jpg" className="carousell-slide" alt="..." />
            </button>
          </div>
          <div className="hidden absolute inset-0 flex items-center justify-center transition " data-carousel-item>
            <button onClick={() => handleUrlUpload("/white-pant-male.jpg")}>
            <img src="./public/white-pant-male.jpg" className="carousell-slide" alt="..." />
            </button>
          </div>


        </div>

        {/* Dots Navigation */}
        <div className="absolute z-30 -bottom-3flex left-[55%] -translate-x-1/2 space-x-3">
          <button type="button" className="w-3 h-3 rounded-full bg-gray-500" data-carousel-slide-to="0"></button>
          <button type="button" className="w-3 h-3 rounded-full bg-gray-500" data-carousel-slide-to="1"></button>
          <button type="button" className="w-3 h-3 rounded-full bg-gray-500" data-carousel-slide-to="2"></button>
          <button type="button" className="w-3 h-3 rounded-full bg-gray-500" data-carousel-slide-to="3"></button>
          <button type="button" className="w-3 h-3 rounded-full bg-gray-500" data-carousel-slide-to="4"></button>
        </div>

        {/* Previous Button */}
        <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-brand-beige/30 group-hover:bg-white/50 dark:group-hover:bg-brand-green/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span className="sr-only">Previous</span>
        </span>
    </button>
    <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-brand-beige/30 group-hover:bg-white/50 dark:group-hover:bg-brand-green/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span className="sr-only">Next</span>
        </span>
    </button>
      </div>
     </div>

      {/*Next Button appears on image */}
      {image && (
            <button onClick={GoUserImage}>
              <svg  viewBox="-3 0 32 32" version="1.1" className='w-44 mb-0 mr-0' stroke='#F3F3E8' strokeWidth="0.5">
                  <g id="icomoon-ignore">
                  </g>
                  <path d="M13.11 29.113c7.243 0 13.113-5.871 13.113-13.113s-5.87-13.113-13.113-13.113c-7.242 0-13.113 5.871-13.113 13.113s5.871 13.113 13.113 13.113zM13.11 3.936c6.652 0 12.064 5.412 12.064 12.064s-5.412 12.064-12.064 12.064c-6.653 0-12.064-5.412-12.064-12.064s5.411-12.064 12.064-12.064z" fill="#000000"/>
                  <path d="M13.906 21.637l0.742 0.742 6.378-6.379-6.378-6.379-0.742 0.742 5.112 5.112h-12.727v1.049h12.727z" fill="#000000"/>
                </svg>
            </button>
          )}




        </div>
  );
}

export default TryOnPage;
