import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";
import UserContext from "../../utils/UserContext";
import { useContext } from "react";
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";
import { PostImage } from "./PostImage";
import { PostContent } from "./PostContent";
import { usePbFetchLike } from "../../Hooks/usePbFetchLike";
import { usePbFetchSinglePost } from "../../Hooks/usePbFetchSinglePost";

const Post = () => {
  const { postId } = useParams();
  const { loggedinUser, userInfo } = useContext(UserContext);
  const {
    post,
    loading: isPostLoading,
    error: postError,
  } = usePbFetchSinglePost(postId);
  const {
    netLikes,
    vote,
    isLoading: isLikesLoading,
    error: likesError,
    handleLike,
    refetch: fetchLikes,
  } = usePbFetchLike({
    postId,
    userId: userInfo?.id,
    loggedIn: !!loggedinUser,
  });

  // Loading state
  if (!!isPostLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (!!postError) {
    return <div>Error: {postError.message}</div>;
  }

  if (!!likesError) {
    return <div>Error: {likesError.message}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex bg-primary min-h-screen  min-w-[calc(100vw_-_6px)] justify-center text-primary-text pt-[10vh] md:pt-[15vh] md:pb-[10vh]">
        <div className="w-[100%] md:w-[55vw] h-fit flex flex-col gap-5 border-[1px] border-white/20  p-5 ">
          <PostHeader
            title={post?.title}
            username={post?.expand?.user?.username}
            updatedAt={post?.updated}
          />
          <PostActions
            netLikes={netLikes}
            vote={vote}
            isLoading={isLikesLoading}
            onLike={handleLike}
          />
          <PostImage
            collectionId={post?.collectionId}
            postId={post?.id}
            image={post?.image}
          />
          <PostContent text={post?.text} content={post?.content} />
        </div>
      </div>
    </>
  );
};

export default Post;
