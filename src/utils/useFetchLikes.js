import pb from "../../lib/pocketbase";

const useFetchLikes = () => {
  const fetchLikes = async (postId) => {
    try {
      const likes = await pb.collection("likes").getFullList({
        filter: `postId = "${postId}"`,
      });
      return likes.length;
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      return 0;
    }
  };

  return { fetchLikes };
};

export default useFetchLikes;