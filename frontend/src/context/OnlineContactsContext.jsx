import { createContext, useContext, useEffect, useState } from "react";
import { areArraysIdentical, fetchWithAuth } from "../utils";
import { BASE_URL } from "../constants";
import { useContact } from "./ContactContext";
import { useAuth } from "./AuthContext";
import { difference } from 'lodash';

const OnlineContactsContext = createContext();

export function OnlineContactsProvider({ children }){
    const [onlineContacts, setOnlineContacts] = useState(
        JSON.parse(localStorage.getItem('online_contacts')) || []
    );
    const [loading, setLoading] = useState(true);
    const { contacts, loading:contactsLoading } = useContact();
    const { user } = useAuth();

    const [onlineUserz, setOnlineUserz] = useState([]);

    useEffect(() => {
        if(contactsLoading) return;
        const eventSource = new EventSource(`http://localhost:8000/sse/online-users/`, {
            withCredentials: true,
        });

        localStorage.setItem('prev_online_users', JSON.stringify([]));

        eventSource.onopen = (event) => {
        }

        eventSource.onmessage = function(event) {
            // Get currently online users from REDIS
            const onlineUsers = JSON.parse(event.data).filter((onlineUser) => onlineUser !== user.id);

            setOnlineUserz(onlineUsers);

            const prevOnlineUsers = JSON.parse(localStorage.getItem('prev_online_users'));
            localStorage.setItem('prev_online_users', JSON.stringify(onlineUsers));
           
            if(!(onlineUsers.length === 0 && prevOnlineUsers.length === 0)){
                if(!areArraysIdentical(onlineUsers, prevOnlineUsers)){
                    const usersThatCameOnline = difference(onlineUsers, prevOnlineUsers);
                    const usersThatWentOffline = difference(prevOnlineUsers, onlineUsers);
                    const latestContacts = contacts.filter((contact) => onlineUsers.includes(contact.contact_user.id));
                    setOnlineContacts(() => contacts.filter((contact) => onlineUsers.includes(contact.contact_user.id)));
                }
            }
        };

        eventSource.onerror = function(event) {
            console.error("Error with SSE connection:", event);
            eventSource.close();
        };

        return () => {
            console.log("Closing EventSource")
            eventSource.close();
        };
    }, [contactsLoading, user?.id]); 

    useEffect(() => {
        const getOnlineContacts = async () => {
            if(contactsLoading || !user) return;
            try {
                const response = await fetchWithAuth(`${BASE_URL}/contacts/online/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if(!response.ok){
                    console.error("Something went wrong in getting online contacts -> ");
                }else{
                    const data = await response.json();
                    setOnlineContacts(data);
                    localStorage.setItem('online_contacts', JSON.stringify(data));
                }
            } catch(err){
                console.log(err);
            } finally{
                setLoading(false);
            }
        };

        getOnlineContacts();

    }, [contactsLoading])

    return (
        <OnlineContactsContext.Provider value={{onlineContacts, setOnlineContacts, onlineUserz}}>
            {children}
        </OnlineContactsContext.Provider>
    )
};

export const useOnlineContacts = () => useContext(OnlineContactsContext);