import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import { RecordModel } from "pocketbase";

interface UsePbFetchSinglePostReturn {
  post: any;
  loading: boolean;
  error: Error | null;
}

export const usePbFetchSinglePost = (
  postId: string
): UsePbFetchSinglePostReturn => {
  const [post, setPost] = useState<RecordModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    
    const fetchPost = async () => {
      setLoading(true);
      try {
        const record = await pb.collection("posts").getOne(postId, {
          expand: "user",
        });
        setPost(record);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  return { post, loading, error };
};