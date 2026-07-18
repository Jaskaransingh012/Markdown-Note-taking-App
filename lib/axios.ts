import axios from "axios";

const authApi = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})

export default authApi;


export const documentApi = axios.create({
    baseURL: "/api/documents",
    withCredentials: true,
})


