import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center w-full px-8 py-4 fixed top-0 left-0 bg-transparent z-50">
      <div className="text-2xl font-semibold logo">
        VIRTUAL-TRY<br /> ON HUB.
      </div>

      <ul className="flex space-x-8 justify-end items-end py-6 mt-5 text-2xl">
        <li><Link to="/" className="hover:text-600 font-semibold">HOME</Link></li>
        <li><a href="#project" className="hover:text-600 font-semibold">PROJECT</a></li>
        <li><a href="#tryon" className="hover:text-600 font-semibold">TRY ON</a></li>
        <li><a href="#contact" className="hover:text-600 font-semibold">CONTACT</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
