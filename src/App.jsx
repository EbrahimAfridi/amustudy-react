import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Navbar from "./components/Navbar";
import LazyImage from "./components/LazyImage";
import UserContext from "./utils/UserContext";
import useFetchData from "./utils/useFetch";
import Plus from "../public/plus-black.png";
import HomeIcon from "../public/homeBlack.png";
import CalendarIcon from "../public/calendarBlack.png";
import Events from "./components/Events";
// import Footer from "./components/Footer";
import userBlack from "../public/userBlack.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [home, setHome] = useState(true);

  const { posts, events, showError } = useFetchData();
  const navigate = useNavigate();
  const { loggedinUser } = useContext(UserContext);
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  // console.log(posts);
  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // useEffect(() => {
  //   updateLoggedinUser();
  // }, []); 
  //commented this here because updating user in userContext don't remember why i commented the update in user context earlier

  useEffect(() => {
    if (isLargeScreen) {
      setHome(true);
    }
  }, [isLargeScreen]);

  return (
    <>
      <Navbar search={true} onSearch={handleSearch} post={true} />

      {home ? (
        <main className="min-h-screen w-[100vw] flex flex-col sm:flex-row sm:items-start items-center bg-primary text-primary-text font-lato overflow-hidden">
          <div className="flex flex-col gap-5 items-start pl-2 sm:px-10 w-[100%] sm:w-[65%] pt-[15vh] pb-[10vh] rounded-md overflow-y-auto h-screen">
            <h1 className="text-[1.7rem] font-bold pl-7">Recent Posts</h1>
            <div className="flex flex-col gap-5 w-full text-sm font-bold">
              {showError && (
                <h1>Soemthing&apos;s wrong please comeback later!</h1>
              )}
              {filteredPosts.map((post, index) => (
                <div
                  key={index}
                  className="md:w-[100%] flex items-center sm:px-5 my-2 sm:bg-primary "
                >
                  <div
                    onClick={() => handlePostClick(post.id)}
                    className="w-full flex justify-between gap-0 cursor-pointer pb-2 border-b-[1px] "
                  >
                    <div className="flex sm:flex-row flex-col gap-5 sm:gap-0 w-3/4 md:inline">
                      <div>
                        <div className="flex items-center gap-3 mb-[16px] pl-2">
                          <div className="flex items-center justify-center h-[20px] w-[20px] border-[1px] border-gray-500 rounded-full overflow-hidden">
                            <img 
                               src={`${post?.expand?.user?.avatarUrl ? post.expand.user.avatarUrl : userBlack}`}
                              className="w-[20px]" />
                          </div>
                          <span className="font-normal text-[13px]">
                            {post?.expand?.user?.username}
                          </span>
                        </div>
                        <h3 className="font-bold text-[20px] sm:text-2xl leading-[24px] text-left px-2 cursor-pointer">
                          {post.title}
                        </h3>
                        <p className="mb-4 text-left text-[16px] font-medium text-gray-600 px-2 pt-[8px]">
                          {post.text.slice(0, 70)}...
                        </p>
                        <p className="text-[#6a7180] mb-4 px-2 text-sm font-medium">
                          {new Date(post.created).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    {post.image !== "" && (
                      <LazyImage
                        src={`https://amustud.pockethost.io/api/files/${post.collectionId}/${post.id}/${post.image}`}
                        alt="Post"
                        className="sm:h-[25vh] h-[25vw] w-[25vw] sm:w-1/4 flex items-center sm:px-0 pt-[36px] pr-2 rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Events events={events} mobile={false} />
        </main>
      ) : (
        <Events events={events} mobile={true} />
      )}

      <div className="fixed bottom-0 sm:hidden flex items-center justify-around w-full h-[10vh] bg-primary text-primary-text border-t-[1px] border-primary-dark">
        <div
          className={`flex flex-col items-center cursor-pointer border-b-[3px] ${
            home ? "border-primary-text" : "border-transparent"
          }`}
          onClick={() => setHome(true)}
        >
          <img src={HomeIcon} className="h-[30px] w-fit" />
          <span className="text-[12px] text-primary-text">Home</span>
        </div>
        <div>
          <button
            className="sm:hidden inline rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-white transition-colors duration-200  focus:outline focus:outline-[4px] focus:outline-auto focus:outline-webkit-focus-ring-color"
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
        </div>
        <div
          className={`flex flex-col items-center cursor-pointer border-b-[3px] ${
            home ? "border-transparent" : "border-primary-text"
          }`}
          onClick={() => setHome(false)}
        >
          <img src={CalendarIcon} className="h-[30px] w-fit" />
          <span className="text-[12px] text-primary-text">Calendar</span>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
