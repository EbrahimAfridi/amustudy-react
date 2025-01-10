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
        console.error("Failed to save editor data:", error);
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
        navigate("/");
      }
    } else {
      alert("Cannot post empty fields!!");
    }
  };

  return (
    <>
      <Navbar search={false} />
      <div className="flex justify-center items-center w-screen min-h-screen px-3 pt-20 pb-10 bg-primary text-primary-text  font-medium">
        <div id="form" className="sm:p-3 sm:w-[60%]">
          <div className="flex flex-col items-center justify-start gap-4 mb-4">
            <input
              type="text"
              className="w-full border-[1px] border-white/10 rounded-md sm:pl-[40px] p-2  text-[42px]  focus:border-transparent focus:ring-transparent"
              placeholder="Title"
              value={title}
              rows="2"
              onChange={handleTitleChange}
            />
            <textarea
              type="text"
              className="w-full border-[1px] border-white/10 rounded-md resize-y sm:pl-[40px] p-2 focus:border-transparent focus:ring-transparent"
              placeholder="Short Description"
              value={inputText}
              rows="1"
              onChange={handleTextChange}
            />

            {photoURL ? (
              <div className="mb-4">
                <img
                  src={photoURL}
                  alt="Selected"
                  className="w-full max-h-[60vh] rounded-lg"
                />
                <span
                  className="text-red-600 text-md hover:text-red-700 cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete
                </span>
              </div>
            ) : (
              <label className="w-full flex justify-center items-center">
              <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
              <div className="cdx-button w-full flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <rect
                    width="14"
                    height="14"
                    x="5"
                    y="5"
                    stroke="currentColor"
                    strokeWidth="2"
                    rx="4"
                  ></rect>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"
                  ></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.7778 9.33331H13.7867"
                  ></path>
                </svg>{" "}
                Select an Image
              </div>
              </label>
            )}

            <Editor editorRef={editorRef} />

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
                  className="rounded-md border-[2px] font-medium bg-transparent p-5 w-full  focus:border-black focus:ring-black"
                />
              </button>
            </div>

            <div className="flex flex-col w-full px-2">
              <label className="mb-2">Venue</label>
              <select
                className="w-full border-[1px] border-white/10 rounded-md p-2 bg-primary-light  focus:border-transparent focus:ring-transparent"
                onChange={(e) => setVenue(e.target.value)}
              >
                <option value="Online">Online</option>
                <option value="physical">Physical</option>
              </select>
              {venue === "physical" && (
                <input
                  type="text"
                  className="w-full border-[1px] border-white/10 rounded-md p-2 bg-primary-light  focus:border-transparent focus:ring-transparent mt-2"
                  placeholder="Enter Venue"
                  value={venueDetails}
                  onChange={(e) => setVenueDetails(e.target.value)}
                />
              )}
            </div>

            {/* {photoURL ? (
          <div className="mb-4">
            <img src={photoURL} alt="Selected" className="w-fit h-[25vh]" />
            <span
              className="text-red-600 text-md hover:text-red-700 cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </span>
          </div>
        ): null}
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
          </label> */}
            <button
              onClick={handlePost}
              className="w-[40%] px-4 py-2 text-primary bg-secondary hover:bg-secondary/90 rounded-lg mt-20"
            >
              {loading ? "Uploading.." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewFormPage;
