import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from '../../assets/images/search.png';
import { fetchWithAuth, getProfilePicture } from "../../utils";
import { BASE_URL } from "../../constants";
import defaultImageIcon from '../../assets/images/image.png';

function Groups() {
  const [groupChats, setGroupChats] = useState([]);
  const [selectedGroupChatId, setSelectedGroupChatId] = useState(''); 
  const selectedGroupChat = groupChats.find((groupChat) => groupChat.id === selectedGroupChatId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupChats = async () => {
      try {
        const response = await fetchWithAuth(`${BASE_URL}/chats/groups/`, {
          method: 'GET'
        });

        if(!response.ok){
          console.log("Could not fetch chats. Bad response");
        }else{
          const data = await response.json();
          console.log(data);
          setGroupChats(data);
        }
      } catch(err){
        console.error(err);
      }
    };

    fetchGroupChats();

  }, []);

  const handleGroupChatClick = (id) => {
    setSelectedGroupChatId(id);
  };

  const handleSendMessageClick = () => {
    navigate(`/groups/${selectedGroupChatId}/`);
  }


  return (
    <div className="flex w-[80%] h-full">
        <div className="w-[60%] flex flex-col px-3 py-4 border-e border-e-slate-300 h-full">
            <div className='flex justify-between items-center pb-2.5'>
                <h2 className='mb-2.5 h-4'>Groups</h2>
            </div>
            <div className='flex items-center border-[1.4px] px-2 py-0.5 rounded-lg w-full'>
                <img src={searchIcon} alt="" className='h-3'/>
                <input type="text" className='py-1 px-1.5 rounded-e-lg text-xs border-none outline-none w-full' placeholder='Search my groups'/>
            </div>
            {/* Groups Container */}
            <div className='flex flex-col mt-3.5 gap-y-2 overflow-y-auto px-1 h-full'>
            {groupChats && groupChats.map((groupChat, idx) => (
              <div 
                key={idx} 
                className={`flex items-center p-2 cursor-pointer  rounded-full ${groupChat.id === selectedGroupChatId ? 'bg-blue-500 text-white' : 'hover:bg-slate-200'}`}
                onClick={() => handleGroupChatClick(groupChat.id)}
                >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={getProfilePicture(groupChat.picture)} className="w-full h-full object-cover"/>
                </div>
                <div className="flex flex-col ms-2.5">
                  <h2 className="text-sm">{groupChat.title}</h2>
                  <p className="text-[10px]">{groupChat.description}</p>
                </div>
                <div className="bg-blue-500 w-6 h-6 rounded-[50%] flex justify-center items-center text-white ms-auto border border-white">
                  <h2 className="text-[10px]">99</h2>
                </div>
              </div>
            ))}
            </div>
        </div>
        <div className="w-[40%] flex flex-col pt-3">
        {selectedGroupChat ? (
          <>
          <h2 className="text-2xl text-center">Group Info</h2>
          <div className='flex flex-col gap-y-2 items-center mt-12'>
              <div className="w-32 h-32 flex items-center justify-center rounded-[50%] overflow-hidden bg-red-300">
                  <img src={getProfilePicture(selectedGroupChat.picture)} alt="Profile" className="w-[100%] h-[100%] object-cover"/>
              </div>
              <div className='font-semibold text-xl text-center px-4'>{selectedGroupChat.title}</div>
          </div>
          <div className='flex flex-col gap-y-2.5 mt-5 px-4'>
              <div className='bg-slate-200 py-1.5 px-3 rounded-lg h-[4em] max-h-[4em] overflow-y-auto flex items-center'>
                  <p className='text-xs py-1'>{selectedGroupChat.description}</p>
              </div>
              <div 
                  className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center mb-5 cursor-pointer hover:bg-slate-300'
                  
                  >
                  <div 
                    className='text-xs text-blue-500'
                    onClick={handleSendMessageClick}
                    >Send Message</div>
              </div>
              <div className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center cursor-pointer hover:bg-slate-300'>
                  <div className='text-xs'>Group Info</div>
              </div>
              <div className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center cursor-pointer hover:bg-slate-300'>
                  <div className='text-xs text-red-600'>Leave Group</div>
              </div>
          </div>
          </>
        ) : (
          <div className="h-full flex justify-center items-center">
            <p>Select a group chat to start chatting.</p>
          </div>
        )}
      </div>
  </div>
  )
}

export default Groups