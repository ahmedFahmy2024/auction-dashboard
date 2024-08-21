import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/transcationsadd.css"
import { Axios } from '../../api/Axios';
import { SUBSCRIPTIONS, TRANSCATIONS } from '../../api/Api';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


function TranscationsEdit() {
  const [subscriptions, setSubscriptions] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  //  ================ add state ================
  const [updateInput, setUpdateInput] = useState({
    Subscription: '',
    User: '',
    TransactionId: "",
    PaymentMethod: "",
    Amount: "",
    Status: "",
  })

  function handleForm(e) {
    setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
  }
  //  ================ add state ================

  //  ====== get all subscriptions ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${SUBSCRIPTIONS}`,)
      .then(function (response) {
        // console.log(response.data);
        setSubscriptions(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get all subscriptions ========

  //  ====== get Specific Transcations ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${TRANSCATIONS}/${id}`,)
      .then(function (response) {
        // console.log(response.data.transaction);
        const data = response.data.transaction;
        setUpdateInput({
          ...updateInput,
          Subscription: data.subscription_id,
          User: data.user_id,
          TransactionId: data.transaction_id,
          PaymentMethod: data.payment_method,
          Amount: data.amount,
          Status: data.status,
        });
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get Specific Transcations ========




  // ================= add function ================
  async function handleDialogSubmit(e) {
      e.preventDefault();
      setLoading(true);

      const params = {
          subscription_id: updateInput.Subscription,
          user_id: updateInput.User,
          transaction_id: updateInput.TransactionId,
          payment_method: updateInput.PaymentMethod,
          amount: updateInput.Amount,
          status: updateInput.Status,
      }

      try {
        const response = await Axios.put(`${TRANSCATIONS}/${id}`, params);
        // console.log(response);
        showHideToast(t("Edited successfully"));
        setLoading(false);
        navigate("/Transcations");
      } catch (error) {
        console.log(error);
        setLoading(false);
        showHideToast(t("An error occurred. Please try again."));
      }
    }
  // ================= add function ================

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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "transcationsadd"].join(" ")}>
      <Container maxWidth="lg">
        <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
          {t('Edit Transcation')}
        </h4>
        <Grid container spacing={2}>
          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("User, Subscription, Payment...")}</p>
          </Grid>
          <Grid xs={12} md={8}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <TextField disabled value={updateInput.TransactionId} onChange={handleForm} fullWidth size="small" name="TransactionId" label={t("Transaction Id")} variant="outlined" />

                <FormControl disabled fullWidth size="small">
                  <InputLabel>{t('User')}</InputLabel>
                  <Select
                    value={updateInput.User}
                    onChange={handleForm}
                    name="User"
                    required
                  >
                    {subscriptions.map((item, index) => (
                      <MenuItem key={index} value={item.user_id}>{item.user?.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl disabled fullWidth size="small">
                  <InputLabel>{t('Subscription')}</InputLabel>
                  <Select
                    value={updateInput.Subscription}
                    onChange={handleForm}
                    name="Subscription"
                    required
                  >
                    {subscriptions.map((item, index) => (
                      <MenuItem key={index} value={item.id}>{item.package?.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>


                <TextField value={updateInput.PaymentMethod} onChange={handleForm} fullWidth size="small" name="PaymentMethod" label={t("Payment Method")} variant="outlined" />
                <TextField value={updateInput.Amount} onChange={handleForm} fullWidth size="small" name="Amount" label={t("Payment Amount")} variant="outlined" type="number" />

                <FormControl fullWidth size="small">
                  <InputLabel>{t('Status')}</InputLabel>
                  <Select
                    value={updateInput.Status}
                    onChange={handleForm}
                    name="Status"
                    required
                  >
                    <MenuItem value="pending">{t('Pending')}</MenuItem>
                    <MenuItem value="success">{t('success')}</MenuItem>
                    <MenuItem value="failed">{t('failed')}</MenuItem>
                  </Select>
                </FormControl>

              </div>
            </div>
          </Grid>

        </Grid>

        {/* ================= Edit Button ================ */}
        <Grid container spacing={2}>
          <Grid md={4}></Grid>
          <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
            <button
              onClick={handleDialogSubmit}
              className="submitbtn" variant="contained" type="submit">{t('Edit Transcation')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default TranscationsEdit