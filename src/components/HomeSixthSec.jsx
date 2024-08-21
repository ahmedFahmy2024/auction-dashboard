import { LocalContext } from '../context/LocalContext'
import ToastContext from '../context/ToastProvider';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import StatisticThirdTable from './StatisticThirdTable';
import { ACTIVE_USERS } from '../api/Api';
import { Axios } from '../api/Axios';


import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function HomeSixthSec() {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);
    const [activeUsers, setActiveUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showHideToast } = useContext(ToastContext);

    //  ====== get all Chart ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${ACTIVE_USERS}`,)
            .then(function (response) {
                // console.log(response.data);
                setActiveUsers(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast(error.response.data.message, 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get all Chart ========

    // ======================= loading ========================
    if (loading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "homesecondsec"].join(" ")}>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6} lg={3} sx={{ padding: '12px' }}>

                    <div style={{ marginBottom: '12px' }} className="Stack">
                        <div className="icon">
                            <div className="pulse">
                            <span style={{ '--i': 0 }}></span>
                                <span style={{ '--i': 1 }}></span>
                                <span style={{ '--i': 2 }}></span>
                                <span style={{ '--i': 3 }}></span>
                            </div>
                            <h3>{activeUsers?.active_users_count}</h3>
                            <h6>{t('Active Users Count')}</h6>
                        </div>
                    </div>

                </Grid>
                <Grid xs={12} sm={6} lg={9} sx={{ padding: '12px' }}>
                    <StatisticThirdTable activeUsers={activeUsers} />
                </Grid>
            </Grid>
        </div>
    )
}

export default HomeSixthSec