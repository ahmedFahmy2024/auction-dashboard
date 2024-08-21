import { useContext, useState, useRef, useEffect } from 'react'
import { LocalContext } from '../context/LocalContext';
import { useTranslation } from 'react-i18next';
import "../css/translate.css"
import us from "../assets/us.svg"
import eg from "../assets/eg.svg"
import pk from "../assets/pk.svg"

import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

function Translate() {
    const { locale, setLocale } = useContext(LocalContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const [open, setOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState(locale);

    // to be able to close the menu from outside
    const menuRef = useRef();
    const imgRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) && imgRef.current && !imgRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    function handleChangeLanguage(newLocale) {
        setSelectedLanguage(newLocale);
        setLocale(newLocale);
        i18n.changeLanguage(newLocale);
        localStorage.setItem("language", newLocale);
        setOpen(false);
    }

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setSelectedLanguage(storedLanguage);
            setLocale(storedLanguage);
            i18n.changeLanguage(storedLanguage);
        }
    }, [setLocale, i18n]);

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "translate"].join(" ")}>
            <div className="lang-menu">
                <div className="stack" onClick={() => setOpen(!open)}>
                    <img ref={imgRef} src={selectedLanguage === "en" ? us : (selectedLanguage === "ar" ? eg : pk)} alt="" />
                </div>
                {open &&
                    <Box ref={menuRef} className="lang-list" sx={{ bgcolor: theme.palette.mode === "light" ? "#fff" : "#212b36e6" }}>
                        <ul>
                            <li onClick={() => handleChangeLanguage("en")}>
                                <img src={us} alt="" />
                                <span>English</span>
                            </li>
                            <li onClick={() => handleChangeLanguage("ar")}>
                                <img src={eg} alt="" />
                                <span>Arabic</span>
                            </li>
                            <li onClick={() => handleChangeLanguage("ur")}>
                                <img src={pk} alt=""  />
                                <span>Urdu</span>
                            </li>
                        </ul>
                    </Box>
                }

            </div>
        </div>
    )
}

export default Translate