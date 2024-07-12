import { createContext, useEffect, useState } from 'react';
import pb from '../../lib/pocketbase';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedinUser, setLoggedinUser] = useState('');
  const [ userId, setUserId ] = useState('');

  const updateLoggedinUser = () => {
    if (pb.authStore.model) {
      setLoggedinUser(pb.authStore.model.username);
      setUserId(pb.authStore.model.id);
    } else {
      setLoggedinUser({});
    }
  };

  useEffect(()=>{
    updateLoggedinUser();
  },[])

  return (
    <UserContext.Provider value={{ loggedinUser, userId, setLoggedinUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;