import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';

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


const UserImage = () => {
    const [image, setImage] = useState(null);

    const navigate = useNavigate();

    const GoResultPage = () => {
      navigate('/result');
    };
  

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        saveFileToLocalStorage("userImageFile", file);
      }
    };

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

          {/* Conditional "Next" Button */}
          {image && (
            <button className="bg-blue-500 px-4 py-2 rounded-lg w-36 h-12 mt-4 text-white" onClick={GoResultPage}>
              Next
            </button>
          )}
        </div>
      </div>
    );
};

export default UserImage;
