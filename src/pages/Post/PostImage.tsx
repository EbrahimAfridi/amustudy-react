import React from "react";
import { POCKET_API_URL } from "../../constants/urls";

export const PostImage = ({ collectionId, postId, image }) =>
  !!image ? (
    <img
      src={`${POCKET_API_URL}${collectionId}/${postId}/${image}`}
      alt="Post"
      className="w-full h-auto rounded-lg"
      loading="lazy"
    />
  ) : null;
