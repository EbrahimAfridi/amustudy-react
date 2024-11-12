// import Form from "./components/Form";
import { useState, useEffect, useContext } from "react";
import pb from "../lib/pocketbase";
import Navbar from "./components/Navbar";
// import { formatDistanceToNow } from "date-fns";
import Chevron from "../public/chevron.png";
import { useNavigate } from "react-router-dom";
import UserContext from "./utils/UserContext";
import NewForm from "./components/NewForm";
import image from "../public/159886.jpg";
import Plus from "../public/plus-black.png";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [tags, setTags] = useState([]);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const { loggedinUser, userInfo, updateLoggedinUser } = useContext(UserContext);
  // const userId = userInfo.id;
  // console.log(userId);
  const handleShowForm = () => {
    setShowForm(true);
  };

  const fetchLikes = async (postId) => {
    try {
      const records = await pb.collection("post_likes").getFullList({
        filter: `postId = "${postId}"`,
      });

      if (records.length !== 0) {
        return records[0].netLikes;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleReaction = async (postId, likeValue) => {
  //   if (loggedinUser !== "") {
  //     try {
  //       // Optimistically update local state
  //       const updatedPosts = posts.map((post) =>
  //         post.id === postId
  //           ? { ...post, netLikes: post.netLikes + likeValue }
  //           : post
  //       );
  //       setPosts(updatedPosts);

  //       // Check if the user has already reacted with the same type
  //       const existingRecords = await pb.collection("likes").getFullList({
  //         filter: `postId = "${postId}" && userId = "${userId}"`, // never forget: "${variableName}"
  //       });

  //       if (existingRecords.length > 0) {
  //         // User has already reacted with the same type, delete the reaction
  //         const recordId = existingRecords[0].id;
  //         await pb.collection("likes").delete(recordId);
  //       } else {
  //         // Create a new reaction
  //         await pb.collection("likes").create({
  //           like: likeValue,
  //           userId: userId,
  //           postId: postId,
  //         });
  //       }
  //       // Refresh the likes count for the post
  //       const netLikes = await fetchLikes(postId);
  //       const finalUpdatedPosts = posts.map((post) =>
  //         post.id === postId ? { ...post, netLikes } : post
  //       );
  //       setPosts(finalUpdatedPosts);
  //     } catch (error) {
  //       console.log(error);
  //       // Revert optimistic UI update on error
  //       const revertedPosts = posts.map((post) =>
  //         post.id === postId
  //           ? { ...post, netLikes: post.netLikes - likeValue }
  //           : post
  //       );
  //       setPosts(revertedPosts);
  //     }
  //   } else {
  //     alert("You need to login to vote on the post.");
  //   }
  // };

  const postsList = async () => {
    try {
      const resultList = await pb.collection("posts").getList(
        1,
        10,
        {
          filter: 'created >= "2022-01-01 00:00:00"',
          sort: "-created",
          expand: "user, tags",
        },
        { requestKey: null }
      );

      // Update posts state with fetched data
      setPosts(resultList.items);

      // Initialize an array to store updated posts
      const updatedPosts = [];

      // Loop through each post and fetch likes sequentially
      for (let post of resultList.items) {
        try {
          const netLikes = await fetchLikes(post.id);
          post = { ...post, netLikes }; // Create a new object with updated netLikes
        } catch (error) {
          console.error(`Error fetching likes for post ${post.id}:`, error);
          post = { ...post, netLikes: 0 }; // Default to 0 netLikes on error
        }
        updatedPosts.push(post); // Push updated post to the array
      }

      // Update state with the array of updated posts
      setPosts(updatedPosts);
      setShowError(false);
    } catch (error) {
      setShowError(true);
      console.error("Error fetching posts:", error);
    }
  };

  const tagsList = async () => {
    try {
      const records = await pb.collection("tags").getFullList({
        sort: "-created",
      });
      setTags(records);
    } catch (error) {
      console.log("Tags Error: ", error);
    }
  };

  
  useEffect(() => {
    postsList();
    tagsList();
    updateLoggedinUser();
  }, []);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <>
      <Navbar />
      {showForm && (
        <NewForm
          refresh={postsList}
          setShowForm={setShowForm}
          tagsList={tags}
        />
      )}
      <main className="min-h-screen w-[calc(100vw_-_6px)] flex flex-col sm:flex-row sm:items-start items-center bg-[#0e1116] text-white pb-[10vh]">
        {/* <h1 className="font-bold text-3xl pt-10">AMUStudy</h1> */}

        {/* <Form refresh={postsList}/> */}
        <div className="flex flex-col gap-5 items-start mx-10 w-[90%] sm:w-[60%] mt-[15vh] rounded-md ">
          <div className="flex justify-between items-center w-full pt-[5vh]">
            <h1 className="text-[1.7rem] font-bold">Recent Posts</h1>
            <button className={`bg-white h-fit ${loggedinUser === '' ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => {
              if (loggedinUser !== ''){
                handleShowForm();
              }
            }}>
              <img src={Plus} />
            </button>
          </div>
          <div className="flex flex-wrap gap-5 text-sm font-bold">
            {showError && (
              <h1>Soemthing&apos;s wrong please comeback later!</h1>
            )}
            {posts.map((post, index) => (
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
                          <span key={index} className="w-fit border-[1px] border-[#6a7180] text-[#6a7180] px-3 py-1 rounded-lg text-xs font-medium ">
                            #{item.label}
                          </span>
                        )
                        )
                        }
                      <p className="text-[#6a7180] mb-4 px-2 pt-3 text-sm font-medium">
                        {/* {formatDistanceToNow(new Date(post.created))} ago •{" "} */}
                        <span className="font-medium">
                          {post?.expand?.user?.username}
                        </span>
                      </p>
                    </div>
                    {/* <p className="mb-4 text-left px-2">{post.text.slice(0, 300)}</p> */}
                    {post.image !== '' ? (
                      <div className="w-full h-[25vh] overflow-hidden flex items-center rounded-lg">
                        <img src={`https://amustud.pockethost.io/api/files/${post.collectionId}/${post.id}/${post.image}`} alt="Post" className=" " />
                      </div>
                    ) : (
                      <img
                        src={image}
                        className="rounded-xl mt-5 md:w-fit w-[40%]"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-[#282b35] text-[#6a7180] font-bold w-fit rounded-xl">
                    <img
                      src={Chevron}
                      className="w-[40px] rotate-[90deg] p-2 rounded-md hover:bg-[#e2e2e6] cursor-pointer"
                      // onClick={() => handleReaction(post.id, 1)}
                    />

                    <span>{post.netLikes}</span>
                    <img
                      src={Chevron}
                      className="w-[40px] rotate-[-90deg] p-2 rounded-md hover:bg-[#e2e2e6] cursor-pointer"
                      // onClick={() => handleReaction(post.id, -1)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-10">
          {/* <Form refresh={postsList}/> */}

          <div className="flex flex-col items-start  sm:h-[30vh] mx-3 md:mr-5 mt-[15vh] rounded-md border-[1px] border-[#1c1f26] px-5">
            <h1 className="text-[1.7rem] font-bold pt-[5vh] mb-5">Top Tags</h1>
            <div className="flex flex-wrap">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between w-full sm:w-1/3 px-2 mb-4"
                >
                  <span className="px-3 py-1 rounded-full text-sm font-medium">
                    {tag.label}
                  </span>
                  <span className="text-sm pl-0">{tag.count}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
}
