import { createContext, useContext, useState, useEffect } from "react";
import { fetchWithAuth } from "../utils";
import { BASE_URL } from "../constants";

const ContactContext = createContext();

export function ContactProvider({ children }){
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <ContactContext.Provider value={{contacts, setContacts, loading}}>
            {children}
        </ContactContext.Provider>
    )
};

export const useContact = () => useContext(ContactContext);