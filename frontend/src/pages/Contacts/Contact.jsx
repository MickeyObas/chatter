import searchIcon from '../../assets/images/search.png';
import { IoMdStarOutline } from "react-icons/io";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, getProfilePicture } from '../../utils';
import { BASE_URL } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

function Contact() {

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContactId, setSelectedContactId] = useState(null);
    let selectedContact = contacts.find((contact) => contact.id === selectedContactId);
    const { user } = useAuth();
    const { setChat, setChatId } = useChat();

    const navigate = useNavigate();

    useEffect(() => {
        const getContacts = async () => {
            try{
                const response = await fetchWithAuth(`${BASE_URL}/contacts/`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok){
                    console.log("Contacts could not be fetched properly.")
                }else{
                    const data = await response.json();
                    setContacts(data);
                }
            }catch(err){
                console.error(err);
            }finally{
                setLoading(false);
            }
        };

        getContacts();

    }, [])

    const handleContactClick = (contactId) => {
        setSelectedContactId(contactId);
    }

    const handleSendMessageClick = async () => {
        // Get or create chat for contact 
        try {
            const response = await fetchWithAuth(`${BASE_URL}/chats/contact/${selectedContactId}/`, {
                method: 'GET',
            });

            if(!response.ok){
                console.log("Whoops")
            }else{
                const data = await response.json();
                // Set chat as context 
                setChat(data);
                localStorage.setItem('chat', JSON.stringify(data));
                // Set ChatID in context
                setChatId(data.id);
                localStorage.setItem('chatId', JSON.stringify(data.id));

                navigate('/');
            }

        } catch(err){
            console.error(err);
        }
    }

  return (
    <div className="flex w-[80%] h-full">
        <div className="w-[60%] flex flex-col px-3 py-4 border-e border-e-slate-300 h-full">
            <h2 className='mb-2.5'>Contacts</h2>
            <div className='flex items-center border-[1.4px] px-2 py-0.5 rounded-lg w-full'>
                <img src={searchIcon} alt="" className='h-3'/>
                <input type="text" className='py-1 px-1.5 rounded-e-lg text-xs border-none outline-none w-full' placeholder='Search my contacts'/>
            </div>
            {/* Contacts Container */}
            <div className='flex flex-col mt-3.5 gap-y-2 overflow-y-auto px-1 h-full'>
                {contacts.length === 0 && !loading && (
                    <div className='flex items-center justify-center h-full'>
                        <h1>No contacts yet.</h1>
                    </div>
                )}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    contacts.map((contact, idx) => (
                    <div 
                        key={idx} 
                        className={`flex items-center py-1.5 px-2.5 rounded-full cursor-pointer ${selectedContactId === contact.id ? 'bg-blue-500 text-white hover:bg-blue-500' : 'hover:bg-slate-100'}`}
                        onClick={() => handleContactClick(contact.id)}
                        >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-[50%] overflow-hidden ${selectedContactId === contact.id ? 'outline outline-[1.5px]' : ''}`}>
                            <img src={getProfilePicture(contact.contact_user.profile_picture)} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className='flex flex-col ms-2.5 w-[80%]'>
                            <div className='flex'>
                                <h2 className='text-sm'>{contact.contact_user.name}</h2>
                            </div>
                            <p className={`contact-status-text text-[10px] ${selectedContactId === contact.id ? 'text-slate-100' : 'text-slate-600'}`}>{contact.contact_user.status_text}</p>
                        </div>
                        <div className='w-7 h-7 border border-slate-300 rounded-full flex items-center justify-center ms-auto'>
                            <IoMdStarOutline size={"20px"}/>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
        <div className="w-[40%] flex flex-col py-3.5 px-3.5">
        <h1 className='text-2xl text-center'>Contact Info</h1>
            {selectedContact ? (
                <>
                    <div className='flex flex-col gap-y-2 items-center mt-12'>
                        <div className="w-32 h-32 flex items-center rounded-[50%] overflow-hidden">
                            <img src={getProfilePicture(selectedContact.contact_user.profile_picture)} alt="Profile" className="w-full h-full object-cover"/>
                        </div>
                        <div className='font-semibold text-xl'>{selectedContact.contact_user.name}</div>
                        <div>@{selectedContact.contact_user.email}</div>
                    </div>
                    <div className='flex flex-col gap-y-2.5 mt-5 px-4'>
                        <div className='bg-slate-200 py-3 px-3 rounded-lg h-[4em] max-h-[4em] overflow-y-auto flex items-center'>
                            <p className='text-xs py-1'>{selectedContact.contact_user.status_text}</p>
                        </div>
                        <div 
                            className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center mb-5 cursor-pointer hover:bg-slate-300'
                            onClick={handleSendMessageClick}
                            >
                            <div className='text-xs text-blue-500'>Send Message</div>
                        </div>
                        <div className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center cursor-pointer hover:bg-slate-300'>
                            <div className='text-xs'>Edit Contact</div>
                        </div>
                        <div className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center cursor-pointer hover:bg-slate-300'>
                            <div className='text-xs text-red-600'>Delete Contact</div>
                        </div>
                    </div>
                </>
            ) : (
                <div className='flex items-center justify-center h-full'>
                    <div className='text-center'>Select a contact to view their details.</div>
                </div>
            )}            
        </div>
    </div>
  )
}

export default Contact