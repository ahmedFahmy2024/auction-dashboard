import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/subscribtionsAdd.css"
import { Axios } from '../../api/Axios';
import { SUBSCRIPTIONS, PACKAGES, USERS } from '../../api/Api';

import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function SubscribtionsAdd() {
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //  ====== get all Users ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${USERS}`,)
      .then(function (response) {
        // console.log(response.data.users);
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get all Users ========

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

  //  ================ add state ================
  const [addInput, setAddInput] = useState({
    UserId: '',
    PackageId: '',
  })

  function handleForm(e) {
    setAddInput({ ...addInput, [e.target.name]: e.target.value })
  }
  //  ================ add state ================

  //  ================ add function ================
  async function handleDialogSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const param = {
      user_id: addInput.UserId,
      package_id: addInput.PackageId
    }

    try {
      const response = await Axios.post(`${SUBSCRIPTIONS}`, param);
      // console.log(response);
      showHideToast(t("Added successfully"));
      setAddInput({
        UserId: '',
        PackageId: '',
      });
      setLoading(false);
      navigate("/Subscriptions");
    } catch (error) {
      console.log(error);
      setLoading(false);
      showHideToast(t("An error occurred. Please try again."), "error");
    }
  }
  //  ================ add function ================

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

  // ============== btn classes ==============
  const btnIsDisabled = !addInput.UserId || !addInput.PackageId;

  let btnClasses = ""
  if (btnIsDisabled) {
    btnClasses = "disabled"
  } else {
    btnClasses = "submitbtn"
  }

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "subscribtionsAdd"].join(" ")}>
      <Container maxWidth="lg">
        <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
          {t('Create a new Subscription')}
        </h4>
        <Grid container spacing={2}>
          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, ...")}</p>
          </Grid>
          <Grid xs={12} md={8}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>

                <FormControl fullWidth size="small">
                  <InputLabel>{t('Users')}</InputLabel>
                  <Select
                    value={addInput.UserId}
                    onChange={handleForm}
                    name="UserId"
                    required
                  >
                    {users.map((item, index) => (
                      <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>{t('Packages')}</InputLabel>
                  <Select
                    value={addInput.PackageId}
                    onChange={handleForm}
                    name="PackageId"
                    required
                  >
                    {packages.map((item, index) => (
                      <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
              disabled={btnIsDisabled}
              className={btnClasses} variant="contained" type="submit">{t('Create Subscription')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default SubscribtionsAdd