import { useState } from "react";
import pb from "../../lib/pocketbase";

export default function useCreateUser(){
    const [userName, setUserName] = useState(null);
    
    
    async function createUser(email,username,password,passwordConfirm){
        try{
            const data = {
                "username": `${username}`,
                "email": `${email}`,
                "emailVisibility": true,
                "password": `${password}`,
                "passwordConfirm": `${passwordConfirm}`,
                "name": ""
            }
            const record = await pb.collection('users').create(data);
            const authData = await pb.collection('users').authWithPassword(email, password);
            if (authData){
                // console.log(pb.authStore.model.username);
                setUserName(pb.authStore.model.username);
            }
            
            console.log('User created successfully');
        }catch(error){
            console.log(error);
        }
    }

    async function oauthSignup(){

        try{
            const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
            if (authData){
                // console.log(pb.authStore.model.username);
                setUserName(pb.authStore.model.username);
            }
        }catch(error){
            console.log(error);
        }
    }
    return {createUser,oauthSignup, userName};
} 