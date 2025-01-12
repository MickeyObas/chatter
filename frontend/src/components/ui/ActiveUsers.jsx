import { useState, useEffect } from 'react';
import profile from '../../assets/images/profile.png';
import { fetchWithAuth, getProfilePicture } from '../../utils';
import { useOnlineContacts } from '../../context/OnlineContactsContext';
import { BASE_URL } from '../../constants';
import { useContact } from '../../context/ContactContext';

function ActiveUser({contact}){

    return (
        <div className='w-9 h-9 flex-shrink-0 rounded-[50%] overflow-hidden outline-dotted outline-2 outline-offset-1 outline-blue-600'>
            <img src={getProfilePicture(contact.contact_user.profile_picture)} alt="" className='w-full h-full object-cover'/>
        </div>
    )
}

export default function ActiveUsers(){
    const { onlineContacts } = useOnlineContacts();
    const { loading } = useContact();

    // console.log("Online Users: ", onlineUsers);
    // console.log("Contacts: ", contacts);

    if(loading) return (
        <div className='flex self-start flex-col mt-6 h-[20%] w-full max-w-full'>
            <h1 className='text-[13px] font-semibold'>Active</h1>
            <div className='w-full'>
                <div className='flex mt-4 gap-x-3 w-full overflow-x-auto overflow-y-hidden px-2 pt-1 py-4'>
                    <div className='w-9 h-9 flex-shrink-0'>
                        <h1 className='h-full'>Loading...</h1>
                    </div>
                </div>
             </div>
             <hr className='mt-3 w-full'/>
        </div>
    )

    return (
        <div className='flex self-start flex-col mt-6 h-[20%] w-full max-w-full'>
            <h1 className='text-[13px] font-semibold'>Active</h1>
            <div className='w-full'>
                <div className='flex mt-4 gap-x-3 w-full overflow-x-auto overflow-y-hidden px-2 pt-1 py-4'>
                    {/* {Array(10).fill('_').map((user, idx) => (
                        <ActiveUser key={idx}/>
                    ))} */}
                    {onlineContacts.length > 0 ? (onlineContacts.map((contact, idx) => (
                        <ActiveUser key={idx} contact={contact}/>
                    ))) : (
                        <div className='h-9 flex w-full justify-center  flex-shrink-0 items-center'>
                            <h1 className='text-xs text-center h-full mt-4'>No Active Users</h1>
                        </div>
                    )}
                </div>
             </div>
             <hr className='mt-2 w-full'/>
        </div> 
    )
}