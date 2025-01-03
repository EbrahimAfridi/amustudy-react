import { createContext, useEffect, useState } from 'react';
import pb from '../../lib/pocketbase';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedinUser, setLoggedinUser] = useState('');
  const [ userInfo, setUserInfo ] = useState(null);

  const updateLoggedinUser = () => {
    if (pb.authStore.model) {
      setLoggedinUser(pb.authStore.model.username);
      setUserInfo(pb.authStore.model);
    } else {
      setLoggedinUser('');
      setUserInfo();
    }
  };

  useEffect(()=>{
    updateLoggedinUser();
  },[])

  return (
    <UserContext.Provider value={{ loggedinUser, userInfo, setLoggedinUser, updateLoggedinUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;