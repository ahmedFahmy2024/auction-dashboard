import { LocalContext } from '../context/LocalContext'
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import StatisticTable from './StatisticTable';

import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';

function HomeForthSec({ charts }) {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "homesecondsec"].join(" ")}>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6} lg={3} sx={{ padding: '12px' }}>
                    <div style={{ marginBottom: '12px' }} className="Stack stack9">
                        <div className="icon">
                            <Icon icon="iwwa:month" width="64" height="64" />
                            <h3>{charts?.subscriptions_ending_this_month}</h3>
                            <h6>{t('Total Subscriptions Ending This Month')}</h6>
                        </div>
                    </div>
                    <div className="Stack stack10">
                        <div className="icon">
                            <Icon icon="healthicons:i-schedule-school-date-time" width="64" height="64" />
                            <h3>{charts?.subscriptions_ending_next_seven_days_count}</h3>
                            <h6>{t('Total Subscriptions Ending Next 7 Days')}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} lg={9} sx={{ padding: '12px' }}>
                    <StatisticTable charts={charts} />
                </Grid>
            </Grid>
        </div>
    )
}

export default HomeForthSec