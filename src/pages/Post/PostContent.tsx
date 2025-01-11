import React from "react";
import { renderContent } from "./contentRenderers";

export const PostContent = ({ text, content }) => (
  <>
    {text ? (
      <div className="py-5 text-[18px] sm:text-[20px] text-primary-post -tracking-[0.009em] leading-[32px]">
        {text}
      </div>
    ) : null}
    {content?.map(renderContent) ?? null}
  </>
);
