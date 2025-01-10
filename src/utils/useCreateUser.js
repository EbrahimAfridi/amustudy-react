import pb from "../../lib/pocketbase";

export default function useCreateUser(){
    
    
    
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
           
            
            // console.log('User created successfully');
        }catch(error){
            console.log(error);
        }
    }

    async function oauthSignup(){

        try{
            const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
            const meta = authData.meta;

            if (meta.isNew) {
              const formData = new FormData();
          
            //   const response = await fetch(meta.avatarUrl);
          
              formData.append('avatarUrl', meta.avatarUrl);
            //   if (response.ok) {
            //     const file = await response.blob();
            //     formData.append('avatar', file);
            //   }
          
              formData.append('name', meta.name);
          
              await pb.collection('users').update(authData.record.id, formData);
            }
            
        }catch(error){
            console.log(error);
        }
    }
    return {createUser,oauthSignup};
} 