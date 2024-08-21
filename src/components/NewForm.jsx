import { useState, useEffect, useContext } from "react";
import pb from "../../lib/pocketbase";
import UserContext from "../utils/UserContext";

const NewForm = ({ refresh, setShowForm, tagsList }) => {
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const { loggedinUser, userId } = useContext(UserContext);

  const allTags = tagsList?.map((item) => item.label);

  useEffect(() => {
    if (photo) {
      const objectURL = URL.createObjectURL(photo);
      setPhotoURL(objectURL);
      // Clean up the object URL to avoid memory leaks
      return () => URL.revokeObjectURL(objectURL);
    }
  }, [photo]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleDelete = () => {
    setPhoto(null);
  };

  const handleTagChange = (e) => {
    const selectedTag = tagsList.find(tag => tag.label === e.target.value);
    if (selectedTag && !tags.some(tag => tag.id === selectedTag.id)) {
      setTags([...tags, selectedTag]);
    }
  };


  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // const incrementTagCounter = async (tag) => {
  //   try {
  //     // Check if the tag exists in the collection
  //     const existingTag = await pb.collection('tags').getFullList({
  //       filter: `label = "${tag.label}"`,
  //     });

  //     if (existingTag.length > 0) {
  //       // If the tag exists, increment its counter
  //       const tagId = existingTag[0].id;
  //       await pb.collection('tags').update(tagId, {
  //         label: existingTag[0].label,
  //         admin_tag: false,
  //         count: existingTag[0].count + 1,
  //       });
  //     } else {
  //       // If the tag doesn't exist, create a new tag with count 1
  //       await pb.collection('tags').create({
  //         label: tag.label,
  //         count: 1,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(`Error updating tag counter for ${tag.label}:`, error);
  //   }
  // };

  const formData = new FormData();

  const handlePost = async () => {
    formData.append('user', userId);
    formData.append('title', title);
    formData.append('text', inputText);
    formData.append('tags', ['6ghqimlfq5eglew']); // Include tags in formData
    if (photo) {
      formData.append('image', photo);
    }
    if (inputText !== '' && title !== '') {
      setLoading(true);
      try {
        await pb.collection('posts').create(formData);
        // Increment counters for each tag used
        // for (const tag of tags) {
        //   await incrementTagCounter(tag);
        // }
        // Clear the form after successful post
        setTitle('');
        setInputText('');
        setTags([]);
        setPhoto(null);
        setPhotoURL(null);
      } catch (error) {
        console.error("Error creating post:", error);
      } finally {
        setLoading(false);
        refresh();
      }
    } else {
      alert("Cannot post empty fields!!");
    }
  };

  return (
    <div className="flex justify-center items-center fixed w-screen h-screen bg-black/5" onClick={() => setShowForm(false)}>
      <div id="form" className='w-[30vw] bg-[#fafbfb] text-black font-medium shadow rounded-md' onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center justify-start mb-4">
          <input
            type="text"
            className='w-full p-2 bg-[#fafbfb] focus:outline-none rounded-t-md'
            placeholder="Title"
            value={title}
            rows='2'
            onChange={handleTitleChange}
          />
          <textarea
            type="text"
            className='w-full resize-y ml-0 p-2 bg-[#fafbfb] focus:outline-none'
            placeholder="Start a post"
            value={inputText}
            rows='6'
            onChange={handleTextChange}
          />
          <select
            className="w-full p-2 bg-[#fafbfb] focus:outline-none mt-2"
            onChange={handleTagChange}
          >
            <option value="">Select a tag</option>
            {allTags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <div key={index} className="bg-[#e2e2e6] px-3 py-1 rounded-full text-sm font-medium flex items-center">
                {tag.label}
                <span
                  className="ml-2 text-red-600 hover:text-red-700 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  &times;
                </span>
              </div>
            ))}
          </div>
        </div>
        {photoURL && (
          <div className="mb-4">
            <img src={photoURL} alt="Selected" className="w-full h-auto " />
            <span
              className="text-red-600 text-md hover:text-red-700 cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </span>
          </div>
        )}
        <div className="flex justify-between px-2 pb-2">
          <label className='flex items-center'>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
              <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
            </svg>
          </label>
          <button
            onClick={handlePost}
            className='px-4 py-2 text-white'
          >
            {loading ? "Uploading.." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewForm;
