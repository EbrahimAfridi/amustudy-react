import React from 'react';
import { FaCheck } from 'react-icons/fa';

export const renderHeader = (element, index) => {
  return (
    <h1 key={`POST_HEADER_${index}`} className="font-bold text-3xl text-black">
      {element?.data?.text}
    </h1>
  );
};

export const renderParagraph = (element, index) => {
  return (
    <p
      key={`${element?.data?.text}_${index}`}
      className="py-5 text-[18px] sm:text-[20px] text-primary-post font-source -tracking-[0.009em] leading-[32px]"
    >
      {element?.data?.text}
    </p>
  );
};

export const renderListItems = (items) => {
  return items?.map((item, index) => (
    <li key={`LIST_ITEM_${index}`} className="mb-1">
      {item?.content}
    </li>
  ));
};

export const renderUnorderedList = (element, index) => (
  <ul
    key={`UNORDERED_LIST_ITEM_${index}`}
    className="list-disc list-inside text-lg text-gray-700 pl-4"
  >
    {renderListItems(element?.data?.items)}
  </ul>
);

export const renderOrderedList = (element, index) => (
  <ol
    key={`ORDERED_LIST_ITEM_${index}`}
    className="list-decimal list-inside text-lg text-gray-700 pl-4"
  >
    {renderListItems(element?.data?.items)}
  </ol>
);

export const renderChecklistItem = (item, index) => (
  <li key={`CHECKLIST_ITEM_${index}`} className="flex items-center gap-2 mb-1">
    {item?.meta?.checked ? (
      <FaCheck className="text-green-500" />
    ) : (
      <div className="size-4 rounded border-gray-400" />
    )}
    <span>{item?.content}</span>
  </li>
);

export const renderChecklist = (element, index) => (
  <ul key={`CHECK_LIST_${index}`} className="text-lg text-gray-700 pl-4">
    {element?.data?.items?.map((item, index) =>
      renderChecklistItem(item, index)
    )}
  </ul>
);

// Content type to renderer mapping
export const contentRenderers = {
  header: renderHeader,
  paragraph: renderParagraph,
  list: (element, index) => {
    const listRenderers = {
      unordered: renderUnorderedList,
      ordered: renderOrderedList,
      checklist: renderChecklist,
    };
    return listRenderers[element?.data?.style]?.(element, index);
  },
};

// Main content renderer
export const renderContent = (element, index) => {
  const renderer = contentRenderers[element?.type];
  return renderer ? renderer(element, index) : null;
};