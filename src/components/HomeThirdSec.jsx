import React from 'react'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import { LocalContext } from '../context/LocalContext'
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import ApexChart from './ApexChart'
import ApexChartLine from './ApexChartLine';

function HomeThirdSec({ charts }) {
  const { t, i18n } = useTranslation();
  const { locale, setLocale } = useContext(LocalContext);

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "homethirdsec"].join(" ")}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6} lg={4}>
          <Paper elevation={0} sx={{padding: '24px', borderRadius: '16px', boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{t('User Counts')}</div>
            <ApexChart charts={charts} />
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <Paper elevation={0} sx={{ padding: '24px', borderRadius: '16px', boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{t('Transactions Amount Statistics')}</div>
            <ApexChartLine charts={charts} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default HomeThirdSec