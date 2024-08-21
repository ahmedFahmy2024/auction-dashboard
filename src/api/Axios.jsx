import axios from 'axios';
import Cookie from 'cookie-universal';
import { BASE_URL } from '../api/Api';

const cookies = Cookie()
const token = cookies.get('dashboard')

export const Axios = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${token}`
    }
})