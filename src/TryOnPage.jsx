import { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React from 'react';


const TryOnPage = () => {
  const [showExamples, setShowExamples] = useState(false);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const GoUserImage = () => {
    navigate('/user-image');
  };

  // Detect scroll to trigger the change
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

  const handleArrowClick = () => {
    setShowExamples(!showExamples);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      saveFileToLocalStorage("garmentImageFile", file);
      setImage(imageUrl);

    }
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  
  async function saveFileToLocalStorage(key, file) {
    const base64 = await fileToBase64(file);
    localStorage.setItem(key, JSON.stringify({ base64, type: file.type }));
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

      <div className="flex flex-col w-1/2 h-10/12 mt-32 items-center justify-center overflow-hidden">
      <h1 className="text-9xl font-bold">GARMENT IMAGE.</h1>

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

      <div className="flex w-1/2 h-3/4 items-center justify-center flex-col mt-40">
  <div className="text-white p-4 rounded-lg">
    <p className="text-xl mb-2 font-serif">
      Like something specific? Add a link from your favourite shopping site here:
    </p>

    <div className="flex items-center bg-[#f5f5eb] rounded-full px-4 py-3 w-full max-w-xl">
      <svg className="w-5 h-5 text-black mr-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 6a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm-3 10a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zm6.78-9.78a4 4 0 0 1 0 5.66l-2.83 2.83a4 4 0 0 1-5.66 0 1 1 0 0 1 1.42-1.42 2 2 0 0 0 2.83 0l2.83-2.83a2 2 0 1 0-2.83-2.83l-.71.71a1 1 0 1 1-1.42-1.42l.71-.71a4 4 0 0 1 5.66 0zm-9.56 9.56a4 4 0 0 1 0-5.66l2.83-2.83a4 4 0 0 1 5.66 0 1 1 0 0 1-1.42 1.42 2 2 0 0 0-2.83 0L8.78 11.2a2 2 0 1 0 2.83 2.83l.71-.71a1 1 0 0 1 1.42 1.42l-.71.71a4 4 0 0 1-5.66 0z"/>
      </svg>
      <input 
        type="url" 
        placeholder="Example: www.zara.com/" 
        className="bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 w-full"
      />
    </div>
  </div>

  {/* Buttons aligned left and spaced */}
  <div className="flex gap-4 mt-4 self-center">
    <button className="bg-brand-green px-4 py-2 rounded-lg w-36 h-12">Upload</button>
    <button className="bg-brand-green px-4 py-2 rounded-lg w-36 h-12">Remove</button>
    </div>
    <div className="mt-8">
        <p className='text-xl'> Step 1/3</p>
        <div className="w-52a bg-gray-300 rounded-full h-2">
        {image && (
            <button className="bg-blue-500 px-4 py-2 rounded-lg w-36 h-12 mt-4 text-white" onClick={GoUserImage}>
              Next
            </button>
          )}
        </div>
</div>
</div>


{/*
      {!showExamples ? (
        <div className="mt-8 bg-rounded-lg w-80 h-80 flex flex-col justify-center items-center">
          <p>Drop the image of the garment you want to try on / Click to Upload</p>
          <button
            onClick={handleArrowClick}
            className="mt-4 bg-green-500 p-2 rounded-full"
          >
            ↓
          </button>
        </div>
       
      )
       : (
        <div className="flex flex-col items-center">
          <h2 className="mt-8 text-xl">Or, experience the magic with these example images:</h2>
          <div className="flex gap-4 mt-4">
            <img
              src="/images/dress.jpg"
              alt="Example Dress"
              className="w-32 h-48 object-cover rounded-lg"
            />
            <img
              src="/images/shirt.jpg"
              alt="Example Shirt"
              className="w-32 h-48 object-cover rounded-lg"
            />
          </div>
          <div className="flex mt-4 gap-4">
            <button className="bg-gray-600 px-4 py-2 rounded-lg">Upload</button>
            <button className="bg-gray-600 px-4 py-2 rounded-lg">Remove</button>
          </div>
        </div>
      )}
       

      <div className="mt-8">
        <p>Step 1/3</p>
        <div className="w-48 bg-gray-300 rounded-full h-2">
          <div
            className={`bg-green-500 h-2 rounded-full ${
              showExamples ? 'w-2/3' : 'w-1/3'
            }`}
          ></div>
        </div>
      </div>*/}
    </div>
    
  );
}

export default TryOnPage;
