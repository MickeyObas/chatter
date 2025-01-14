import { getProfilePicture, fetchWithAuth } from "../../utils"
import v_dots from '../../assets/images/v-dots2.png';
import Input from "../form/Input";
import Button from "../form/Button";
import { useState } from "react";
import { BASE_URL } from "../../constants";


function GroupInboxHeader({groupChat}) {
    const [showGroupChatOptions, setShowGroupChatOptions] = useState(false);
    const [error, setError] = useState('');
    const [contactToAdd, setContactToAdd] = useState('');

    const handleCancelClick = () => {
        setShowGroupChatOptions(false);
    };

    const handleOptionsClick = () => {
        setShowGroupChatOptions(true);
    };

    const handleContactToAddChange = (e) => {
        setContactToAdd(e.target.value);
        setError('');
    };

    const addContactToGroupClick = async () => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(!emailRegex.test(contactToAdd.trim())){
                setError('Please enter a valid email address.');
                return;
            };
    
            try {
                const response = await fetchWithAuth(`${BASE_URL}/chats/groups/${groupChat.id}/add-contact/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'email': contactToAdd
                    })
                });
    
                if(!response.ok){
                    console.log("Contact was NOT added to group");
                }else{
                    const data = await response.json();
                    if(data.error){
                        setError(data.error);
                    }else{
                        setContactToAdd('');
                    }
                }
            } catch(err){
                console.error(err);
            }
        };

    const handleKeyPress = (e) => {
        if(e.key === 'Enter'){
            addContactToGroupClick();
        }
    }

  return (
    <div className='flex flex-col'>
        <div className='py-4 border-b flex items-center px-3.5'>
            <div className='h-12 w-12 rounded-full overflow-hidden'>
                <img src={getProfilePicture(groupChat?.picture)} alt="" className='w-full h-full object-cover'/>
            </div>
            <div className='flex flex-col'>
                <div className='flex'>
                    <div className='flex flex-col'>
                        <h2 className='text-lg font-semibold ms-4'>{groupChat?.title}</h2>
                        {/* <h3 className='text-[11px]'>@{chat?.user?.email.split('@')[0]}</h3> */}
                    </div>
                    
                </div>
            </div>
            <div className='ms-auto flex gap-x-2 relative'>
                <button className='border border-slate-300 text-[11px] py-1.5 px-2.5 rounded-lg'>Archive</button>
                {/* <button 
                    className='text-white text-[11px] py-1.5 px-2.5 rounded-lg bg-blue-700'
                    >View Group Info</button> */}
                <img 
                    src={v_dots} 
                    alt="" 
                    className='h-4 cursor-pointer'
                    onClick={handleOptionsClick}    
                    />
                {showGroupChatOptions && (
                    <div
                    className='absolute w-72 top-0 -left-[200px] bg-slate-100 rounded-lg flex flex-col pt-2.5 px-1.5 z-10'
                    >
                        <div className='flex'>
                            <Input 
                            customClass='text-xs'
                            value={contactToAdd}
                            onChange={handleContactToAddChange}
                            onKeyPress={handleKeyPress}
                            />
                            <Button 
                                text='Cancel'
                                customClass='text-xs ms-1 bg-red-500 hover:bg-red-400'
                                onClick={handleCancelClick}
                            />
                            <Button 
                                text='Add'
                                customClass='text-xs ms-1'
                                onClick={addContactToGroupClick}
                            />
                        </div>
                        <div>
                            {error ? (
                                <h1 className='text-[10px] text-red-500 mt-1.5'>{error}</h1>
                            ) : (
                                <h1 className='text-[10px] mt-1.5'>Enter an email address.</h1>
                            )}
                        </div>
                    <div>
                    </div>
                </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default GroupInboxHeader