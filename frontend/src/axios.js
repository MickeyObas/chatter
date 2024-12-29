import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    headers: {
        "X-CSRFToken": getCSRFToken(),
        "Content-Type": "application/json"
    }
})

function getCSRFToken(){
    const name = "csrftoken"
    const cookies = document.cookie.split(";");
    for(let i = 0; i < cookies.length; i++){
        const cookie = cookies[i].trim();
        if(cookie.startsWith(name + "=")){
            const csrftoken = cookie.substring(name.length + 1);
            return csrftoken;
        };
    };

    return null;
};

export default axiosInstance;
