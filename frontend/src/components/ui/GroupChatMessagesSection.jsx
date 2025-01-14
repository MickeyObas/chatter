import React from 'react'
import { getProfilePicture } from '../../utils'
import { useNavigate } from 'react-router-dom';


function formatTime(dateString) {
    const date = new Date(dateString); // Parse the ISO string into a Date object
    let hours = date.getHours(); // Get hours (0-23)
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes (0-59) and pad with leading zero if needed
    const ampm = hours >= 12 ? 'pm' : 'am'; // Determine AM/PM
    hours = hours % 12 || 12; // Convert to 12-hour format, ensuring 12 remains 12 instead of 0
    return `${hours}:${minutes}${ampm}`; // Format the time
  }
  
  // Example usage:
  const isoDate = "2025-01-13T15:56:45.219198Z";
  console.log(formatTime(isoDate)); // Output: "3:56pm"
  

function GroupChatMessagesSection({groupChats}) {
    const navigate = useNavigate();

    const handleGroupChatMessageClick = (groupChatId) => {
        navigate(`/groups/${groupChatId}/`);
    }

  return (
    <div className='w-[32%] h-full'>
        <div className='py-4 px-3.5 border-b flex flex-col w-full'>
            <div className='flex w-full items-center flex-col py-[9px]'>
                <h1 className='text-center font-semibold text-[13px]'>Group Chats</h1>
                <p className='text-[10px]'>Your new messages from group chats will appear here.</p>
            </div>
        </div>
        {/* Messages */}
        <div className='flex-col max-h-[85%] overflow-auto w-full max-w-full'>
            {groupChats && groupChats.map((groupChat, idx) => (
                <div key={idx} 
                    className={`flex px-3 py-2.5 cursor-pointer hover:bg-slate-200 max-w-full`}
                    onClick={() => handleGroupChatMessageClick(groupChat.id)}
                    >
                    <div className='w-10 h-10 flex flex-shrink-0 justify-center items-center rounded-full overflow-hidden bg-slate-500 outline outline-1 outline-slate-400'>
                        <img src={getProfilePicture(groupChat.picture)} alt="" className='w-full h-full object-cover'/>
                    </div>
                    <div className='flex flex-col ms-2.5 w-[75%] max-w-[75%] overflow-hidden'>
                        <h1 className='text-[13px] font-medium groupchat-title-display'>{groupChat?.title}</h1>
                        {groupChat.latest_message && (
                            <div className='flex items-center w-full max-w-full overflow-hidden'>
                                <div className='text-[11px] font-semibold text-slate-500'>{groupChat?.latest_message?.sender?.split(" ")[0] + ": "}</div>
                                <p className='text-[11px] ms-1 groupchat-message-display'>{groupChat.latest_message.content}</p>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col ms-auto w-[15%]'>
                        <p className='text-[10px]'>{groupChat.latest_message ? formatTime(groupChat?.latest_message?.created_at) : formatTime(groupChat.created_at)}</p>
                        <div className='w-6 h-6 bg-green-500 rounded-full flex justify-center items-center ms-auto'>
                            <p className='text-[10px]'>99</p>
                        </div>
                    </div>
                </div>
            ))}
            {/* {Array(10).fill("").map((_, idx) => (
                <div key={idx} className='flex px-3 py-2.5'>
                    <div className='w-10 h-10 flex flex-shrink-0 justify-center items-center rounded-full overflow-hidden bg-slate-500'>hi</div>
                    <div className='flex flex-col ms-2.5'>
                        <h1 className='text-[13px] font-medium'>Group Chat Title</h1>
                        <p className='text-[10px]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis...</p>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-[10px]'>9:37am</p>
                        <div className='w-6 h-6 bg-green-500 rounded-full flex justify-center items-center ms-auto'>
                            <p className='text-[10px]'>99</p>
                        </div>
                    </div>
                </div>
            ))} */}
        </div>
    </div>
  )
}

export default GroupChatMessagesSection