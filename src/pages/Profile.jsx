import Navbar from "../components/Navbar";
import { useContext, useState, useEffect } from "react";
import UserContext from "../utils/UserContext";
import pb from "../../lib/pocketbase";
import { useNavigate } from "react-router-dom";


export default function Profile() {
  const {loggedinUser, userInfo} = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  
  const navigate = useNavigate();
  // console.log(username);


  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {};

    if (username !== userInfo.username) {
      updatedData.username = username;
    }

    if (name !== userInfo.name) {
      updatedData.name = name;
    }

    if (photo) {
      updatedData.avatar = photo;
    }
    // console.log(updatedData);
    if (Object.keys(updatedData).length > 0){

      try{
        await pb.collection('users').update(userInfo.id, updatedData);
      }catch(error){
        console.error(error);
      }finally{
        navigate('/');
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setName(userInfo.name);
    }
  }, [userInfo]);

  useEffect(() => {
      if (photo) {
        const objectURL = URL.createObjectURL(photo);
        setPhotoURL(objectURL);
        // Clean up the object URL to avoid memory leaks
        return () => URL.revokeObjectURL(objectURL);
      }
    }, [photo]);

  return (
    <>
    <Navbar />
    <div className="w-screen min-h-screen pt-[15vh] bg-primary text-primary-text p-4">
      <form className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Username
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      amustudy.netlify.app/
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      name="username"
                      id="username"
                      autoComplete="username"
                      className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                  id="name"
                  autoComplete="name"
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Photo
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      {userInfo?.avatarUrl ? (
                        <img
                        src={userInfo.avatarUrl}
                        alt="Profile Image"
                        className="h-full w-full object-cover"></img>
                      ) : userInfo?.avatar ? (
                        <img
                        src={`https://amustud.pockethost.io/api/files/${userInfo.collectionId}/${userInfo.id}/${userInfo.avatar}`}
                        alt="Profile Image"
                        className="h-full w-full object-cover"></img>
                      ): photoURL ?(
                        <img
                        src={photoURL}
                        alt="Profile Image"
                        className="h-full w-full object-cover"></img>
                      ):(
                        <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      )}
                    </span>
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden "
                        />
                        <span className="cursor-pointer ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Change
                        </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button   
              onClick={handleUpdate}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
    </>
  );
}
