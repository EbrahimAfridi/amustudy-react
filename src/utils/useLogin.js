import { useContext, useState, useCallback } from "react";
import pb from "../../lib/pocketbase";
import UserContext from "./UserContext";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(pb.authStore.isValid);
  const { setLoggedinUser } = useContext(UserContext);
  

  const handleSubmit = useCallback(async (e) => {

    e.preventDefault();
    const email = e.nativeEvent.target[0].value;
    const password = e.nativeEvent.target[1].value;
    
    setEmail(email);
    setPassword(password);

    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      if (authData) {
        setLogin(pb.authStore.isValid);
        setLoggedinUser(pb.authStore.model.username);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // Clear the form fields only after the auth process is done
      setEmail("");
      setPassword("");
    }
  }, [setLoggedinUser]);

  const handleOauth = useCallback(async () => {
    try {
      const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
      if (authData) {
        setLogin(pb.authStore.isValid);
        setLoggedinUser(pb.authStore.model.username);
      }
    } catch (error) {
      console.log(error);
    }
  }, [setLoggedinUser]);


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