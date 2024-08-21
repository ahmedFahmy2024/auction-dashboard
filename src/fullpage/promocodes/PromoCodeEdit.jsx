import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/projectsadd.css"
import { Axios } from '../../api/Axios';
import { PROMOCODDES } from '../../api/Api';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";
import "moment/locale/ar";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const PromoCodeEdit = () => {
  const { locale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  //  ================ edit state ================
  const [expireDate, setExpireDate] = useState(null);
  const [updateInput, setUpdateInput] = useState({
    Code: "",
    Duration: "",
  })

  function handleForm(e) {
    setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
  }

  function handleDateChange(date) {
    setExpireDate(date);
  }
  //  ================ edit state ================

    //  ====== get specific promo code ========
    useEffect(() => {
      setLoading(true);
      Axios.get(`${PROMOCODDES}/${id}`,)
        .then(function (response) {
          // console.log(response.data);
          const data = response.data;
          setUpdateInput({
            ...updateInput,
            Code: data.code,
            Duration: data.duration,
          })
          setExpireDate(moment(data.expire_date));
          setLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          showHideToast("Something went wrong", 'error');
          setLoading(false);
        });
    }, []);
    //  ====== get specific promo code ========

  //  ================ edit function ================
  async function handleDialogSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formattedDate = expireDate ? dayjs(expireDate).format('YYYY-MM-DD') : null;

    const param = {
      code: updateInput.Code,
      duration: updateInput.Duration,
      expire_date: formattedDate,
    }

    try {
      const response = await Axios.put(`${PROMOCODDES}/${id}`, param, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(response);
      showHideToast(t("Edited successfully"));
      setLoading(false);
      navigate("/PromoCode");
    } catch (error) {
      console.log(error);
      setLoading(false);
      showHideToast(t("An error occurred. Please try again."), "error");
    }
  }

  // ================= loading =================
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "ProjectsAdd"].join(" ")}>
      <Container maxWidth="lg">
        <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
          {t('Edit Promo Code')}
        </h4>
        <Grid container spacing={2}>
          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Code, Duration, and Expiry Date...")}</p>
          </Grid>
          <Grid xs={12} md={8}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <TextField autoFocus value={updateInput.Code} onChange={handleForm} fullWidth size="small" name="Code" label={t("Code")} variant="outlined" />
                <TextField type="number" value={updateInput.Duration} onChange={handleForm} fullWidth size="small" name="Duration" label={t("Duration")} variant="outlined" />
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      className="promodatePicker"
                      format="YYYY-MM-DD"
                      label={t("تاريخ انتهاء العرض")}
                      minDate={moment()} // This sets the minimum date to today
                      disablePast // This disables all dates in the past
                      value={expireDate}
                      onChange={handleDateChange}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
          </Grid>

        </Grid>

        {/* ================= Submit Button ================ */}
        <Grid container spacing={2}>
          <Grid md={4}></Grid>
          <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
            <button
              onClick={handleDialogSubmit}
              className="submitbtn" variant="contained" type="submit">{t('Edit Promo Code')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default PromoCodeEdit