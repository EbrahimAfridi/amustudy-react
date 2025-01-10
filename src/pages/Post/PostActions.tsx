import React from "react";
import clap from "../../assets/clap.svg";
import link from "../../../public/linkBlack.png";

export const PostActions = ({ netLikes, vote, onLike, onCopy }) => (
  <div className="flex items-center justify-between border-y-[1px] border-primary-dark">
    <div className="flex items-center">
      <img
        src={clap}
        alt="Clap Icon"
        className={`size-[40px] p-2 hover:rounded-full hover:bg-blue-600/40 cursor-pointer 
          ${vote === 1 ? "bg-blue-600 rounded-full" : ""}`}
        onClick={() => onLike(1)}
      />
      <span className="text-sm">{netLikes}</span>
    </div>
    <div
      onClick={onCopy}
      className="flex items-center gap-2 p-3 transition-all cursor-pointer"
    >
      <img src={link} alt="Share Icon" className="size-[20px]" />
      <span className="text-sm">Copy Link</span>
    </div>
  </div>
);
