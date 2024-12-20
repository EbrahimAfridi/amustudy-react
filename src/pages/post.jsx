import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
// import { formatDistanceToNow } from "date-fns";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import UserContext from "../utils/UserContext";
import LazyImage from "../components/LazyImage";
import { useContext } from "react";

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
      console.log(vote);
      if (existingRecords.length > 0) {
        // User has already reacted with the same type, delete the reaction
        setVote(existingRecords[0].like);
        console.log(vote);
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
            console.log("right now");
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
        console.log(username);
        setUsername(username);
        setPost(record);
        console.log(record);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    postView();
    fetchLikes();
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
      <div className="flex bg-[#1c1f26] min-h-screen  min-w-[calc(100vw_-_6px)] justify-center text-white pt-[10vh] md:pt-[15vh] md:pb-[10vh]">
        <div className="w-[100%] md:w-[60vw] h-fit flex flex-col gap-5 border-[1px] border-white/20 md:rounded-3xl p-5 bg-[#0e1116] ">
          <div className="flex gap-5 items-center  mb-4">
            <div className="flex items-center justify-center h-[40px] w-[40px] border-[1px] border-gray-500 rounded-full">
              <img src="/profile.png" className="w-[30px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{username}</span>
              <p className=" text-sm">
                {/* {post.updated ? formatDistanceToNow(new Date(post.updated)) + ' ago' : 'N/A'} */}
              </p>
            </div>
          </div>
          <h1 className="font-semibold text-[2.2rem]">{post.title}</h1>
          {post.image !== '' && <img src={`https://amustud.pockethost.io/api/files/${post.collectionId}/${post.id}/${post.image}`} alt="Post" className="w-[400px] h-auto rounded-lg" loading="lazy"/>}
          
          <div
            className="py-5 text-[1rem] text-white/90"
            dangerouslySetInnerHTML={{ __html: post.text }}
          ></div>
          <div className="flex justify-between w-[100%] font-bold">
            <div className="flex gap-5">
              <div className="flex items-center gap-2  bg-[#282b35] rounded-2xl mb-10">
                <img
                  src="/arrow-white.png"
                  alt="arrow"
                  className={`w-[35px] h-[35px] rotate-[270deg] p-2 hover:rounded-full hover:bg-blue-600/40 cursor-pointer ${
                    vote === 1 && "bg-blue-600 rounded-full"
                  }`}
                  onClick={() => handleReaction(1)}
                />
                <span className="text-sm">{netLikes}</span>
                <img
                  src="/arrow-white.png"
                  alt="arrow"
                  className={`w-[35px] h-[35px] p-2 rotate-[90deg] hover:rounded-full hover:bg-red-600/40 cursor-pointer ${
                    vote === -1 && "bg-red-600 rounded-full"
                  }`}
                  onClick={() => handleReaction(-1)}
                />
              </div>
              <div className="flex items-center gap-2 px-3 bg-[#282b35] rounded-2xl mb-10 hover:bg-gray-600/40 cursor-pointer">
                <img
                  src="/comment-white.png"
                  alt="arrow"
                  className="w-[20px] h-[20px] "
                />
                <span className="text-sm">123</span>
              </div>
            </div>
            <div
              onClick={handleCopy}
              className="flex items-center gap-2 p-3 bg-[#282b35] rounded-2xl mb-10  hover:text-purple-500 transition-all cursor-pointer"
            >
              <img src="/copy.png" alt="arrow" className="w-[20px] h-[20px] " />
              <span className="text-sm">Copy</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
