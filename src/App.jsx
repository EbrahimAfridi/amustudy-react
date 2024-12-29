import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useMediaQuery } from "react-responsive";
import Navbar from "./components/Navbar";
import LazyImage from "./components/LazyImage";
import UserContext from "./utils/UserContext";
import useHandleReaction from "./utils/useHandleReaction";
import useFetchData from "./utils/useFetch";
import Chevron from "../public/chevron.png";
import Plus from "../public/plus-black.png";
import HomeIcon from "../public/home-white.png";
import CalendarIcon from "../public/calendar-white.png";
import Events from "./components/Events";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [home, setHome] = useState(true);
  
  const { posts, setPosts, events, showError } = useFetchData();
  const { handleReaction } = useHandleReaction(posts, setPosts);
  const navigate = useNavigate();
  const { loggedinUser, updateLoggedinUser } = useContext(UserContext);
  const isLargeScreen = useMediaQuery({ query: '(min-width: 768px)' });

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    updateLoggedinUser();
  }, []);

  useEffect(() => {
    if (isLargeScreen) {
      setHome(true);
    }
  }, [isLargeScreen]);

  return (
    <>
      <Navbar search={true} onSearch={handleSearch} post={true} />

      {home ? (
 
      <main className="min-h-screen w-[calc(100vw-6px)] flex flex-col sm:flex-row sm:items-start items-center bg-primary text-white overflow-hidden">
        <div className="flex flex-col gap-5 items-start pl-2 sm:px-10 w-[100%] sm:w-[80%] pt-[15vh] rounded-md overflow-y-auto h-screen">
          <h1 className="text-[1.7rem] font-bold">Recent Posts</h1>
          <div className="flex flex-wrap gap-5 sm:w-fit w-full text-sm font-bold">
            {showError && (
              <h1>Soemthing&apos;s wrong please comeback later!</h1>
            )}
            {filteredPosts.map((post, index) => (
              <div
                key={index}
                className="md:w-[23vw] flex items-center py-5 px-2 my-2 sm:bg-[#1c1f26] rounded-2xl border-[1px] border-white/20  sm:border-transparent hover:border-white/20 "
              >
                <div
                  onClick={() => handlePostClick(post.id)}
                  className="w-[100%] flex flex-col gap-3 cursor-pointer"
                >
                  <div className="flex sm:flex-row flex-col gap-5 md:inline">
                    <div>
                      <h3 className="font-semibold text-2xl text-left px-2 sm:pb-3 cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-[#6a7180] mb-4 px-2 sm:pt-3 text-sm font-medium">
                        {formatDistanceToNow(new Date(post.created))} ago •{" "}
                        <span className="font-medium">
                          {post?.expand?.user?.username}
                        </span>
                      </p>
                    </div>
                    {/* <p className="mb-4 text-left px-2">{post.text.slice(0, 300)}</p> */}
                    {post.image !== "" && (
                      <LazyImage
                        src={`https://amustud.pockethost.io/api/files/${post.collectionId}/${post.id}/${post.image}`}
                        alt="Post"
                        className="w-full h-[25vh] overflow-hidden flex items-center rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-[#282b35] text-[#6a7180] font-bold w-fit rounded-xl">
                    <img
                      src={Chevron}
                      className="w-[40px] rotate-[90deg] p-2 rounded-md hover:bg-[#e2e2e6] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReaction(post.id, 1);
                      }}
                    />

                    <span>{post.netLikes}</span>
                    <img
                      src={Chevron}
                      className="w-[40px] rotate-[-90deg] p-2 rounded-md hover:bg-[#e2e2e6] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReaction(post.id, -1);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Events events={events} mobile={false}/>
      </main>
      ) : (
        <Events events={events} mobile={true}/>
      )}

      <div className="fixed bottom-1 sm:hidden flex items-center justify-around w-full h-[10vh] bg-primary text-white rounded-3xl border-t-[1px] border-gray-600">
        <div 
          className={`flex flex-col items-center cursor-pointer border-b-[3px] ${home ? "border-white" : "border-transparent" }`}
          onClick={() => setHome(true)}>
          <img src={HomeIcon} className="h-[30px] w-fit"/>
          <span className="text-[12px]">Home</span>
        </div>
        <div>
          <button
            className="sm:hidden inline rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-white transition-colors duration-200  focus:outline focus:outline-[4px] focus:outline-auto focus:outline-webkit-focus-ring-color"
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
        </div>
        <div 
          className={`flex flex-col items-center cursor-pointer border-b-[3px] ${home ? "border-transparent" : "border-white" }`}
          onClick={() => setHome(false)}>
          <img src={CalendarIcon} className="h-[30px] w-fit"/>
          <span className="text-[12px]">Calendar</span>
        </div>
      </div>
    </>
  );
}
