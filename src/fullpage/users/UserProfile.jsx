import React from 'react'
import "../../css/userprofile.css"
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../../context/LocalContext';
import { useContext } from 'react';
import { Icon } from '@iconify/react';
import { useUsers } from '../../context/UsersProvider';
import pdf from '../../assets/pdf.svg'

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Grid from '@mui/material/Unstable_Grid2';

function UserProfile() {
  const { locale, setLocale } = useContext(LocalContext);
  const { t, i18n } = useTranslation();
  const { profile } = useUsers();

  // console.log(profile)

  function isImageFile(file) {
    if (typeof file === 'string') {
      // If it's a URL, check the file extension
      return /\.(jpeg|jpg|gif|png)$/i.test(file);
    } else if (file instanceof File) {
      // If it's a File object, check the MIME type
      return file.type.startsWith('image/');
    }
    return false;
  }

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "userProfile"].join(" ")}>
      <div className="paper">
        <div className="header">
          <div className="content">
            <div className="text">{t("About")}</div>
          </div>
        </div>
        <div className="body">
          <Grid container spacing={2}>
            <Grid xs={12} md={4}>
              <div className="content">
                <Icon icon="mingcute:location-fill" width="24" height="24" />
                <div className="text">{t("live at ")}
                  <span className="span">{t(`${profile?.country}`)}</span>
                </div>
              </div>
              <div className="content">
                <Icon icon="mingcute:location-fill" width="24" height="24" />
                <div className="text">{t("From ")}
                  <span className="span">{t(`${profile?.state}`)}</span>
                </div>
              </div>
              <div className="content">
                <Icon icon="fluent:mail-24-filled" width="24" height="24" />
                <div className="text">{t("Email ")}
                  <span className="span">{t(`${profile?.email}`)}</span>
                </div>
              </div>
              <div className="content">
                <Icon icon="ph:phone-list-fill" width="24" height="24" />
                <div className="text">{t("Phone ")}
                  <span className="span">{t(`${profile?.phone}`)}</span>
                </div>
              </div>
            </Grid>
            <Grid xs={12} md={4}>
              <div className="content">
                <Icon icon="ic:baseline-account-circle" width="24" height="24" />
                <div className="text">{t("Account type ")}
                  <span className="span">{t(`${profile?.account_type}`)}</span>
                </div>
              </div>

              <div className="content">
                <BusinessCenterIcon width="24" height="24" />
                <div className="text">{t("Company ")}
                  <span className="span">{t(`${profile?.company_name}`)}</span>
                </div>
              </div>
              <div className="content">
                <Icon icon="healthicons:i-certificate-paper" width="24" height="24" />
                <div className="text">{t("Commercial register ")}
                  <span className="span">{t(`${profile?.commercial_register}`)}</span>
                </div>
              </div>
            </Grid>
            <Grid xs={12} md={4}>
              <div className="content">
                <Icon icon="heroicons-solid:receipt-tax" width="24" height="24" />
                <div className="text">{t("Tax number ")}
                  <span className="span">{t(`${profile?.tax_number}`)}</span>
                </div>
              </div>
              <div className="content">
                <ApartmentIcon width="24" height="24" />
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }} className="text">{t("Accommodation type ")}
                  <a href={profile.accommodation_type} download target="_blank" rel="noopener noreferrer">
                    <img style={{ width: "24px", height: "24px" }} className="img" src={isImageFile(profile.accommodation_type) ? profile.accommodation_type : pdf} alt="" />
                  </a>
                </div>
              </div>
            </Grid>
          </Grid>


        </div>
      </div>
    </div>
  )
}

export default UserProfile