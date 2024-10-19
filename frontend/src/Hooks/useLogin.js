import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {
 const [loading, setLoading] = useState(false);
 const { setAuthUser } = useAuthContext();

 const login = async({ username, password }) => {

    const success = handleInputErrors( username, password );
    if (!success) return;




    setLoading(true);
    try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        // Log the response to verify the structure
       // console.log('Server Response:', data);

        // Check if login was successful by verifying the existence of _id or other required fields
        if (data._id) {
            localStorage.setItem("chat-app", JSON.stringify(data));
            setAuthUser(data);
            toast.success("Login successful!");
        } else {
            toast.error(data.message || "Login failed");
        }

    } catch (error) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
 };

 return { loading, login };
};

export default useLogin;


function handleInputErrors(username, password) {
    if ( !username || !password ) {
        toast.error("Please fill in all the fields");
        return false;
    }
   

    return true;
}
