import { useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../utils/UserContext";
import { useContext } from "react";
import useLogout from "../utils/useLogout";
import ProfilePic from '../../public/profile.png';

const Navbar = () => {
    const [inputText, setInputText] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    
    const logout = useLogout();

    const handleTextChange = (e) => {
        setInputText(e.target.value);
      };

    const { loggedinUser, userInfo, updateLoggedinUser } = useContext(UserContext);
    //   console.log(userInfo);
    const handleLogout = () => {
        logout();
        updateLoggedinUser();
    }
    return(
        <div className="h-[10vh] w-[100%] flex justify-between items-center bg-[#0e1116] border-b-[1px] border-[#1c1f26] fixed px-10 font-medium z-10">
            <Link to="/" className="hover:text-white text-[1.2rem] font-bold text-white">
                BazVibe
            </Link>
            <div className="flex items-center gap-10">

                <input
                    type="text"
                    className="sm:inline hidden styled-input w-[30vw] py-2 pl-3 bg-[#1c1f26]  rounded-md focus:outline-none"
                    placeholder="Search AMUStudy"
                    value={inputText}
                    onChange={handleTextChange}
                    />
                {loggedinUser !== '' ? (
                    <button 
                        className="logout-btn text-red-400 hover:border-red-400"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <Link to={'/login'} className="text-white hover:text-white/90">
                        Login
                    </Link>
                )}
                
            </div>

            <div className="ml-3 relative">
            <div>
                <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800 flex text-sm "
                >
                {/* <span className="sr-only">Open user menu</span> */}
                {userInfo && userInfo.avatarUrl ? (
                    <img
                        className="h-fit w-10 rounded-full"
                        src={userInfo.avatarUrl}
                        alt="User Avatar"
                    />
                ) : (
                    <img
                        className="h-8 w-8 rounded-full"
                        src={ProfilePic}
                        alt="Default Profile"
                    />
                )}

                </button>
            </div>
            {isOpen && (
                <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#1c1f26] border-[1px] border-white/20 "
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
                >
                <span
                    href="#"
                    className="block px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
                >
                    Your Profile
                </span>
                <span
                    href="#"
                    className="block px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
                >
                    Settings
                </span>
                <span
                    href="#"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-white/10 cursor-pointer"
                >
                    Sign out
                </span>
                </div>
            )}
            </div>
        </div>
    )
}

export default Navbar;