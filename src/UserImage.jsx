import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import { initAccordions, initFlowbite } from 'flowbite';
import { useEffect } from 'react';


const UserImage = () => {
    const [image, setImage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
      initFlowbite();
    }, []);

    const GoResultPage = () => {
      navigate('/result');
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        saveFileToLocalStorage("userImageFile", file);
        setImage(imageUrl); // Set image immediately for uploaded files
      }
    };

    const handleUrlUpload = async (imageUrl) => {
      if (!imageUrl) {
          console.error("No image URL provided.");
          return;
      }
  
      setImage(imageUrl);
  
      try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], "user_image.jpg", { type: blob.type });
  
          await saveFileToLocalStorage("userImageFile", file); // Save as Base64
          console.log("User image saved to localStorage in Base64 format.");
      } catch (error) {
          console.error("Error converting URL to file:", error);
      }
  };
  
  // Converts a File/Blob to Base64
  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);  // Use readAsDataURL() to convert to Base64
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

  

  async function saveFileToLocalStorage(key, file) {
    if (file instanceof Blob) {
        // Convert File/Blob to Base64
        const base64 = await fileToBase64(file);
        localStorage.setItem(key, JSON.stringify({ base64, type: file.type })); // Store like garmentImageFile
    } else {
        console.error("Invalid file type: must be a Blob/File.");
    }
}
    
    async function saveFileToLocalStorage(key, file) {
      if (typeof file === "string") {
        // If file is a URL, save it directly
        localStorage.setItem(key, JSON.stringify({ url: file }));
      } else if (file instanceof Blob) {
        // Convert File/Blob to Base64
        const base64 = await fileToBase64(file);
        localStorage.setItem(key, JSON.stringify({ base64, type: file.type }));
      } else {
        console.error("Invalid file type: must be a URL or a Blob/File.");
      }
    }
    

    return (
      <div className='site-container'>
        {/* Navbar */}
        <nav className="flex justify-between items-center w-full px-8 py-4 fixed top-0 left-0 bg-transparent z-50">
          <div className="text-lg font-semibold logo">VIRTUAL-TRY<br></br> ON HUB.</div>
          <ul className="flex space-x-8 justify-end items-end py-6">
            <li><Link to="/" className="hover:text-600 font-semibold">HOME</Link></li>
            <li><a href="#project" className="hover:text-600 font-semibold">PROJECT</a></li>
            <li><a href="#tryon" className="hover:text-600 font-semibold">TRY ON</a></li>
            <li><a href="#contact" className="hover:text-600 font-semibold">CONTACT</a></li>
          </ul>
        </nav>

        {/* Image Upload Section */}
        <div className="flex flex-col w-1/2 h-10/12 mt-32 items-center justify-center overflow-hidden">
          <h1 className="text-9xl font-bold">USER IMAGE.</h1>
          <div 
            className="h-4/6 w-3/5 rounded-xl upload-box mt-4 flex items-center justify-center px-8 cursor-pointer bg-gray-100 bg-cover bg-center"
            style={{ backgroundImage: image ? `url(${image})` : 'none' }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {!image && (
              <p className='text-3xl text-center'>Drop your image for the try on / Click to Upload</p>
            )}
            <input 
              type="file" 
              id="fileInput" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
         
        </div>
        {/*right container*/}
        <div className="h-[1000px] w-3/5 mr-0 mt-36 flex justify-center items-center flex-col">
          <div id="default-carousel" className="relative w-7/12 h-aut" data-carousel="static">
          <p className='text-3xl'>Alternatively, click on one of these sample images to try-it-on!</p>
            
          {/* Image Wrapper */}
          <div className="relative overflow-hidden rounded-lg w-full h-[650px] flex items-center justify-center py-24">
          
          {/* First Image */}
          <div className="hidden absolute inset-0 flex items-center justify-center transition" data-carousel-item>
            <button onClick={() => handleUrlUpload("/model.jpg")}>
            <img src="./public/model.jpg" className="carousell-slide" alt="..." />
            </button>
          </div>

          {/* Second Image */}
          <div className="hidden absolute inset-0 flex items-center justify-center transition " data-carousel-item>
            <button onClick={() => handleUrlUpload("/male-model.jpg")}>
            <img src="./public/male-model.jpg" className="carousell-slide" alt="..." />
            </button>
          </div>

        </div>

        {/* Dots Navigation */}
        <div className="absolute z-30 flex bottom-5 left-1/2 -translate-x-1/2 space-x-3">
          <button type="button" className="w-3 h-3 rounded-full bg-gray-500" data-carousel-slide-to="0"></button>
          <button type="button" className="w-3 h-3 rounded-full bg-gray-500" data-carousel-slide-to="1"></button>
        </div>

        {/* Previous Button */}
        <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-brand-beige/30 group-hover:bg-white/50 dark:group-hover:bg-brand-green/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span class="sr-only">Previous</span>
        </span>
    </button>
    <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-brand-beige/30 group-hover:bg-white/50 dark:group-hover:bg-brand-green/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span class="sr-only">Next</span>
        </span>
    </button>
      </div>
    

    <button className="bg-brand-green px-4 py-2 rounded-lg w-44 h-16 text-xl" onClick={() => setImage(null)}>Remove</button>
    </div>
        {image && (
            <button onClick={GoResultPage} className='mb-0'>
            <svg  viewBox="-3 0 32 32" version="1.1" className='w-44 mt-10' stroke='#F3F3E8' strokeWidth="0.5">
                <g id="icomoon-ignore">
                </g>
                <path d="M13.11 29.113c7.243 0 13.113-5.871 13.113-13.113s-5.87-13.113-13.113-13.113c-7.242 0-13.113 5.871-13.113 13.113s5.871 13.113 13.113 13.113zM13.11 3.936c6.652 0 12.064 5.412 12.064 12.064s-5.412 12.064-12.064 12.064c-6.653 0-12.064-5.412-12.064-12.064s5.411-12.064 12.064-12.064z" fill="#000000"/>
                <path d="M13.906 21.637l0.742 0.742 6.378-6.379-6.378-6.379-0.742 0.742 5.112 5.112h-12.727v1.049h12.727z" fill="#000000"/>
              </svg>
          </button>
          )}

        </div>
    );
};

export default UserImage;
