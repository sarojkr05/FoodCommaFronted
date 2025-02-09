import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Change if your backend URL is different
});

// ✅ Add interceptor to attach token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
