import PropTypes from 'prop-types';
import { useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../utils/UserContext";
import { useContext } from "react";
import useLogout from "../utils/useLogout";
import ProfilePic from "../../public/profile.png";
import { useNavigate } from "react-router-dom";
import Plus from "../../public/plus-black.png";

const Navbar = ({ search, onSearch, post }) => {

  Navbar.propTypes = {
    search: PropTypes.bool,
    onSearch: PropTypes.func,
    post: PropTypes.bool,
  };
  
  const [inputText, setInputText] = useState("");

  const { loggedinUser, updateLoggedinUser } = useContext(UserContext);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogout = () => {
    logout();
    updateLoggedinUser();
  };


  return (
    <div className="sm:h-[10vh] w-[calc(100vw-8px)] flex justify-between items-center text-[15px] sm:text-[1.2rem] bg-primary border-b-[1px] border-primary-dark fixed  px-4 sm:px-10 font-medium z-10">
      <Link
        to="/"
        className="hover:text-primary-text  font-bold text-primary-text"
      >
        AMUNIFY
      </Link>
      <div className="flex items-center gap-10">
        {post && (
          <button
          className="hidden sm:inline rounded-lg border border-transparent px-4 py-2 text-base font-medium hover:border-[1px] hover:border-black transition-colors duration-200  focus:outline focus:outline-[4px] focus:outline-auto focus:outline-webkit-focus-ring-color"
            onClick={() => {
              if (loggedinUser !== "") {
                navigate("/new");
              }else{
                navigate('/login');
              }
            }}
          >
            <img src={Plus} />
          </button>
        )}
        {search && (
          <input
            type="text"
            className="sm:inline hidden styled-input w-[30vw] py-2 pl-3 bg-primary-light  rounded-md focus:outline-none"
            placeholder="Search AMUStudy"
            value={inputText}
            onChange={handleTextChange}
          />
        )}
        {loggedinUser !== "" ? (
          <button
            className="rounded-lg border border-transparent my-1 sm:my-0 px-4 py-2 sm:text-base font-medium bg-[#1a1a1a] cursor-pointer transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-[4px] focus:outline-auto focus:outline-webkit-focus-ring-color text-red-400 "
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link to={"/login"} className="rounded-lg border border-transparent my-1 sm:my-0 px-4 py-2 sm:text-base font-medium bg-primary-light cursor-pointer transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-[4px] focus:outline-auto focus:outline-webkit-focus-ring-color text-primary-text hover:text-primary-text/90">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
