import { LocalContext } from '../context/LocalContext'
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import StatisticSecTable from './StatisticSecTable';

import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';

function HomeFifthSec({ charts }) {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "homesecondsec"].join(" ")}>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6} lg={3} sx={{ padding: '12px' }}>

                    <div style={{ marginBottom: '12px' }} className="Stack stack11">
                        <div className="icon">
                            <Icon icon="icons8:todo-list" width="64" height="64" />
                            <h3>{charts?.request_quotes_added_last_seven_days_count}</h3>
                            <h6>{t('Total Request Quotes Added Last 7 Days')}</h6>
                        </div>
                    </div>

                    <div className="Stack stack12">
                        <div className="icon">
                            <Icon icon="solar:user-linear" width="64" height="64" />
                            <h3>{charts?.users_adding_request_quotes_last_seven_days_count}</h3>
                            <h6>{t('Total Users Adding Request Quotes Last 7 Days')}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} lg={9} sx={{ padding: '12px' }}>
                    <StatisticSecTable charts={charts} />
                </Grid>
            </Grid>
        </div>
    )
}

export default HomeFifthSec