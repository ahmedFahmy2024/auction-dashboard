import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext';
import { useContext } from 'react';
import { Icon } from '@iconify/react';
import '../../css/usersubscribtion.css'
import { useUsers } from '../../context/UsersProvider';


import Grid from '@mui/material/Unstable_Grid2';

function UserSubscribtion() {
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const { currentSub, subscribtions } = useUsers();

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "usersubscribtion"].join(" ")}>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <div className="paper">
            <div className="header">
              <div className="content">
                <div className="text">{t("Current Subscription")}</div>
              </div>
            </div>
            <div className="body">
              <div className="content">
                <Icon icon="tabler:packages" width="24" height="24" />
                <div className="text">{t("Package ")}
                  <span className="span">{t(`${currentSub?.package_name}`)}</span>
                </div>
              </div>

              <div className="content">
                <Icon icon="fa-solid:calendar-times" width="24" height="24" />
                <div className="text">{t("End In ")}
                  <span className="span">{t(`${currentSub?.end_date}`)}</span>
                </div>
              </div>

              <div className="content">
                <Icon icon="lets-icons:date-range-fill" width="24" height="24" />
                <div className="text">{t("Remaining Days ")}
                  <span className="span">{t(`${currentSub?.remaining_days}`)}</span>
                </div>
              </div>

              <div className="content">
                <Icon icon="mdi:list-status" width="24" height="24" />
                <div className="text">{t("Status ")}
                  <span className="span">{t(`${currentSub?.status}`)}</span>
                </div>
              </div>

            </div>
          </div>
        </Grid>

        {subscribtions.map((subscribtion) => (
          <Grid xs={12} md={4} key={subscribtion.id}>
            <div className="paper">
              <div className="header">
                <div className="content">
                  <div className="text">{t("Old Subscription")}</div>
                </div>
              </div>
              <div className="body">
                <div className="content">
                  <Icon icon="tabler:packages" width="24" height="24" />
                  <div className="text">{t("Package ")}
                    <span className="span">{t(`${subscribtion?.package.name}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="fa-solid:calendar-times" width="24" height="24" />
                  <div className="text">{t("End In ")}
                    <span className="span">{t(`${subscribtion?.end_date}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="fa6-solid:calendar-check" width="24" height="24" />
                  <div className="text">{t("Start In ")}
                    <span className="span">{t(`${subscribtion?.start_date}`)}</span>
                  </div>
                </div>

                <div className="content">
                  <Icon icon="mdi:list-status" width="24" height="24" />
                  <div className="text">{t("Status ")}
                    <span className="span">{t(`${!subscribtion?.status ? "Inactive" : "Active" }`)}</span>
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

export default UserSubscribtion