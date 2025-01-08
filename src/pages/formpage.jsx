import { useState, useEffect, useContext, useRef } from "react";
import pb from "../../lib/pocketbase";
import UserContext from "../utils/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from "date-fns";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Editor from "../components/Editor";

const NewFormPage = () => {
  const [inputText, setInputText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dateSelected, setDateSelected] = useState(false);
  const [venue, setVenue] = useState("Online");
  const [venueDetails, setVenueDetails] = useState("");
  const [editorContent, setEditorContent] = useState(null);
  const editorRef = useRef(null);

  // const handleEditorSave = async () => {
  //   if (editorRef.current) {
  //     try {
  //       const content = await editorRef.current.save();
  //       setEditorContent(content.blocks);
  //     } catch (error) {
  //       console.error('Failed to save editor data:', error);
  //     }
  //   }
  // };
  const saveEditorContent = async () => {
    if (editorRef.current) {
      try {
        const content = await editorRef.current.save();
        return content;
      } catch (error) {
        console.error('Failed to save editor data:', error);
        return null;
      }
    }
    return null;
  };
  const navigate = useNavigate();
  let date;

  const { loggedinUser, userInfo } = useContext(UserContext);
  
  // const allTags = tagsList?.map((item) => item.label);

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
    setPhotoURL(null);
  };


  const formData = new FormData();

  const handlePost = async () => {
    // await handleEditorSave();
    if (inputText !== "" && title !== "") {
      setLoading(true);
      try {
        const content = await saveEditorContent();
        
        // await pb.collection('posts').create(formData);
        await pb.collection("posts").create({
          user: userInfo.id,
          title: title,
          text: inputText,
          tags: null,
          date: startDate,
          image: photo,
          venue: venue === "physical" ? venueDetails : venue,
          content: content.blocks,
        });

        // Clear the form after successful post
        setTitle("");
        setInputText("");
        setTags([]);
        setPhoto(null);
        setPhotoURL(null);
        setEditorContent(null);
      } catch (error) {
        console.error("Error creating post:", error);
      } finally {
        setLoading(false);
        navigate('/');
      }
    } else {
      alert("Cannot post empty fields!!");
    }
  };

  return (
    <>
    <Navbar search={false}/>
    <div className="flex justify-center items-center w-[calc(100vw-8px)] min-h-screen pt-20 pb-10 bg-primary-light">
      <div
        id="form"
        className="w-[70vw] md:w-[50vw] bg-primary-light p-3 text-primary-text font-medium shadow rounded-md"
      >
        <div className="flex flex-col items-center justify-start gap-4 mb-4">
          <input
            type="text"
            className="w-full border-[1px] border-white/10 rounded-md p-2 bg-primary-light focus:outline-none"
            placeholder="Title"
            value={title}
            rows="2"
            onChange={handleTitleChange}
          />
          <textarea
            type="text"
            className="w-full border-[1px] border-white/10 rounded-md resize-y ml-0 p-2 bg-primary-light focus:outline-none"
            placeholder="Start a post"
            value={inputText}
            rows="6"
            onChange={handleTextChange}
          />
          <div className="flex justify-between items-center w-full px-2">
            <span>Add This To Calendar</span>
            <button
              className={`mt-2 p-0 rounded-md`}
              onClick={() => setDateSelected(true)}
            >
              <DatePicker
                selected={startDate}
                placeholderText="Select Event Date"
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                maxDate={addMonths(new Date(), 5)}
                className="rounded-md border-[2px] font-medium bg-transparent p-5 w-full"
              />
            </button>
          </div>

          <div className="flex flex-col w-full px-2">
            <label className="mb-2">Venue</label>
            <select
              className="w-full border-[1px] border-white/10 rounded-md p-2 bg-primary-light focus:outline-none"
              onChange={(e) => setVenue(e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="physical">Physical</option>
            </select>
            {venue === "physical" && (
              <input
                type="text"
                className="w-full border-[1px] border-white/10 rounded-md p-2 bg-primary-light focus:outline-none mt-2"
                placeholder="Enter Venue"
                value={venueDetails}
                onChange={(e) => setVenueDetails(e.target.value)}
              />
            )}
          </div>
        </div>
        {photoURL && (
          <div className="mb-4">
            <img src={photoURL} alt="Selected" className="w-fit h-[25vh]" />
            <span
              className="text-red-600 text-md hover:text-red-700 cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </span>
          </div>
        )}
        <div className="flex justify-between px-2 pb-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 18"
            >
              <path
                fill="currentColor"
                d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
              />
            </svg>
          </label>
          <button onClick={handlePost} className="px-4 py-2 text-primary-text">
            {loading ? "Uploading.." : "Post"}
          </button>
        </div>
        <Editor editorRef={editorRef}/>
      </div>
    </div>
    </>
  );
};

export default NewFormPage;
