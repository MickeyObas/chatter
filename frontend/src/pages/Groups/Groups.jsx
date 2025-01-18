import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from '../../assets/images/search.png';
import { fetchWithAuth, formatDate, getProfilePicture } from "../../utils";
import { BASE_URL } from "../../constants";
import defaultImageIcon from '../../assets/images/image.png';
import cameraIcon from '../../assets/images/camera.png';
import { useChat } from "../../context/ChatContext";
import Button from '../../components/form/Button';
import { useContact } from "../../context/ContactContext";

// Toast Notification
import { Slide, Bounce, ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useOnlineContacts } from "../../context/OnlineContactsContext";


function Groups() {
  const { groupChats, setGroupChats } = useChat(); 
  const { contacts } = useContact();
  const [selectedGroupChatId, setSelectedGroupChatId] = useState(''); 
  const selectedGroupChat = groupChats.find((groupChat) => groupChat.id === selectedGroupChatId);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState(1);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [newGroupPicture, setNewGroupPicture] = useState(cameraIcon);
  const groupPictureInputRef = useRef(null);

  const zeroUnreadMessagesGroupChats = groupChats.filter((groupChat) => groupChat.unread_messages_count === 0);

  const nonZeroUnreadMessagesGroupChats = groupChats.filter((groupChat) => groupChat.unread_messages_count > 0);


  const GroupCreatedMessage = ({ closeToast, toastProps }) => (
    <div>
        <p className="text-[13px]">Your new group has been created.</p>
    </div>
    );

  const displayGroupCreatedToast = () => {
    toast.success(GroupCreatedMessage, {
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

  const navigate = useNavigate();

  const handleGroupChatClick = (id) => {
    setSelectedGroupChatId(id);
  };

  const handleSendMessageClick = () => {
    navigate(`/groups/${selectedGroupChatId}/`);
  };

  const handleCreateGroupClick = () => {
    setShowCreateGroupModal(true);
  };

  const handleCancelClick = () => {
    setShowCreateGroupModal(false);
    setNewGroupName('');
    setSelected([]);
  }

  const handleContinueClick = () => {
    if(selected.length === 0) return;
    setStep(2);
  }

  const handleContactNewGroupClick = (e) => {
    const contactDiv = e.target.closest('.contact');
    const checkbox = contactDiv.querySelector('input');
    const value = checkbox.value;
    
    setSelected((prev) => {
      if(prev.includes(value)){
        checkbox.checked = false;
        return prev.filter((item) => item !== value);
      }else{
        checkbox.checked = true;
        return [...prev, value];
      }
    })
  }

  // const handleCheckboxChange = (e) => {
  //   const {value, checked} = e.target;
    
  //   setSelected((prev) => checked ? [...prev, value] : prev.filter((item) => item !== value));
  // };

  const handleGroupNameChange = (e) => {
    setNewGroupName(e.target.value);
  }

  const handleNewGroupPictureClick = () => {
    groupPictureInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
        setNewGroupPicture(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGroupUpload = async () => {
    const formData = new FormData();
    if(!newGroupName) return;

    if(selectedFile){
      formData.append('picture', selectedFile);
    };

    formData.append('title', newGroupName);
    formData.append('members', selected);

    try {
      const response = await fetchWithAuth(`${BASE_URL}/chats/groups/`, {
        method: 'POST',
        body: formData
      });

      if(!response.ok){
        console.log("Could not create new group.");
      }else{
        const data = await response.json();
        displayGroupCreatedToast();
        setGroupChats((prev) => [data, ...prev])
        setShowCreateGroupModal(false);
        setNewGroupName('');
        setSelected([]);
        setStep(1);
      }
    }catch(err){
      console.error(err);
    }

  }

  console.log(selected);

  return (
    <div className="flex w-[80%] h-full relative">
      <ToastContainer />
        <div className="w-[60%] flex flex-col border-e border-e-slate-300 h-full"> {/* px-3 py-4 */}
          {showCreateGroupModal && (
            <div className="contact-modal-overlay absolute w-full h-full flex items-center justify-center">
            {step === 1 ? (
              <div className="w-[40%] h-[88%] bg-white shadow-lg rounded-lg">
              <div className="flex flex-col">
                <div className="flex justify-between items-center px-2.5">
                  <h5 
                    className="text-xs text-slate-400 cursor-pointer"
                    onClick={handleCancelClick}
                    >Cancel</h5>
                  <h2 className="text-center mt-1.5">Add members</h2>
                  <h5 
                    className={`text-xs ${selected.length === 0 ? 'cursor-no-drop' : 'cursor-pointer' }`}
                    onClick={handleContinueClick}
                    >Continue</h5>
                </div>
                <p className="text-center text-[10px]">{selected.length}/{contacts.length}</p>
                <div className="px-3 mt-2.5">
                  <div className='flex items-center border-[1.4px] px-2 py-0.5 rounded-lg w-full'>
                    <img src={searchIcon} alt="" className='h-3'/>
                    <input type="text" className='py-1 px-1.5 rounded-e-lg text-xs border-none outline-none w-full' placeholder='Search my contacts'/>
                  </div>
                </div>
                <div className="flex flex-col mt-2 max-h-[68vh] overflow-auto">
                  {contacts?.length > 0 ? contacts?.map((contact, idx) => (
                    <div 
                      key={idx} className="contact flex items-center py-2.5 px-4 cursor-pointer"
                      onClick={handleContactNewGroupClick}
                      >
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img src={getProfilePicture(contact?.contact_user?.profile_picture)} alt="" className="w-full h-full object-cover"/>
                      </div>
                      <div className="flex flex-col ms-2">
                        <h2 className="text-xs font-medium">{contact?.contact_user.name}</h2>
                        <p className="text-[10px] text-slate-400">{contact.contact_user.status_text}</p>
                      </div>
                      <div className="ms-auto">
                        <input 
                          type="checkbox" 
                          value={contact.contact_user.id} 
                          className="check scale-110 cursor-pointer"
                          // onChange={handleCheckboxChange}
                          readOnly={true}
                          checked={selected.includes(contact.contact_user.id.toString())}
                          />
                      </div>
                    </div>
                  )) : (
                    <div className="">No contacts available.</div>
                  )}
                </div>
              </div>
            </div>
            ) : (
              <div className="w-[40%] h-[88%] bg-white shadow-lg rounded-lg">
              <div className="flex flex-col">
                <div className="flex justify-between items-center px-2.5">
                  <h5 
                    className="text-xs text-slate-400 cursor-pointer"
                    onClick={() => setStep(1)}
                    >Back</h5>
                  <h2 className="text-center mt-1.5">New Group</h2>
                  <h5 
                    className={`text-xs cursor-pointer ${selected.length === 0 && 'cursor-no-drop'}`}
                    onClick={handleGroupUpload}
                    >Create</h5>
                </div>
                <div className="flex mt-2 px-2.5 py-3 bg-slate-200">
                  <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center relative">
                    <img 
                      src={newGroupPicture} 
                      alt=""
                      className={`${selectedFile ? 'w-full h-full object-cover' : 'w-1/2'}`}
                      />
                      <div 
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        onClick={handleNewGroupPictureClick}
                        >
                        <input 
                          type="file"  
                          accept="image/*" 
                          className="hidden"
                          ref={groupPictureInputRef}
                          onChange={handleFileChange}
                          />
                      </div>  
                   </div>
                  <input
                    type="text" 
                    placeholder="Group name"
                    className="text-xs border-none outline-none bg-slate-200 ms-2.5"
                    onChange={handleGroupNameChange}
                    />
                </div>
                <div className="flex flex-col p-1.5 mt-3">
                  <h2 className="text-xs">Members: {selected.length}</h2>
                  <div className="flex mt-2.5 flex-wrap gap-3 w-[90%] mx-auto">
                    {contacts && contacts.filter((contact) => selected.includes(contact.contact_user.id.toString())).map((contact, idx) => (
                      <div key={idx} className="flex flex-col items-center w-12">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex justify-center items-center outline outline-blue-500 outline-[0.5px]">
                          <img 
                            src={getProfilePicture(contact.contact_user.profile_picture)} 
                            alt=""
                            className="w-full h-full object-cover" 
                            />
                        </div>
                        <h3 className="text-[10px] new-group-member-name">{contact.contact_user.name}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
          )}
            <div className='flex justify-between items-center px-3 py-4'>
                <h2 className='mb-2.5 h-4'>Groups</h2>
                <Button 
                  text="Create Group"
                  customClass="text-xs"
                  onClick={handleCreateGroupClick}
                />
            </div>
            <div className="px-3.5">
              <div className='flex items-center border-[1.4px] px-2 py-0.5 rounded-lg w-full'>
                  <img src={searchIcon} alt="" className='h-3'/>
                  <input type="text" className='py-1 px-1.5 rounded-e-lg text-xs border-none outline-none w-full' placeholder='Search my groups'/>
              </div>
            </div>
            {/* Groups Container */}
            <div className='flex flex-col mt-3.5 gap-y-1.5 overflow-y-auto px-3.5 max-h-[80vh] overflow-hidden'>
            {groupChats.length > 0 ? [...nonZeroUnreadMessagesGroupChats, ...zeroUnreadMessagesGroupChats].map((groupChat, idx) => (
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
                {groupChat.unread_messages_count > 0 && (
                  <div className={`bg-blue-500 w-6 h-6 rounded-[50%] flex justify-center items-center  ms-auto border ${selectedGroupChatId === groupChat.id ? 'bg-white text-black border-black' : 'text-white border-white'}`}>
                  <h2 className="text-[10px]">{groupChat.unread_messages_count}</h2>
                </div>
                )}
              </div>
            )) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-[16px] mt-3 text-slate-300">Whoops, you're not a member of any group.</p>
              </div>
            )}
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
              <div className='bg-slate-200 py-1.5 px-3 rounded-lg h-[4em] max-h-[4em] overflow-y-auto flex items-center justify-center'>
                  <p className='text-xs py-1 text-center'>{selectedGroupChat.description || 'This group does not have a description.'}</p>
              </div>
              <div 
                  className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center mb-5 cursor-pointer hover:bg-slate-300'
                  onClick={handleSendMessageClick}
                  >
                  <div 
                    className='text-xs text-blue-500'
                    >Send message to group</div>
              </div>
              <div className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center cursor-pointer hover:bg-slate-300'>
                  <div className='text-xs'>Group Info</div>
              </div>
              <div className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center cursor-pointer hover:bg-slate-300'>
                  <div className='text-xs text-red-600'>Leave Group</div>
              </div>
          </div>
          </>
        ) : groupChats.length === 0 ? (
          <div className="h-full flex justify-center items-center text-slate-300">
            <p>Why not start your very own?</p>
          </div>
        ) : (
          <div className="h-full flex justify-center items-center text-slate-300">
            <p>Select a group chat to start chatting.</p>
          </div>
        )}
      </div>
  </div>
  )
}

export default Groups;