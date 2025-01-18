import searchIcon from '../../assets/images/search.png';
import { IoMdStarOutline } from "react-icons/io";
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, getProfilePicture } from '../../utils';
import { BASE_URL } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useContact } from '../../context/ContactContext';
import Button from '../../components/form/Button';
import Input from '../../components/form/Input';

// Toast Notification
import { Slide, Bounce, ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useOnlineContacts } from "../../context/OnlineContactsContext";

function Contact() {
    const { contacts, loading, setContacts } = useContact();
    const [selectedContactId, setSelectedContactId] = useState(null);
    let selectedContact = contacts.find((contact) => contact.id === selectedContactId);
    const { user } = useAuth();
    const { setChat, setChatId } = useChat();

    const [showAddContactDropdown, setShowAddContactDropdown] = useState(false);
    const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
    const [contactToAdd, setContactToAdd] = useState('');
    const [error, setError] = useState('');
    const [addingContactLoading, setAddingContactLoading] = useState(false);

    const navigate = useNavigate();

    const ContactAddedMessage = ({ data }) => (
        <div>
            <p className="text-[11px]">User "{data?.user}" has been added to your contacts.</p>
        </div>
        );
    
      const displayContactAddedToast = (contact) => {
        toast.success(ContactAddedMessage, {
            data: {
              user: contact,
            },
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
        }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter'){
            addContactClick();
        }
    }

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
    };

    const handleAddContactClick = () => {
        setShowAddContactDropdown(!showAddContactDropdown);
    }

    const handleContactToAddChange = (e) => {
        setContactToAdd(e.target.value);
        setError('');
    }

    const handleCancelClick = () => {
        setShowAddContactDropdown(false);
        setContactToAdd('');
        setError('');
    }

    const addContactClick = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(contactToAdd.trim())){
            setError('Please enter a valid email address.');
            return;
        };

        try {
            const response = await fetchWithAuth(`${BASE_URL}/contacts/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': contactToAdd
                })
            });

            if(!response.ok){
                console.log("Contact was NOT added");
            }else{
                const data = await response.json();
                if(data.error){
                    setError(data.error);
                }else{
                    setContacts(data.contacts);
                    displayContactAddedToast(contactToAdd);
                    setContactToAdd('');
                }
            }
        } catch(err){
            console.error(err);
        }
    };

    const handleDeleteContactButtonClick = () => {
        setShowDeleteContactModal(true);
    };

    const handleCancelDeleteContactClick = () => {
        setShowDeleteContactModal(false);
    };

    const handleDeleteContact = async () => {
        const response = await fetchWithAuth(`${BASE_URL}/contacts/${selectedContactId}/`, {
            method: 'DELETE'
        });

        if(!response.ok){
            console.log("Whoops, could not delete contact.");
        }else{
            setContacts((prev) => prev.filter((contact) => contact.id !== selectedContactId));
            setShowDeleteContactModal(false)
        }
    }

  return (
    <div className="flex w-[80%] h-full">
        <ToastContainer />
        <div className="w-[60%] flex flex-col px-3 py-4 border-e border-e-slate-300 h-full">
            <div className='flex justify-between items-center pb-2.5'>
                <h2 className='mb-2.5 h-4'>Contacts</h2>
                <div className='relative'>
                    <Button 
                        text='Add Contact'
                        customClass='text-xs'
                        onClick={handleAddContactClick}
                    />
                    {showAddContactDropdown && (
                        <div
                        className='absolute w-72 bg-slate-100  rounded-lg flex flex-col mt-2 pt-2.5 px-1.5 z-10'
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
                                    customClass='text-xs ms-1 bg-slate-100 hover:bg-slate-100'
                                    onClick={handleCancelClick}
                                    textColor='text-black'
                                />
                                <Button 
                                    text='Add'
                                    customClass='text-xs ms-1'
                                    onClick={addContactClick}
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
            <div className='flex items-center border-[1.4px] px-2 py-0.5 rounded-lg w-full'>
                <img src={searchIcon} alt="" className='h-3'/>
                <input type="text" className='py-1 px-1.5 rounded-e-lg text-xs border-none outline-none w-full' placeholder='Search my contacts'/>
            </div>
            {/* Contacts Container */}
            <div className='flex flex-col mt-3.5 gap-y-2 overflow-y-auto px-1 h-full'>
                {contacts.length === 0 && !loading && (
                    <div className='flex justify-center h-full'>
                        <h1 className='text-slate-300 m-2.5'>No contacts yet.</h1>
                    </div>
                )}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    contacts.map((contact, idx) => (
                    <div 
                        key={idx} 
                        className={`flex items-center py-2.5 px-2 rounded-full cursor-pointer ${selectedContactId === contact.id ? 'bg-blue-500 text-white hover:bg-blue-500' : 'hover:bg-slate-100'}`}
                        onClick={() => handleContactClick(contact.id)}
                        >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-[50%] overflow-hidden ${selectedContactId === contact.id ? 'outline outline-[1.5px]' : ''}`}>
                            <img src={getProfilePicture(contact.contact_user.profile_picture)} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className='flex flex-col ms-2.5 w-[80%]'>
                            <div className='flex'>
                                <h2 className='text-sm'>{contact.contact_user.name}</h2>
                            </div>
                            <p className={`contact-status-text text-[10px] ${selectedContactId === contact.id ? 'text-slate-100' : 'text-slate-600'}`}>{contact.contact_user.status_text?.length > 0 ? contact.contact_user.status_text : "Hey there, I'm using Chatter."}</p>
                        </div>
                        <div className='w-7 h-7 border border-slate-300 rounded-full flex items-center justify-center ms-auto'>
                            <IoMdStarOutline size={"20px"}/>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
        <div className="w-[40%] flex flex-col py-3.5 px-3.5 relative">
        <h1 className='text-2xl text-center'>Contact Info</h1>
            {showDeleteContactModal && (
            <div className='w-full h-full absolute bg-transparent'>
                <div className='bg-slate-200 h-40 w-[60%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center p-3 rounded-lg shadow-lg'>
                    <h1 className='text-center'>Are you sure you want to delete this contact?</h1>
                    <div className='flex mt-4 justify-evenly'>
                        <button 
                            className='text-sm bg-slate-300 rounded-lg py-2 px-3'
                            onClick={handleCancelDeleteContactClick}
                            >Cancel</button>
                        <button 
                            className='text-sm rounded-lg bg-red-500 py-2 px-3'
                            onClick={handleDeleteContact}
                            >Delete</button>
                    </div>
                </div>
            </div>
            )}
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
                        <div className='bg-slate-200 py-3 px-3 rounded-lg h-[4em] max-h-[4em] overflow-y-auto flex items-center justify-center'>
                            <p className='text-xs py-1'>{selectedContact.contact_user.status_text?.length > 0 ? selectedContact.contact_user?.status_text : "Hey there, I'm using Chatter."}</p>
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
                        <div className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center cursor-pointer hover:bg-slate-300'
                        onClick={handleDeleteContactButtonClick}
                        >
                            <div className='text-xs text-red-600'>Delete Contact</div>
                        </div>
                    </div>
                </>
            ) : contacts.length === 0 ? (
                <div className='flex items-center justify-center h-full'>
                    <div className='text-center text-slate-300'>You can't chat without contacts. Add one :)</div>
                </div>
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