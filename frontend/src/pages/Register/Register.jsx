import { useState } from "react";
import { BASE_URL } from "../../constants";
import Input from "../../components/form/Input";
import Button from "../../components/form/Button";

// Toast Notification
import { Bounce, ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export function Register(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState({
        email: '',
        password: '',
        password2: '',
        firstName: '',
        lastName: ''
    });
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let isValid = true;
        if(password !== password2){
            setError((prev) => ({...prev, password2: 'Passwords do not match'}));
            isValid =  false;
        }

        return isValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validate()){
            return;
        };

        setError({
            email: '',
            password: '',
            password2: '',
            firstName: '',
            lastName: ''
        });
        
        const formDetails = {
            'email': email.trim(),
            'password': password,
            'first_name': firstName.trim(),
            'last_name': lastName.trim()
        };

        setLoading(true);

        const response = await fetch(`${BASE_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDetails)
        });

        setLoading(false);

        try {
            if(!response.ok){
                const error = await response.json();

                if(error.email){
                    setError({...error, email: error.email[0]});
                }
                if(error.password){
                    setError({...error, password: error.password[0]});
                }
                if(error.first_name){
                    setError({...error, firstName: error.first_name[0]});
                }
                if(error.last_name){
                    setError({...error, lastName: error.last_name[0]});
                }

                throw new Error('Something went wrong with the registration request.');
            }else{
                const data = await response.json();

                setEmail('');
                setPassword ('');
                setPassword2('');
                setFirstName('');
                setLastName(''); 

                displayRegSuccessToast();
            }
        } catch (err) {
            console.error(err);
        }
    }


    const RegisterSuccessMsg = ({ closeToast, toastProps }) => (
    <div>
        <p className="text-[13px]">Your account registration was successful. Please check your email for a confirmation link.</p>
    </div>
    );

    const displayRegSuccessToast = () => {
        toast.success(RegisterSuccessMsg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
    }

    return (
        <div className="flex h-screen">
            <ToastContainer />
            <div className="w-1/2 bg-blue-400 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-1.5">Register</h1>
                <h1>on <span className="underline decoration-blue-700 underline-offset-2 text-lg text-black">Chatter</span></h1>
                <p className="text-13px text-white mt-10 u">Already have an account? <a href="/login" className="underline decoration-blue-700 underline-offset-2 cursor-pointer hover:text-blue-400 hover:bg-white">Login</a> instead</p>
            </div>
            <div className="flex items-center justify-center bg-blue-200 w-1/2">
                <form 
                    className="flex flex-col border p-5 bg-white rounded-md gap-y-4 w-1/2 shadow-lg"
                    onSubmit={handleSubmit}
                    >
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
                        label={'First Name'}
                        type="text"
                        placeholder="Enter your first name"
                        required={true}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input 
                        label={'Last Name'}
                        type="text"
                        placeholder="Enter your last name"
                        required={true}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <Input 
                        label={'Password'}
                        type="password"
                        placeholder="Enter your password"
                        required={true}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input 
                        label={'Confirm Password'}
                        type="password"
                        placeholder="Re-type your password"
                        required={true}
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        errorMessage={error.password2 ? error.password2 : ''}
                    />
                    <Button 
                        type="submit" 
                        text="Register"
                        loading={loading}
                        />
                </form>
            </div>
        </div>
    )
}