import React, { useEffect, useState } from 'react'
import GroupInboxMessageSection from '../../components/ui/GroupInboxMessageSection'
import { useParams } from 'react-router-dom'
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants';
import GroupChatMessagesSection from '../../components/ui/GroupChatMessagesSection';

function Group() {
  const { groupId } = useParams();
  const [groupChat, setGroupChat] = useState(null);
  const [loading, setLoading] = useState(true);

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
          console.log("From Group -> ", data);
        }
      } catch(err){
        console.error(err);
      } finally{
        setLoading(false);
      }
    };

    fetchGroupChat();

  }, [groupId])

  return (
    <div className='w-[80%] flex'>
        <GroupInboxMessageSection 
          groupChat={groupChat}
          isGroupChatLoading={loading}
          />
          <GroupChatMessagesSection />
    </div>
  )
}

export default Group