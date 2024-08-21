import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../api/Axios';
import Cookie from 'cookie-universal';
import { LOGOUT, BASE_URL } from '../api/Api';
import { useTheme } from '@mui/material/styles';
import '../css/logout.css';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {LocalContext} from '../context/LocalContext';


function Logout() {
    const { t, i18n } = useTranslation();
    const cookies = Cookie()
    const navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = useState(false)
    const { locale, setLocale } = useContext(LocalContext);

    // to be able to close the menu from outside
    const menuRef =useRef();
    const imgRef = useRef();

    window.addEventListener('click', (e) => {
        if(e.target !== imgRef.current && e.target !== menuRef.current) {
            setOpen(false);
        }
    })

    async function handleLogout() {
        try {
            const response = await Axios.post(`${LOGOUT}`, null, {
            });
            // console.log(response.data);
            cookies.remove('dashboard');
            navigate('/Login', { replace: true });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "logout"].join(" ")}>
            <div className="img-container">
                <img ref={imgRef} onClick={() => setOpen(!open)} className='avatar-logout' src={require('../assets/avatar_25.jpg')} alt="" />
            </div>
            {open &&
                <Box ref={menuRef} className="menu-back" sx={{ bgcolor: theme.palette.mode === "light" ? "#fff" : "#212b36e6" }}>
                    <ul >
                            {/* <li className='li-items' onClick={() => setOpen(false)} >Profile</li> */}
                            <li className='li-items' onClick={() => {
                                navigate('/Users', { replace: true });
                                setOpen(false)
                            }}  >{t("My account")}</li>
                            <li className='li-items' onClick={() => {
                                handleLogout();
                                setOpen(false);
                            }} >{t("Logout")}</li>
                    </ul>
                </Box>
            }

        </div>
    )
}

export default Logout
