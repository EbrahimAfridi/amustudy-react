import { useState, useEffect } from "react";
import pb from "../../lib/pocketbase";

interface UseLikesProps {
  postId: string;
  userId?: string;
  loggedIn: boolean;
}

interface UseLikesReturn {
  netLikes: number;
  vote: number | null;
  isLoading: boolean;
  error: Error | null;
  handleLike: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to manage post likes and user votes
 * @param postId - The ID of the post
 * @param userId - Optional user ID
 * @returns Object containing likes data and management functions
 */

export const usePbFetchLike = ({
  postId,
  userId,
  loggedIn,
}: UseLikesProps): UseLikesReturn => {
  const [netLikes, setNetLikes] = useState<number>(0);
  const [vote, setVote] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLikes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch total likes for the post
      const records = await pb?.collection("post_likes")?.getFullList({
        filter: `postId = "${postId}"`,
      });

      // Fetch user's existing vote if userId is provided
      if (userId) {
        const existingRecords = await pb?.collection("likes")?.getFullList({
          filter: `postId = "${postId}" && userId = "${userId}"`,
        });

        setVote(existingRecords?.length > 0 ? existingRecords[0]?.like : null);
      }

      setNetLikes(records.length > 0 ? records[0].netLikes : 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch likes"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchLikes();
    }
  }, [postId, userId]);

  const handleLike = async () => {
    if (!loggedIn || !userId) {
      setError(new Error("Please login to like posts"));
      return;
    }

    setIsLoading(true);

    try {
      // Optimistic update
      const currentVote = vote;
      const currentLikes = netLikes;

      // Check existing like
      const existingRecords = await pb.collection("likes").getFullList({
        filter: `postId = "${postId}" && userId = "${userId}"`,
      });

      if (existingRecords.length > 0) {
        // User already liked - remove like
        setVote(null);
        setNetLikes((prev) => prev - 1);
        await pb.collection("likes").delete(existingRecords[0].id);
      } else {
        // Add new like
        setVote(1);
        setNetLikes((prev) => prev + 1);
        await pb.collection("likes").create({
          postId,
          userId,
          like: 1,
        });
      }

      await fetchLikes(); // Refresh to ensure sync with server
    } catch (err) {
      // Revert optimistic updates on error
      setError(err instanceof Error ? err : new Error("Failed to update like"));
      await fetchLikes();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    netLikes,
    vote,
    isLoading,
    error,
    handleLike,
    refetch: fetchLikes,
  };
};
