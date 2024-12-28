import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  Input  from "../../components/form/Input";
import  Button  from "../../components/form/Button";
import { BASE_URL } from "../../constants";
import { useAuth } from "../../context/AuthContext.jsx";


import axiosInstance from "../../axios";

export function Login(){
    const { setUser } = useAuth();

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({
        email: '',
        password: '',
        credentials: ''
    });
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validate = () => {
        let isValid = true;

        if(!email){
            setError((prev) => ({...prev, email: 'Please enter your email address'}));
            isValid = false;
        }else{
            if(!emailRegex.test(email)){
                setError((prev) => ({...prev, email: 'Please enter a valid email address'}));
                isValid = false;
            }else{
                setError((prev) => ({...prev, email: ''}));
            }
        };

        if(!password){
            setError((prev) => ({...prev, password: 'Please enter your password'}));
            isValid = false;
        }else{
            setError((prev) => ({...prev, password: ''}));
        };;

        return isValid
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validate()){
            console.log(error)
            return false;
        };

        setLoading(true);

        const loginDetails = {
            email: email,
            password: password
        };

        try {
            const response = await fetch(`${BASE_URL}/login/`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(loginDetails)
            });

            setLoading(false);

            if(response.status !== 200){
                const err = await response.json();
                console.log(err);
                setError((prev) => ({...prev, credentials: err.error}));
            }else{
                console.log(response.headers.get('X-CSRFToken'));
                setError((prev) => ({...prev, credentials: ''}));
                const data = await response.json();
                // if(data.access){
                if(data.user){
                    setUser(data.user);
                    alert(`Welcome ${data.user.first_name} ${data.user.last_name}. TEHAHAHAHAHAHAHAHAHAHAHAHAHA`);
                    const from = location.state?.from || '/';
                    navigate(from);
                }else{
                    confirm("Ship")
                }
            }

        }catch(err){
            setLoading(false);
            console.error(err);
        }
    };

    return (
        <div className="flex h-screen">
            <div className="flex items-center justify-center bg-blue-200 w-1/2">
                <form 
                    className="flex flex-col border p-5 bg-white rounded-md gap-y-4 w-1/2 shadow-lg"
                    onSubmit={handleSubmit}
                    >
                    {error.credentials && <p className="text-[13px] text-red-500">{error.credentials}</p>}
                    <Input 
                        label={'Email'}
                        type="email"
                        placeholder="Enter your email address"
                        required={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        errorMessage={error.email ? error.email : ''}
                    />
                    <Input 
                        label={'Password'}
                        type="password"
                        placeholder="Enter your password"
                        required={true}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        errorMessage={error.password ? error.password : ''}
                    />
                    <Button 
                        type="submit" 
                        text="Login"
                        loading={loading}
                        onClick={handleSubmit}
                        />
                </form>
            </div>
            <div className="w-1/2 bg-blue-400 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-1.5">Login</h1>
                <h1>to <span className="underline decoration-blue-700 underline-offset-2 text-lg">Chatter</span></h1>
                <p className="text-13px text-white mt-10 u">Don't have an account yet? <a href="/register" className="underline decoration-blue-700 underline-offset-2 cursor-pointer hover:text-blue-400 hover:bg-white">Register</a> instead</p>
            </div>
        </div>
    )
}