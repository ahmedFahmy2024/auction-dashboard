import React from 'react'
import "../../css/usertranscation.css"
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext';
import { useContext } from 'react';
import { Icon } from '@iconify/react';
import { useUsers } from '../../context/UsersProvider';

import Grid from '@mui/material/Unstable_Grid2';

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

function UserTranscation() {
  const { transactions, nonFilterSub } = useUsers();
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();

  const getPackageName = (subscription_id) => {
    const subscription = nonFilterSub.find(sub => sub.id === subscription_id);
    return subscription ? subscription?.package?.name : 'Unknown Package';
  };

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "usertranscation"].join(" ")}>
      <Grid container spacing={2}>
        {transactions?.map((transcation) => (
          <Grid xs={12} md={4} key={transcation.id}>
            <div className="paper">
              <div className="body">

                <div className="content">
                  <Icon icon="fa6-solid:check-double" width="24" height="24" />
                  <div className="text">{t("Subscription ")}
                    <span className="span">{t(getPackageName(transcation?.subscription_id))}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
                  <div className="text">{t("Created At: ")}
                    <span className="span">{t(`${formatCreatedAt(transcation?.created_at)}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="game-icons:take-my-money" width="24" height="24" />
                  <div className="text">{t("Amount ")}
                    <span className="span">{t(`${transcation?.amount} $`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="fluent:payment-24-filled" width="24" height="24" />
                  <div className="text">{t("Payment Method ")}
                    <span className="span">{t(`${transcation?.payment_method}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="mdi:list-status" width="24" height="24" />
                  <div className="text">{t("Status ")}
                    <span className="span">{t(`${transcation?.status}`)}</span>
                  </div>
                </div>

              </div>
            </div>
          </Grid>
        ))}

      </Grid>
    </div>
  )
}

export default UserTranscation