import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../utils/UserContext";
import { useContext } from "react";
import useLogout from "../utils/useLogout";
import ProfilePic from "../../public/profile.png";
import { useNavigate } from "react-router-dom";
import Plus from "../../public/plus-black.png";
import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";

const Navbar = ({ search, onSearch, post }) => {
  Navbar.propTypes = {
    search: PropTypes.bool,
    onSearch: PropTypes.func,
    post: PropTypes.bool,
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const [inputText, setInputText] = useState("");

  const { loggedinUser, userInfo, updateLoggedinUser } =
    useContext(UserContext);
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
              } else {
                navigate("/login");
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
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open user menu</span>
                {userInfo?.avatarUrl ? (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={userInfo.avatarUrl}
                    alt=""
                    loading="lazy"
                  />
                ): userInfo?.avatar ? (
                  <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <img
                      className="h-fit w-full rounded-full"
                      src={`https://amustud.pockethost.io/api/files/${userInfo.collectionId}/${userInfo.id}/${userInfo.avatar}`}
                      alt=""
                      loading="lazy"></img>
                  </span>
                ) : (
                  <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  </span>
                )}
              </MenuButton>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      to="/profile"
                      className={classNames(
                        focus ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Your Profile
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      to="#"
                      className={classNames(
                        focus ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Settings
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <span
                      className={classNames(
                        focus ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                      onClick={handleLogout}
                    >
                      Sign out
                    </span>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        ) : (
          <Link
            to={"/login"}
            className="rounded-lg border border-transparent my-1 sm:my-0 px-4 py-2 sm:text-base font-medium bg-primary-light cursor-pointer transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-[4px] focus:outline-auto focus:outline-webkit-focus-ring-color text-primary-text hover:text-primary-text/90"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
