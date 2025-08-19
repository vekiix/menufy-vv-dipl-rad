import axios from 'axios';

interface ErrorResponse {
    message?: string;
    statusCode?: number;
    error?: string;
}

const axiosInstance = axios.create({
    baseURL: process.env.API_URL || "http://localhost:9100"
});

export default axiosInstance;
export { axios };

