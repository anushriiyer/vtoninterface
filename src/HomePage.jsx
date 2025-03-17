import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import Navbar from "./assets/Navbar";

const HomePage = () => {
    const navigate = useNavigate();

    const handleTryItOn = () => {
      navigate('/try-on');
    };
  
  return (
    <div className='site-container flex'>
      <Navbar/>
     
      {/* Main Section */}
      <div className="text-container">
        {/* Text Section */}
        <div className='main-text'>
          <h1 className="font-extrabold text-[250px]"> FIND YOUR <br></br>STYLE</h1>
            <div className='bottom-text'>
                <p className="title text-[100px]">YOUR FITTING<br /> ROOM HAS A<br /> NEW ONLINE <br />ADDRESS</p>
                <button onClick = {handleTryItOn} className="custom-button">
                    <span className="text-4xl">↘</span>
                    <span>TRY IT ON</span>
                </button>
            </div>
        </div>
        </div>


        {/* Image Section */}
        <div className='image-container'>
          <div className="mirrorimage">
            <img
              src="./images/home-img.png"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
      
  );
};

export default HomePage;
