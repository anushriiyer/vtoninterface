import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import ImageExtractor from "/Users/anushriiyer/vtoninterface/src/ImageExtracter.jsx";

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
};

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
      <nav className="flex justify-between items-center w-full px-8 py-4 fixed top-0 left-0 bg-transparent z-50">
        <div className="text-lg font-semibold logo">VIRTUAL-TRY<br></br> ON HUB.</div>
        
        <ul className="flex space-x-8 justify-end items-end py-6">
          <li><Link to="/" className="hover:text-600 font-semibold">HOME</Link></li>
          <li><a href="#project" className="hover:text-600 font-semibold">PROJECT</a></li>
          <li><a href="#tryon" className="hover:text-600 font-semibold">TRY ON</a></li>
          <li><a href="#contact" className="hover:text-600 font-semibold">CONTACT</a></li>
        </ul>
      </nav>

      {/* Garment Upload Section */}
      <div className="flex flex-col w-1/2 h-10/12 mt-32 items-center justify-center overflow-hidden">
        <h1 className="text-9xl font-bold">GARMENT IMAGE.</h1>

        {/* Upload Box */}
        <div 
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
        <div className="flex gap-4 mt-6 self-center">
        <button className="bg-brand-green px-4 py-2 rounded-lg w-44 h-16 text-xl" onClick={handleUrlUpload}>Upload</button>
        <button className="bg-brand-green px-4 py-2 rounded-lg w-44 h-16 text-xl" onClick={() => setImage(null)}>Remove</button>
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
