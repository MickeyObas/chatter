import { createContext, useContext, useState } from "react"; 

const ChatContext = createContext();

export function ChatProvider({ children }){
    const [chatId, setChatId] = useState(
        localStorage.getItem('chatId') ? JSON.parse(localStorage.getItem('chatId')) : null
    );

    return (
        <ChatContext.Provider value={{chatId, setChatId}}>
            {children}
        </ChatContext.Provider>
    )
};

export const useChat = () => useContext(ChatContext);