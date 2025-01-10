import { createContext, useContext, useEffect, useState } from "react";
import { fetchWithAuth } from "../utils";
import { BASE_URL } from "../constants";

const OnlineContactsContext = createContext();

export function OnlineContactsProvider({ children }){
    const [onlineContacts, setOnlineContacts] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:8000/sse/online-users/`, {
            withCredentials: true,
        });

        eventSource.onmessage = function(event) {
            // const onlineUsers = JSON.parse(event.data);
            // console.log("Online users:", onlineUsers);
            console.log("Its been 5 seconds")
        };

        eventSource.onerror = function(event) {
            console.error("Error with SSE connection:", event);
            eventSource.close();
        };

        return () => {
            // Cleanup the EventSource when the component unmounts
            eventSource.close();
        };
    }, []);  // The empty dependency array ensures this effect runs only once 

    useEffect(() => {
        const getOnlineContacts = async () => {
            try {
                const response = await fetchWithAuth(`${BASE_URL}/contacts/online/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if(!response.ok){
                    console.log(response);
                    console.error("Something went wrong in getting online contacts -> ");
                }else{
                    const data = await response.json();
                    setOnlineContacts(data);
                    console.log(data);
                }
            } catch(err){
                console.log(err);
            }
        };

        getOnlineContacts();

    }, [])

    return (
        <OnlineContactsContext.Provider value={{onlineContacts, setOnlineContacts}}>
            {children}
        </OnlineContactsContext.Provider>
    )
};

export const useOnlineContacts = () => useContext(OnlineContactsContext);