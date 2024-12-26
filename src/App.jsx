import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Navbar from "./components/Navbar";
import LazyImage from "./components/LazyImage";
import UserContext from "./utils/UserContext";
import useHandleReaction from "./utils/useHandleReaction";
import useFetchData from "./utils/useFetch";
import Chevron from "../public/chevron.png";
import Plus from "../public/plus-black.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { posts, setPosts, events, showError } = useFetchData();
  const { handleReaction } = useHandleReaction(posts, setPosts);

  const navigate = useNavigate();

  const { loggedinUser, updateLoggedinUser } = useContext(UserContext);

  const handleShowForm = () => {
    navigate("/new");
  };

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

  return (
    <>
      <Navbar search={true} onSearch={handleSearch} />
      
      <main className="min-h-screen w-[calc(100vw_-_6px)] flex flex-col sm:flex-row sm:items-start items-center bg-[#0e1116] text-white pb-[10vh]">
        
        <div className="flex flex-col gap-5 items-start mx-10 w-[90%] sm:w-[60%] mt-[15vh] rounded-md ">
          <div className="flex justify-between items-center w-full pt-[5vh]">
            <h1 className="text-[1.7rem] font-bold">Recent Posts</h1>
            <button
              className={`bg-white h-fit ${
                loggedinUser === "" ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => {
                if (loggedinUser !== "") {
                  handleShowForm();
                }
              }}
            >
              <img src={Plus} />
            </button>
          </div>
          <div className="flex flex-wrap gap-5 text-sm font-bold">
            {showError && (
              <h1>Soemthing&apos;s wrong please comeback later!</h1>
            )}
            {filteredPosts.map((post, index) => (
              <div
                key={index}
                className="md:w-[23vw] flex items-center py-5 px-2 my-2 bg-[#1c1f26] rounded-2xl border-[1px] border-transparent hover:border-white/20 "
              >
                <div
                  onClick={() => handlePostClick(post.id)}
                  className="w-[100%] flex flex-col gap-3 cursor-pointer"
                >
                  <div className="flex gap-5 md:inline">
                    <div>
                      <h3 className="font-semibold text-2xl text-left px-2 pb-3 cursor-pointer">
                        {post.title}
                      </h3>
                      {post.tags.length !== 0 &&
                        post.expand?.tags.map((item, index) => (
                          <span
                            key={index}
                            className="w-fit border-[1px] border-[#6a7180] text-[#6a7180] px-3 py-1 rounded-lg text-xs font-medium "
                          >
                            #{item.label}
                          </span>
                        ))}
                      <p className="text-[#6a7180] mb-4 px-2 pt-3 text-sm font-medium">
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
        <div className="flex flex-col items-center w-[90%] sm:w-[40%] mx-2 gap-10">
          <div className="flex flex-col gap-5 w-full  md:mr-5 mt-[15vh] rounded-md border-[1px] border-[#1c1f26] px-5 py-[5vh] ">
            <h1 className="text-white text-[1.7rem] font-bold mb-5">
              Events & Sessions
            </h1>
            
            {events.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full"
              >
                <div className="flex flex-col justify-center gap-2">
                  <h3 className="text-lg font-medium cursor-pointer">
                    {event.title}
                  </h3>
                  <span>
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span className="text-gray-300">{event.venue}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
