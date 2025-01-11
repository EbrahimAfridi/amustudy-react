import { useState, useEffect } from "react";
import pb from "../../lib/pocketbase";
import useFetchLikes from "./useFetchLikes";

const useFetchData = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [showError, setShowError] = useState(false);
  const { fetchLikes } = useFetchLikes();

  const fetchData = async () => {
    try {
      // Fetch posts
      const postList = await pb.collection("posts").getFullList({
        // filter: 'created >= "2022-01-01 00:00:00"',
        sort: "-created",
        expand: "user, tags",
      });

      setPosts(postList);
      // Fetch events
      const eventList = await pb.collection("posts").getList(1, 10, {
        filter: 'date != ""',
        sort: "-created",
      });

      setEvents(eventList.items);

      // Fetch likes for each post
      // const updatedPosts = [];

      // // Loop through each post and fetch likes sequentially
      // for (let post of postList) {
      //   try {
      //     const netLikes = await fetchLikes(post.id);
      //     post = { ...post, netLikes }; // Create a new object with updated netLikes
      //   } catch (error) {
      //     console.error(`Error fetching likes for post ${post.id}:`, error);
      //     post = { ...post, netLikes: 0 }; // Default to 0 netLikes on error
      //   }
      //   updatedPosts.push(post); // Push updated post to the array
      // }
      // // Update state with the array of updated posts
      // setPosts(updatedPosts);
      // setShowError(false);

      
      setShowError(false);
    } catch (error) {
      setShowError(true);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { posts, setPosts, events, showError };
};

export default useFetchData;
