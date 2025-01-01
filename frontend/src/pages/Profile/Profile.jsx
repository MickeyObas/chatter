import { useEffect, useState, useRef } from "react";
import Button from "../../components/form/Button"
import Input from "../../components/form/Input"

import { FaUser } from "react-icons/fa";
import { fetchWithAuth } from "../../utils";
import { BASE_URL } from "../../constants";
import userIcon from "../../assets/images/user.png";

function Profile() {

    const profilePicInputRef = useRef(null);
    const [profilePic, setProfilePic] = useState(userIcon);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});
    const [displayName, setDisplayName] = useState('');
    const [status, setStatus] = useState('');

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
            console.log(reader.result);
            console.log(file);
          };
          reader.readAsDataURL(file);
        }
      };

    const handleProfileUpload = async () => {
        if(!selectedFile) return;

        const formData = new FormData();
        formData.append('profilePic', selectedFile);

        try {
            const response = await fetchWithAuth(`${BASE_URL}/users/profile/update/`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(!response.ok){
                const error = await response.json();
                console.log("Whoops, the response was not okay.");
                console.log(error);
            } else{
                const data = await response.json();
                console.log(data);
            }

        } catch (err) {
            console.error("shitty", err);
        }
    }

    useEffect(() => {

        const getProfile = async () => {
            try{
                const response = await fetchWithAuth(`${BASE_URL}/users/profile/`);
                if(!response.ok){
                    console.log("Whoops, the response was not okay.");
                }else{
                    const data = await response.json();
                    setProfile(data);
                    console.log(data);
                }
            }catch(err){
                console.error("Error, ", err);
            }finally{
                setLoading(false);
            }
        };

        getProfile();

    }, []);

    if(loading) return <h1>Loading...</h1>

    return (
    <div className="w-[80%] py-8 px-7 flex flex-col">
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
                            value={displayName}
                            onChange={handleDisplayNameChange}
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