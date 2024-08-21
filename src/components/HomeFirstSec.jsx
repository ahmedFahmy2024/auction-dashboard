import Grid from '@mui/material/Unstable_Grid2';
import SvgComponent from './SvgComponent';

import { useTranslation } from 'react-i18next';
import { LocalContext } from '../context/LocalContext'
import { useContext } from 'react'

function HomeFirstSec({ user }) {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);
    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "home-first-sec"].join(" ")} >
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <div className="stack">
                        <div className="stack-first">
                            <h4 className="title">{t("Welcome back")} 👋
                                {user?.name}</h4>
                            <p className="subtitle">{t("Here you can manage your projects, subscriptions, users, and much more.Navigate through the sections using the sidebar to get started")}</p>
                        </div>
                        <span className="stack-img">
                            <SvgComponent />
                        </span>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default HomeFirstSec