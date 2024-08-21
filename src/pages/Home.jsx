import { Container } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { LocalContext } from '../context/LocalContext'
import ToastContext from '../context/ToastProvider';
import { useContext, useEffect, useState } from 'react'
import { CHART, PROFILE } from '../api/Api';
import { Axios } from '../api/Axios';
import { useTranslation } from 'react-i18next';

import HomeFirstSec from '../components/HomeFirstSec';
import '../css/home.css'
import HomeSecondSec from '../components/HomeSecondSec';
import HomeThirdSec from '../components/HomeThirdSec';
import HomeForthSec from '../components/HomeForthSec';
import HomeFifthSec from '../components/HomeFifthSec';
import HomeSixthSec from '../components/HomeSixthSec';

function Home() {
    const [charts, setCharts] = useState([]);
    const [user, setUser] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const [loading, setLoading] = useState(false);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();

    //  ====== get all Chart ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${CHART}`,)
            .then(function (response) {
                // console.log(response.data);
                setCharts(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast(error.response.data.message, 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get all Chart ========

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await Axios.get(`${PROFILE}`)
                // console.log(response.data.user)
                setUser(response.data.user)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false);
            }
        }

        fetchData()
    }, [])

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "home"].join(" ")}>
            <Container maxWidth="xl">
                <HomeFirstSec user={user}/>
                <HomeSixthSec />
                <HomeSecondSec charts={charts} />
                <HomeForthSec charts={charts} />
                <HomeFifthSec charts={charts} />
                <HomeThirdSec charts={charts} />
            </Container>
        </div>
    )
}

export default Home