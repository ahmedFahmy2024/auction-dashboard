import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/subscribtionsAdd.css"
import { Axios } from '../../api/Axios';
import { SUBSCRIPTIONS, PACKAGES } from '../../api/Api';

import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Switch from '@mui/material/Switch';
import { Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

function SubscribtionsEdit() {
  const [packages, setPackages] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  //  ================ edit state ================
  const [updateInput, setUpdateInput] = useState({
    Username: '',
    UserId: '',
    PackageId: '',
    Suspend: false,
  })

  function handleForm(e) {
    setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
  }

  //  ================ edit state ================

  //  ====== get specific subscription ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${SUBSCRIPTIONS}/${id}`,)
      .then(function (response) {
        // console.log(response.data);
        const subscription = response.data;
        setUpdateInput({
          ...updateInput,
          Username: subscription.user.name,
          UserId: subscription.user_id,
          PackageId: subscription.package_id,
          Suspend: Boolean(subscription.suspend), // Convert 1/0 to true/false
        });

        setStart(new Date(subscription.start_date));
        setEnd(new Date(subscription.end_date));

        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get specific subscription ========

  //  ====== get all Packages ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${PACKAGES}`,)
      .then(function (response) {
        // console.log(response.data);
        setPackages(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get all Packages ========

  //  ================ edit function ================
  async function handleDialogSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const param = {
      user_id: updateInput.UserId,
      package_id: updateInput.PackageId,
      start_date: format(start, 'yyyy-MM-dd'), // Format the start date
      end_date: format(end, 'yyyy-MM-dd'),
      suspend: updateInput.Suspend
    }
    // console.log("param", param)
    try {
      const response = await Axios.put(`${SUBSCRIPTIONS}/${id}`, param);
      // console.log(response);
      showHideToast(t("Edited successfully"));
      setLoading(false);
      navigate("/Subscriptions");
    } catch (error) {
      console.log(error);
      setLoading(false);
      showHideToast(t("An error occurred. Please try again."), 'error');
    }
  }
  //  ================ edit function ================

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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "subscribtionsAdd"].join(" ")}>
        <Container maxWidth="lg">
          <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
            {t('Edit Subscription')}
          </h4>
          <Grid container spacing={2}>
            <Grid md={4}>
              <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
              <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, ...")}</p>
            </Grid>
            <Grid xs={12} md={8}>
              <div className="firstbox">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>

                  <TextField disabled value={updateInput.Username} fullWidth size="small" name="Username" label={t("User")} variant="outlined" />

                  <FormControl fullWidth size="small">
                    <InputLabel>{t('Packages')}</InputLabel>
                    <Select
                      value={updateInput.PackageId}
                      onChange={handleForm}
                      name="PackageId"
                      required
                    >
                      {packages.map((item, index) => (
                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <DatePicker label={t("Start date")} value={start} onChange={(newValue) => { setStart(newValue) }} />
                  <DatePicker label={t("End date")} value={end} onChange={(newValue) => { setEnd(newValue) }} />

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.57143 }}>{t('Suspend')}</span>
                    <Switch
                      checked={updateInput.Suspend}
                      onChange={(e) => {
                        setUpdateInput({ ...updateInput, Suspend: e.target.checked })
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Stack>

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
                className="submitbtn" variant="contained" type="submit">{t('Edit Subscription')}</button>
            </Grid>
          </Grid>
        </Container>
      </div>
    </LocalizationProvider>
  )
}

export default SubscribtionsEdit