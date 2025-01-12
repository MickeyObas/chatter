import { useEffect, useState, useRef } from "react";
import Button from "../../components/form/Button"
import Input from "../../components/form/Input"

import { FaUser } from "react-icons/fa";
import { fetchWithAuth, getProfilePicture } from "../../utils";
import { BASE_URL } from "../../constants";
import userIcon from "../../assets/images/user.png";
import { useParams } from "react-router-dom";


// Toast Notification
import { Slide, Bounce, ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useOnlineContacts } from "../../context/OnlineContactsContext";

function Profile() {
    const { userId } = useParams();
    const { onlineUserz } = useOnlineContacts();
    const isOnline = onlineUserz?.includes(parseInt(userId));
    console.log(isOnline);

    const profilePicInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});
    const [profilePic, setProfilePic] = useState(userIcon);
    const [displayName, setDisplayName] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const getOwnerProfile = async () => {
            try{
                const response = await fetchWithAuth(`${BASE_URL}/users/profile/`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok){
                    console.log("Whoops, the response was not okay.");
                }else{
                    const data = await response.json();
                    setProfile(data);
                    setDisplayName(data.display_name || '');
                    setStatus(data.status_text || '');
                    setProfilePic(
                        data.profile_picture ? `${BASE_URL.replace('/api', '')}${data.profile_picture}` : userIcon
                    );
                }
            }catch(err){
                console.error("Error, ", err);
            }finally{
                setLoading(false);
            }
        };

        if(!userId){
            getOwnerProfile();
        }

    }, [userId]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetchWithAuth(`${BASE_URL}/users/${userId}/`);

                if(!response.ok){
                    const error = await response.json();
                    console.error(error);
                }else{
                    const data = await response.json();
                    setProfile(data);
                }
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
        };

        if(userId){
            fetchProfileData();
        }

    }, [userId])

    const ProfileUpdateMessage = ({ closeToast, toastProps }) => (
        <div>
            <p className="text-[13px]">Your profile has been updated.</p>
        </div>
        );

    const displayProfileUpdateToast = () => {
        console.log("Sending toast");
        toast.success(ProfileUpdateMessage, {
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

    const handleDisplayNameChange = (e) => {
        setDisplayName(e.target.value);
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    }

    const handleProfilePicClick = () => {
        profilePicInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
            setProfilePic(reader.result); 
          };
          reader.readAsDataURL(file);
        }
      };

    const handleProfileUpload = async () => {

        const formData = new FormData();

        if(selectedFile){
            formData.append('profile_picture', selectedFile);
        };

        formData.append('display_name', displayName);
        formData.append('status_text', status);

        try {
            const response = await fetchWithAuth(`${BASE_URL}/users/profile/update/`, {
                method: 'PATCH',
                body: formData,
            });

            if(!response.ok){
                const error = await response.json();
                console.log("Whoops, the response was not okay.");
                console.log(error);
            } else{
                const data = await response.json();
                displayProfileUpdateToast();
            }

        } catch (err) {
            console.error("shitty", err);
        }
    }

    if(loading) return <h1>Loading...</h1>

    if(userId){
        return (
            <div className="w-[80%] h-full flex flex-col bg-slate-50">
                <div className="h-[35%] mb-20">
                    <div className="h-full relative bg-blue-400 bg-gradient-to-r from-[#667db6] via-[#0082c8] to-[#667db6]  flex justify-center">
                        <div className="w-40 h-40 rounded-[50%] absolute -bottom-20 border border-slate-500 bg-white overflow-hidden">
                            <img src={getProfilePicture(profile.profile_picture)} alt="" className="w-full h-full object-cover"/>
                        </div>
                    </div>
                </div>
                {isOnline ? (
                    <div className='w-fit self-center mt-2 rounded-full bg-white border-[1.5px] border-slate-300 flex items-center justify-center text-[10px] px-1 text-slate-700 ms-2 gap-x-2'>
                    <div className='bg-green-600 w-1.5 h-1.5 rounded-full'></div>
                    <h2>Online</h2>
                </div>
                ) : (
                    <div className='w-fit self-center mt-2 rounded-full bg-white border-[1.5px] border-slate-300 flex items-center justify-center text-[10px] px-1 text-slate-700 ms-2 gap-x-2'>
                    <div className='bg-red-600 w-1.5 h-1.5 rounded-full'></div>
                    <h2>Offline</h2>
                </div>
                )}
                <div className="flex flex-col items-center pt-3 gap-y-2">
                    <h1 className="font-semibold text-2xl">{profile.name}</h1>
                    <h1>@{profile.email.split('@')[0]}</h1>
                    <div className="w-2/3">
                        <p className="text-xs text-center">{profile.status_text}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
    <div className="w-[80%] py-8 px-7 flex flex-col">
        <ToastContainer />
        <h2 className="text-2xl">Profile Details</h2>
        <hr className="w-full mt-1"/>
        <div className="flex justify-between">
            <div className="w-[65%]">
                {/* Main Profile Fields */}
                <div className="flex flex-col mt-6 gap-y-5">
                    <div>
                        <Input 
                            label="Email"
                            customClass="w-4/5"
                            value={profile.email}
                            disabled={true}
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Your email address cannot be changed here. See <a href="" className="text-blue-500">help</a> for more information.</p>
                    </div>
                    <div>
                        <Input 
                            label="Name"
                            customClass="w-4/5"
                            value={profile.name}
                            disabled={true}
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Your name cannot be changed here. Please change display name instead.</p>
                    </div>
                    <div>
                        <Input 
                            label="Display Name"
                            customClass="w-4/5"
                            onChange={handleDisplayNameChange}
                            value={displayName}
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Your name may appear around Chatter where you contribute or are mentioned. You can change it at any time.</p>
                    </div>
                    <div>
                        <Input 
                            label="Status"
                            customClass="w-4/5"
                            value={status}
                            onChange={handleStatusChange}
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Write a short bio, status, or perhaps a quote you live by.</p>
                    </div>
                </div>
                <Button 
                    text="Update Profile"
                    customClass="mt-5 text-sm"
                    onClick={handleProfileUpload}
                />
            </div>
            <div className="w-[30%] py-8 px-7 flex flex-col">
            <h1 className="text-sm">Profile Picture</h1>
                <div className="profile-picture-container mt-5">
                    <img src={profilePic} alt="Profile Picture" className="profile-picture" />
                    <div className="overlay">
                        <button 
                        className="change-button"
                        onClick={handleProfilePicClick}
                        >Change</button>
                    </div>
                    <input 
                        type="file" 
                        id="profile-pic-input" 
                        accept="image/*" 
                        className="hidden"
                        ref={profilePicInputRef}
                        onChange={handleFileChange}
                        />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile