import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types'; 

const AuthContext = createContext();

export function AuthProvider({children}){
    const [user, setUser] = useState(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    );

    useEffect(() => {
        
    })

    useEffect(() => {
        try{
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if(storedUser){
                setUser(storedUser);
            }
        }catch(err){
            console.log("Failed to parse user data", err);
        }
       
    }, [])

    const login = (data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setUser(data.user);
    }

    const logout = () => {
        // localStorage.removeItem('user');
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        localStorage.clear();
        setUser(null);
        
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
    children: PropTypes.any
}