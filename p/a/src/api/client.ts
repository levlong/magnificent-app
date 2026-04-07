import axios from "axios"

const BASE_URL = "http://192.168.11.184:3000/api/v1" // đổi IP máy mày

export const api = axios.create({
    baseURL: BASE_URL,
})