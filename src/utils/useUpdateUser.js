import { useContext, useState, useCallback } from "react";
import pb from "../../lib/pocketbase";
import UserContext from "./UserContext";


const useUpdateUser = () => {
    const { userInfo } = useContext(UserContext);

    const handleUserUpdate = async () => {
        const data = {
            "username": "test_username_update",
            "emailVisibility": false,
            "password": "87654321",
            "passwordConfirm": "87654321",
            "oldPassword": "12345678",
            "name": "test",
            "avatarUrl": "https://example.com"
        };
        
        const record = await pb.collection('users').update(userInfo.id, {
            "username": "test_username_update",
            "emailVisibility": false,
            "password": "87654321",
            "passwordConfirm": "87654321",
            "oldPassword": "12345678",
            "name": "test",
            "avatarUrl": "https://example.com"
        });
    }
}