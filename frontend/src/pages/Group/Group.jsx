import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import GroupInboxMessageSection from '../../components/ui/GroupInboxMessageSection'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants';
import GroupChatMessagesSection from '../../components/ui/GroupChatMessagesSection';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

// Toast Notification
import { Slide, Bounce, ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useOnlineContacts } from "../../context/OnlineContactsContext";

function Group() {
  const { groupId } = useParams();
  const [groupChat, setGroupChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const groupChatSocket = useRef(null);
  const { user } = useAuth();
  const { groupChats, setGroupChats } = useChat();
  const navigate = useNavigate();

  const ContactAddedMessage = ({ data }) => (
    <div>
        <p className="text-[11px]">You added "{data?.user?.split("@")[0]}" to the group "{data?.title}".</p>
    </div>
    );

  const displayContactAddedToast = (contact, title) => {
    toast.success(ContactAddedMessage, {
        data: {
          user: contact,
          title: title
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


  useEffect(() => {
    const openConnection = async () => {
      groupChatSocket.current = new WebSocket(
        `ws://localhost:8000/ws/groupchats/${groupId}/${user.id}/`
      );

      groupChatSocket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if(data['type'] === 'groupchat.message'){
          setGroupChat((prev) => (
            {
              ...prev,
              messages: [...prev.messages, data.data]
            }
          ));

        }
      };

      groupChatSocket.current.onerror = (error) => {
        console.log('Whoops, something went wrong.')
      };

      groupChatSocket.current.onclose = () => {
        console.log("Closing Socket")
      }

    };

    openConnection();

    return () => {
      if(groupChatSocket.current){
        groupChatSocket.current.close();
      }
    }

  }, [user.id, groupId])

  useEffect(() => {
    const fetchGroupChat = async () => {
      try {
        const response = await fetchWithAuth(`${BASE_URL}/chats/groups/${groupId}/`, {
          method: 'GET'
        });

        if(!response.ok){
          console.error("Something went wrong in fetching the group chat.");
        }else{
          const data = await response.json();
          setGroupChat(data);
        }
      } catch(err){
        console.error(err);
      } finally{
        setLoading(false);
      }
    };

    fetchGroupChat();

  }, [groupId]);

  useEffect (() => {
    const setMessagesAsRead = async () => {
      try {
        const response = await fetchWithAuth(`${BASE_URL}/messages/groups/${groupId}/mark-as-read/`, {
            method: 'POST'
        });

        if(!response.ok){
            console.log("Whoops, couldn't set messages as read.");
        }else{
            const data = await response.json();
            setGroupChats((prev) => {
                const index = prev.findIndex(gc => gc.id === groupId);
                const updatedChats = [...prev];
                const updatedChat = {...prev[index], unread_messages_count: 0};

                updatedChats[index] = updatedChat;

                return updatedChats;
            })
        };
    }catch(err){
        console.error(err);
    }};

    setMessagesAsRead();

  }, [groupId])



  return (
    <div className='w-[80%] flex'>
      <ToastContainer />
        <GroupInboxMessageSection 
          displayContactAddedToast={displayContactAddedToast}
          groupChat={groupChat}
          groupChatSocket={groupChatSocket}
          isGroupChatLoading={loading}
          />
          <GroupChatMessagesSection 
            groupChats={groupChats}
          />
    </div>
  )
}

export default Group;