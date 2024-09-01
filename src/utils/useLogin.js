import { useContext, useState } from "react";
import pb from "../../lib/pocketbase";
import UserContext from "./UserContext";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(pb.authStore.isValid);
  const { setLoggedinUser } = useContext(UserContext);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail(e.nativeEvent.target[0].value);
    setPassword(e.nativeEvent.target[1].value);

    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      if (authData){
          setLogin(pb.authStore.isValid);
          setLoggedinUser(pb.authStore.model.username);
      }
    } catch (error) {
      console.log(error);
    }
  
    
    
    setEmail("");
    setPassword("");
  };
  
  const handleOauth = async ()=> {
    try{
      const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
      if (authData){
        setLogin(pb.authStore.isValid);
        setLoggedinUser(pb.authStore.model.username);
      }
    }catch(error){
      console.log(error);
    }

  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    login,
    setLogin,
    handleSubmit,
    handleOauth,
  };
};

export default useLogin;