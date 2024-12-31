import { useEffect, useState } from "react";
import Button from "../../components/form/Button"
import Input from "../../components/form/Input"

import { FaUser } from "react-icons/fa";
import { fetchWithAuth } from "../../utils";
import { BASE_URL } from "../../constants";

function Profile() {

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});

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
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Your name may appear around Chatter where you contribute or are mentioned. You can change it at any time.</p>
                    </div>
                    <div>
                        <Input 
                            label="Status"
                            customClass="w-4/5"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Write a short bio, status, or perhaps a quote you live by.</p>
                    </div>
                </div>
                <Button 
                    text="Update Profile"
                    customClass="mt-5 text-sm"
                />
            </div>
            <div className="w-[32%] py-8 px-7 flex flex-col">
                <h1>Profile picture</h1>
                <div className="flex items-center justify-center border border-slate-500 w-[165px] h-[165px] py-5 rounded-full mt-5">
                    <FaUser size={"120px"} color={"#94a3b8"}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile