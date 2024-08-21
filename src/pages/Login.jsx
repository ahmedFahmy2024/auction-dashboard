import { useRef, useEffect, useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ToastContext from '../context/ToastProvider';
import { LocalContext } from '../context/LocalContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookie from 'cookie-universal'
import { BASE_URL, LOGIN } from '../api/Api';
import "../css/login.css";

import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Login() {
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);

    const cookies = Cookie()
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();


    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}${LOGIN}`,
                { email: email, password: pwd },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            // console.log(response);
            const accessToken = response?.data?.access_token;
            const roles = response?.data?.user?.is_admin;
            cookies.set('dashboard', accessToken)
            // console.log("accessToken", accessToken);
            setLoading(false);
            showHideToast(t("login success"));
            setEmail('');
            setPwd('');
            // navigate(from, { replace: true });
            window.location.pathname = '/';
        } catch (err) {
            let errorMessage = (t('An error occurred. Please try again.'));
            if (err.response) {
                if (err.response.status === 400) {
                    errorMessage = (t('Enter valid email. Please check your input.'));
                } else if (err.response.status === 401) {
                    errorMessage = (t('Unauthorized. Please log in again.'));
                } else if (err.response.status === 403) {
                    errorMessage = (t('Forbidden. You do not have permission to perform this action.'));
                } else if (err.response.status === 404) {
                    errorMessage = (t('Resource not found.'));
                } else if (err.response.status === 500) {
                    errorMessage = (t('Internal server error. Please try again later.'));
                } else {
                    errorMessage = (t('An unexpected error occurred. Please try again later.'));
                }
            }
            setLoading(false);
            showHideToast(errorMessage, "error");
        }
    }

    // ============ loading =============
    if (loading) {
        return (
            <Backdrop
                sx={{ color: '#1976d2', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <div className="login">
            <Container maxWidth="sm">
                <div>
                    <img src={require('../assets/logo.png')} alt="logo" />
                </div>
                <form onSubmit={handleSubmit}>
                    <TextField autoFocus size='small' sx={{ marginBottom: 1 }} required value={email} onChange={(e) => setEmail(e.target.value)} ref={userRef} id="username" autoComplete="off" label={t("Email")} variant="outlined" />
                    <TextField size='small' sx={{ marginBottom: 1 }} required value={pwd} onChange={(e) => setPwd(e.target.value)} ref={userRef} id="password" label={t("Password")} variant="outlined" type="password" />
                    <button>{t("Sign In")}</button>
                </form>
                <div className="login-footer">{t("Copyright © 2024 B2B ARABIA. All rights reserved.")}</div>
            </Container>
        </div >
    )
}

export default Login