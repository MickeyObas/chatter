import { useLocation, Outlet, Navigate } from "react-router-dom";
import { BASE_URL } from "./constants";
import defaultProfilePicture from './assets/images/user-2.png';;

export const fetchWithAuth = async (url, options = {}) => {
    // Retrieve the access and refresh tokens
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // Set up the request options with the Authorization header
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
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

// src/utils/fetchCsrfToken.js

export const fetchCSRFToken = async () => {
    try {
        const response = await fetch(`${BASE_URL}/get-csrf/`, {
            credentials: 'include', // Ensure cookies are included
        });

        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }

        const csrfToken = response.headers.get('X-CSRFToken');

        return csrfToken;

    } catch (err) {
        console.error('Error fetching CSRF token:', err);
    }
};


export const getProfilePicture = (profilePicture) => {
    return profilePicture 
        ? BASE_URL.replace('/api', '') + profilePicture
        : defaultProfilePicture

}


export function timeAgo(isoDateString) {
    const date = new Date(isoDateString); // Parse the ISO string into a Date object
    const now = new Date(); // Current date and time
    const seconds = Math.floor((now - date) / 1000); // Difference in seconds
    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
}

export function formatDatetime(datetimeStr) {
    // Parse the datetime string into a Date object
    const date = new Date(datetimeStr);

    // Define options for formatting
    const options = {
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, 
    };

    // Format the date
    return date.toLocaleString('en-US', options);
}