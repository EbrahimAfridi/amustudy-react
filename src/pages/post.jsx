import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import { formatDistanceToNow } from "date-fns";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import UserContext from "../utils/UserContext";
import LazyImage from "../components/LazyImage";
import userBlack from "../../public/userBlack.png";
import clap from "../assets/clap.svg";
import link from "../../public/linkBlack.png";
import { useContext } from "react";
import { FaCheck } from "react-icons/fa";

const Post = () => {
  const [post, setPost] = useState({});
  const [netLikes, setNetLikes] = useState(0);
  const [username, setUsername] = useState("");
  const [vote, setVote] = useState(null);
  const { postId } = useParams();

  const { loggedinUser, userId } = useContext(UserContext);

  const fetchLikes = async () => {
    try {
      const records = await pb.collection("post_likes").getFullList({
        filter: `postId = "${postId}"`,
      });
      const existingRecords = await pb.collection("likes").getFullList({
        filter: `postId = "${postId}" && userId = "${userId}"`, // never forget: "${variableName}"
      });
      // console.log(vote);
      if (existingRecords.length > 0) {
        // User has already reacted with the same type, delete the reaction
        setVote(existingRecords[0].like);
        // console.log(vote);
      } else {
        setVote(null);
      }

      if (records.length !== 0) {
        setNetLikes(records[0].netLikes);
      } else {
        setNetLikes(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReaction = async (likeValue) => {
    if (loggedinUser !== "") {
      try {
        // Check if the user has already reacted with the same type
        const existingRecords = await pb.collection("likes").getFullList({
          filter: `postId = "${postId}" && userId = "${userId}"`, // never forget: "${variableName}"
        });

        let newNetLikes = netLikes;

        if (existingRecords.length > 0) {
          if (likeValue === existingRecords[0].like) {
            newNetLikes -= likeValue;
            setVote(null);
            setNetLikes(newNetLikes);
            // console.log("right now");
            const recordId = existingRecords[0].id;
            await pb.collection("likes").delete(recordId);
            fetchLikes(); // Refresh the likes count after updating
          } else if (likeValue !== existingRecords[0].like) {
            newNetLikes += 2 * likeValue;
            setVote(likeValue);
            setNetLikes(newNetLikes);

            const recordId = existingRecords[0].id;
            await pb.collection("likes").delete(recordId);

            await pb.collection("likes").create({
              like: likeValue,
              userId: userId,
              postId: postId,
            });
            fetchLikes(); // Refresh the likes count after updating
          }
        } else {
          newNetLikes += likeValue;
          setVote(likeValue);
          setNetLikes(newNetLikes);

          // Create a new reaction
          await pb.collection("likes").create({
            like: likeValue,
            userId: userId,
            postId: postId,
          });
          fetchLikes(); // Refresh the likes count after updating
        }
      } catch (error) {
        console.log(error);
        // Revert optimistic update if error occurs
        fetchLikes();
      }
    } else {
      alert("You need to login to vote on the post.");
    }
  };

  useEffect(() => {
    const postView = async () => {
      try {
        const record = await pb.collection("posts").getOne(postId, {
          expand: "user",
        });
        const username = record?.expand?.user?.username;
        // console.log(username);
        setUsername(username);
        setPost(record);
        // console.log(record);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    // console.log(post.content);
    postView();
    // fetchLikes();
  }, [postId]);

  const handleCopy = () => {
    const url = window.location.href;

    // Use the Clipboard API to copy the URL to the clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-primary min-h-screen  min-w-[calc(100vw_-_6px)] justify-center text-primary-text pt-[10vh] md:pt-[15vh] md:pb-[10vh]">
        <div className="w-[100%] md:w-[55vw] h-fit flex flex-col gap-5 border-[1px] border-white/20  p-5 ">
          <h1 className="font-bold tracking-tight text-[32px] sm:text-[42px]">
            {post.title}
          </h1>
          <div>
            <div className="flex gap-5 items-center  mb-4 pb-2">
              <div className="flex items-center justify-center h-[40px] w-[40px] border-[1px] border-gray-500 rounded-full">
                <img src={userBlack} className="w-[24px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-normal">{username}</span>
                <p className=" text-sm">
                  {post.updated
                    ? formatDistanceToNow(new Date(post.updated)) + " ago"
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-y-[1px] border-primary-dark ">
              <div className="flex items-center">
                <img
                  src={clap}
                  alt="arrow"
                  className={`w-[40px] h-[40px] p-2 hover:rounded-full hover:bg-blue-600/40 cursor-pointer ${
                    vote === 1 && "bg-blue-600 rounded-full"
                  }`}
                  onClick={() => handleReaction(1)}
                />
                <span className="text-sm">{netLikes}</span>
              </div>

              <div
                onClick={handleCopy}
                className="flex items-center gap-2 p-3 transition-all cursor-pointer"
              >
                <img src={link} alt="arrow" className="w-[20px] h-[20px] " />
                <span className="text-sm">Copy Link</span>
              </div>
            </div>
          </div>
          {post.image !== "" && (
            <img
              src={`https://amustud.pockethost.io/api/files/${post.collectionId}/${post.id}/${post.image}`}
              alt="Post"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          )}

          <div
            className="py-5 text-[18px] sm:text-[20px] text-primary-post -tracking-[0.009em] leading-[32px] "
            dangerouslySetInnerHTML={{ __html: post.text }}
          ></div>
          {post?.content &&
            post.content.map((element, index) => {
              console.log("Element:", element); // Debug log

              if (element.type === "header") {
                return (
                  <h1 key={index} className="font-bold text-3xl text-black">
                    {element.data.text}
                  </h1>
                );
              } else if (element.type === "paragraph") {
                return (
                  <p 
                  key={index} 
                  className="py-5 text-[18px] sm:text-[20px] text-primary-post font-source -tracking-[0.009em] leading-[32px] "
                  dangerouslySetInnerHTML={{ __html: element.data.text }}
                ></p>
                );
              } else if (
                element.type === "list" &&
                element.data.style === "unordered"
              ) {
                return (
                  <ul
                    key={index}
                    className="list-disc list-inside text-lg text-gray-700 pl-4"
                  >
                    {element.data.items.map((item, index) => {
                      return (
                        <li key={index} className="mb-1"
                        dangerouslySetInnerHTML={{ __html: item.content}}>
                        </li>
                      );
                    })}
                  </ul>
                );
              } else if (
                element.type === "list" &&
                element.data.style === "ordered"
              ) {
                return (
                  <ol
                    key={index}
                    className="list-decimal list-inside text-lg text-gray-700 pl-4"
                  >
                    {element.data.items.map((item, index) => {
                      return (
                        <li key={index} className="mb-1"
                        dangerouslySetInnerHTML={{ __html:item.content}}>
                        </li>
                      );
                    })}
                  </ol>
                );
              } else if (
                element.type === "list" &&
                element.data.style === "checklist"
              ) {
                return (
                  <ul key={index} className="text-lg text-gray-700 pl-4">
                    {element.data.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="flex items-center gap-2 mb-1"
                        >
                          {item.meta?.checked ? (
                            <>
                              <FaCheck className="text-green-500" />

                              <span dangerouslySetInnerHTML={{ __html:item.content}}></span>
                            </>
                          ) : (
                            <>
                            <div
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-400"
                              disabled
                              ></div>
                          <span dangerouslySetInnerHTML={{ __html:item.content}}></span>
                              </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                );
              }
            })}
        </div>
      </div>
    </>
  );
};

export default Post;
