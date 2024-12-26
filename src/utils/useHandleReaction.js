import { useContext } from "react";
import pb from "../../lib/pocketbase";
import UserContext from "../utils/UserContext";

const useHandleReaction = (posts, setPosts) => {
  const { loggedinUser, userInfo } = useContext(UserContext);

  const handleReaction = async (postId, likeValue) => {
    if (loggedinUser !== "") {
      try {
        const updatedPosts = posts.map((post) =>
          post.id === postId
            ? { ...post, netLikes: post.netLikes + likeValue }
            : post
        );
        setPosts(updatedPosts);

        const existingRecords = await pb.collection("likes").getFullList({
          filter: `postId = "${postId}" && userId = "${userInfo.id}"`,
        });

        if (existingRecords.length > 0) {
          const recordId = existingRecords[0].id;
          await pb.collection("likes").delete(recordId);
        } else {
            await pb.collection("likes").create({
                like: likeValue,
                userId: userInfo.id,
                postId: postId,
          });
        }
      } catch (error) {
        console.error("Error handling reaction:", error);
      }
    }
  };

  return { handleReaction };
};

export default useHandleReaction;