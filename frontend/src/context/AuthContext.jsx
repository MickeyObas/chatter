import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({children}){

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}