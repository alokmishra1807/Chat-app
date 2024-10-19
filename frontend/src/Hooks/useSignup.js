
import { useState } from 'react';
import toast from 'react-hot-toast'; 
import { useAuthContext } from '../context/AuthContext';

const useSignup = () => {
    const [Loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const signup = async ({ fullName, username, password, confirmedPassword, gender }) => {
        
        const success = handleInputErrors({ fullName, username, password, confirmedPassword, gender });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ fullName, username, password, confirmedPassword, gender })
            });

            const data = await res.json();
            console.log('Server Response:', data);

            if (data._id) {
                localStorage.setItem("chat-app", JSON.stringify(data));
                setAuthUser(data);
                toast.success("Login successful!");
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {

            console.log(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { Loading, signup };
};

export default useSignup;


function handleInputErrors({ fullName, username, password, confirmedPassword, gender }) {
    if (!fullName || !username || !password || !confirmedPassword || !gender) {
        toast.error("Please fill in all the fields");
        return false;
    }
    if (password !== confirmedPassword) {
        toast.error("Passwords didn't match");
        return false;
    }
    if (password.length < 6) {
        toast.error("Password must have at least 6 characters");
        return false;
    }

    return true;
}
