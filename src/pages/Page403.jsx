import React from 'react'
import '../css/page403.css'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../context/LocalContext';
import { useContext } from 'react';

export default function Page403({ role }) {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);
    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "text-wrapper"].join(" ")}>
            <div className="title" data-content="404">
                {t("403 - ACCESS DENIED")}
            </div>

            <div className="subtitle">
                {t("Oops, You don't have permission to access this page.")}
            </div>
            <div className="isi">
                {t("A web server may return a 403 Forbidden HTTP status code in response to a request from a client for a web page or resource to indicate that the server can be reached and understood the request, but refuses to take any further action. Status code 403 responses are the result of the web server being configured to deny access, for some reason, to the requested resource by the client.")}
            </div>

            <div className="buttons">
                <Link to={role === 1 ? '/' : ''} className="button">{role === 1 ? (t('Go to Home Page')) : (t('You are not allowed'))}</Link>
            </div>
        </div>
    )
}
