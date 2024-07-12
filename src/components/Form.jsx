import { useState, useEffect } from "react";
import pb from "../../lib/pocketbase";
import UserContext from "../utils/UserContext";
import { useContext } from "react";

const Form = ({refresh}) => {
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [ loading, setLoading ] = useState(false);

  const { loggedinUser, userId } = useContext(UserContext);

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
  }
  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleDelete = () => {
    setPhoto(null);
  }

  const formData = new FormData();
  
  const handlePost = async () => {
    
    formData.append('user', userId);
    formData.append('title', title);
    formData.append('text', inputText);
    if (photo) {
      formData.append('image', photo);
    }
    if( inputText !== '' && title !== ''){

      setLoading(true);
      try {
        const record = await pb.collection('posts').create(formData);
        // Clear the form after successful post
        setTitle('');
        setInputText('');
        setPhoto(null);
        setPhotoURL(null);
      } catch (error) {
        console.error("Error creating post:", error);
      } finally{
        setLoading(false)
        refresh()
      }
    }else{
      alert("Cannot post empty fields!!");
    }
  };

  return (
    <div className={`mt-[15vh] p-4 mr-5 bg-[#fafbfb] text-black font-medium rounded-lg shadow ${loggedinUser === '' ? 'cursor-not-allowed' : 'cursor-auto'}`}>
      <div className="flex flex-col items-center space-x-4 mb-4">
      <input
          type="text"
          className={`w-full py-2 ml-4 bg-[#fafbfb]  rounded-lg focus:outline-none ${loggedinUser === '' ? 'cursor-not-allowed' : 'cursor-auto'}`}
          placeholder="Title"
          value={title}
          rows='2'
          onChange={handleTitleChange}
        />
        <textarea
          type="text"
          className={`w-full resize-y py-2 bg-[#fafbfb]  rounded-lg focus:outline-none ${loggedinUser === '' ? 'cursor-not-allowed' : 'cursor-auto'}`}
          placeholder="Start a post"
          value={inputText}
          rows='2'
          onChange={handleTextChange}
        />
      </div>
      {photoURL && (
        <div className="mb-4">
          <img src={photoURL} alt="Selected" className="w-full h-auto rounded-lg" />
          <span 
            className="text-red-600 text-md hover:text-red-700 cursor-pointer"
            onClick={handleDelete}
        >
            Delete
        </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <label className={`flex items-center space-x-2 ${loggedinUser === '' ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
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
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg  ${loggedinUser === '' ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-blue-600'}`}
        >
          {loading ? "Uploading.." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default Form;