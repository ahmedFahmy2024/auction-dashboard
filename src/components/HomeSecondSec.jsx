import { LocalContext } from '../context/LocalContext'
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import "../css/homesec.css"

import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';

function HomeSecondSec({ charts }) {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "homesecondsec"].join(" ")}>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={4} lg={3} sx={{ padding: '12px' }}>
                    <div className="Stack stack1">
                        <div className="icon">
                            <Icon icon="octicon:project-roadmap-24" width="64" height="64" />
                            <h3>{charts?.project_count}</h3>
                            <h6>{t('Total Projects')}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3} sx={{ padding: '12px' }}>
                <div className="Stack stack2">
                        <div className="icon">
                            <Icon icon="hugeicons:crane" width="64" height="64" />
                            <h3>{charts?.scrap_count}</h3>
                            <h6>{t('Total Scraps')}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3} sx={{ padding: '12px' }}>
                <div className="Stack stack3">
                        <div className="icon">
                            <Icon icon="streamline:subscription-cashflow" width="64" height="64" />
                            <h3>{charts?.subscription_counts}</h3>
                            <h6>{t('Total Subscriptions')}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3} sx={{ padding: '12px' }}>
                <div className="Stack stack4">
                        <div className="icon">
                            <Icon icon="mage:users" width="64" height="64" />
                            <h3>{charts?.total_users_count}</h3>
                            <h6>{t('Total Users')}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3} sx={{ padding: '12px' }}>
                <div className="Stack stack5">
                        <div className="icon">
                            <Icon icon="iconoir:packages" width="64" height="64" />
                            <h3>{charts?.total_packages_count}</h3>
                            <h6>{t('Total Packages')}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3} sx={{ padding: '12px' }}>
                <div className="Stack stack6">
                        <div className="icon">
                            <Icon icon="ep:money" width="64" height="64" />
                            <h3>{charts?.total_transactions_count}</h3>
                            <h6>{t('Total Transactions')}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3} sx={{ padding: '12px' }}>
                <div className="Stack stack7">
                        <div className="icon">
                            <Icon icon="bi:file-text" width="64" height="64" />
                            <h3>{charts?.total_requests_count}</h3>
                            <h6>{t('Total Requests')}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3} sx={{ padding: '12px' }}>
                <div className="Stack stack8">
                        <div className="icon">
                            <Icon icon="streamline:justice-hammer" width="64" height="64" />
                            <h3>{charts?.total_bids_count}</h3>
                            <h6>{t('Total Bids')}</h6>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default HomeSecondSec