import { Outlet, Navigate, useNavigate } from "react-router-dom";
import Cookie from 'cookie-universal';
import { useState, useEffect } from 'react';
import { PROFILE, BASE_URL } from "../api/Api";
import { Axios } from "../api/Axios";
import axios from "axios";
import Page403 from "../pages/Page403";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function RequireAuth({ allowedRoles }) {
    const [user, setUser] = useState("");
    const cookies = Cookie()
    const token = cookies.get('dashboard')
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}${PROFILE}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setUser(response.data.user)
                // console.log("profile", response.data.user)
            } catch (error) {
                console.log(error)
                navigate('/Login', { replace: true })
            }
        }

        fetchData()
    }, [token, navigate])

    return (
        token ? (
            user === "" ? ( <Backdrop open
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              >
                <CircularProgress color="inherit" />
              </Backdrop> ) : 
            allowedRoles.includes(user?.is_admin) ? ( <Outlet /> ) : 
            ( <Page403 role={user?.is_admin} />)
        ) : (
            <Navigate to='/Login' replace={true} />
        )
    )
}
