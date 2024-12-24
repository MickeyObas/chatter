import { useLocation, Outlet, Navigate } from "react-router-dom";

export const fetchWithAuth = async (url, options = {}) => {
    // Retrieve the access and refresh tokens
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // Set up the request options with the Authorization header
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    // Make the fetch request
    let response = await fetch(url, { ...options, headers });

    // If the response indicates an expired token, attempt to refresh
    if (response.status === 401 && refreshToken) {
        console.log("Token expired");
        // Attempt to refresh the token
        const refreshResponse = await fetch('http://localhost:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
            console.log("Attempting Refresh")
            const data = await refreshResponse.json();
            // Update local storage with new tokens
            localStorage.setItem('accessToken', data.access);

            // Retry the original request with the new access token
            headers['Authorization'] = `Bearer ${data.access}`;
            response = await fetch(url, { ...options, headers });
        } else {
            // Handle the case where refreshing the token fails
            // For example, redirect to the login page
            console.log("Whoops: Something failed in refreshing");
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken')
            window.location.href = '/login';
            return;
        }
    }
    console.log("Authenticated Stuff Done")
    return response;
};

export default function ProtectedRoutes(){
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const location = useLocation();
    
    return (
        isAuthenticated ?
        <Outlet /> :
        <Navigate to='/login' state={{ from: location }} replace />
    )
}

export const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}