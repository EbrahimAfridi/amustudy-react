import React from "react";
import { formatDistanceToNow } from "date-fns";
import userBlack from "../../../public/user-black.png";

export const PostHeader = ({ title, username, updatedAt }) => (
  // <div className="flex flex-col gap-5">
  <>
    <h1 className="font-bold tracking-tight text-[32px] sm:text-[42px]">
      {title}
    </h1>
    <div className="flex gap-5 items-center mb-4 pb-2">
      <div className="flex items-center justify-center size-[40px] border-[1px] border-gray-500 rounded-full">
        <img src={userBlack} className="w-[24px]" alt="User avatar" />
      </div>
      <div className="flex flex-col">
        <span className="font-normal">{username}</span>
        <p className="text-sm">
          {updatedAt
            ? formatDistanceToNow(new Date(updatedAt)) + " ago"
            : "N/A"}
        </p>
      </div>
    </div>
  </>
  // {/* </div> */}
);
