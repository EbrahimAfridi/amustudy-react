import React from "react";

export const PostActions = ({ netLikes, vote, onLike }) => {
  const handleCopy = () => {
    const url = window.location.href;
    // Use the Clipboard API to copy the URL to the clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!"); // TODO: @Sharjeel-Afridi Add a toast notification
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="flex items-center justify-between border-y-[1px] border-primary-dark">
      <div className="flex items-center">
        <img
          src={"/src/assets/clap.svg"}
          alt="Clap Icon"
          className={`size-[40px] p-2 hover:rounded-full hover:bg-blue-600/40 cursor-pointer 
          ${vote === 1 ? "bg-blue-600 rounded-full" : ""}`}
          onClick={() => onLike(1)}
        />
        <span className="text-sm">{netLikes}</span>
      </div>
      <div
        onClick={handleCopy}
        className="flex items-center gap-2 p-3 transition-all cursor-pointer"
      >
        <img src={"/linkBlack.png"} alt="Share Icon" className="size-[20px]" />
        <span className="text-sm">Copy Link</span>
      </div>
    </div>
  );
};
