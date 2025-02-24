import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleTryItOn = () => {
      navigate('/try-on');
    };
  
  return (
    <div className='site-container'>
      {/* Navbar */}
      <nav className="flex justify-between items-center w-full px-8 py-4 fixed top-0 left-0 bg-transparent z-50">
        <div className="text-lg font-semibold logo">VIRTUAL-TRY<br></br> ON HUB.</div>
        
        <ul className="flex space-x-8 justify-end items-end py-6">
          <li><a href="#home" className="hover:text-600 font-semibold">HOME</a></li>
          <li><a href="#project" className="hover:text-600 font-semibold">PROJECT</a></li>
          <li><Link to="/try-on" className="hover:text-600 font-semibold">TRY ON</Link></li>
          <li><a href="#contact" className="hover:text-600 font-semibold">CONTACT</a></li>
        </ul>
      </nav>

      {/* Main Section */}
      <div className="text-container">
        {/* Text Section */}
        <div className='main-text'>
          <h1 className="font-extrabold text-[250px]"> FIND YOUR <br></br>STYLE</h1>
            <div className='bottom-text'>
                <p className="title text-[100px]">YOUR FITTING<br /> ROOM HAS A<br /> NEW ONLINE <br />ADDRESS</p>
                <button onClick = {handleTryItOn} className="custom-button">
                    <span className="text-2xl">↘</span>
                    <br></br>
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
