import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center w-full px-8 py-4 fixed  bg-transparent z-50">
      <div className="text-xl font-semibold logo">
        VIRTUAL-TRY<br /> ON HUB.
      </div>

      <ul className="flex space-x-8 justify-end items-end py-6 mt-5 text-xl">
        <li><Link to="/" className="hover:text-600 font-semibold">HOME</Link></li>
        <li><a href="#project" className="hover:text-600 font-semibold">PROJECT</a></li>
        <li><Link to="/try-on" className="hover:text-600 font-semibold">TRY-ON</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
