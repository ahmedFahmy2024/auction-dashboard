import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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


function TranscationsAdd() {
    const [subscriptions, setSubscriptions] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // State to hold the subscriptions for the selected user
    const [userSubscriptions, setUserSubscriptions] = useState([]);

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

    //  ================ add state ================
    const [addInput, setAddInput] = useState({
        Subscription: '',
        User: '',
        TransactionId: "",
        PaymentMethod: "",
        Amount: "",
        Status: "",
    })

    function handleForm(e) {
        const { name, value } = e.target;
        setAddInput({ ...addInput, [name]: value });

        if (name === 'User') {
            // Filter subscriptions based on the selected user
            const selectedUserSubscriptions = subscriptions.filter(sub => sub.user_id === value);
            setUserSubscriptions(selectedUserSubscriptions);
            // Reset the selected subscription when the user changes
            setAddInput(prevState => ({ ...prevState, Subscription: '' }));
        }
    }
    //  ================ add state ================


    // ================= add function ================
    async function handleDialogSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const params = {
            subscription_id: addInput.Subscription,
            user_id: addInput.User,
            transaction_id: addInput.TransactionId,
            payment_method: addInput.PaymentMethod,
            amount: addInput.Amount,
            status: addInput.Status,
        }

        try {
            const response = await Axios.post(`${TRANSCATIONS}`, params);
            // console.log(response);
            showHideToast(t("Added successfully"));
            setAddInput({
                Subscription: "",
                User: "",
                TransactionId: "",
                PaymentMethod: "",
                Amount: "",
                Status: "",
            });
            setLoading(false);
            navigate("/Transcations");
        } catch (error) {
            console.log(error);
            setLoading(false);
            showHideToast(t("An error occurred. Please try again."), "error");
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

    // ============== btn classes ==============
    const btnIsDisabled = !addInput.Subscription || !addInput.User || !addInput.TransactionId || !addInput.PaymentMethod || !addInput.Amount || !addInput.Status;

    let btnClasses = ""
    if (btnIsDisabled) {
        btnClasses = "disabled"
    } else {
        btnClasses = "submitbtn"
    }

    // Track displayed usernames
    const displayedUsernames = new Set();

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "transcationsadd"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Create a new Transcation')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("User, Subscription, Payment...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <TextField autoFocus value={addInput.TransactionId} onChange={handleForm} fullWidth size="small" name="TransactionId" label={t("Transaction Id")} variant="outlined" />

                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('User')}</InputLabel>
                                    <Select
                                        value={addInput.User}
                                        onChange={handleForm}
                                        name="User"
                                        required
                                    >
                                        {subscriptions.map((item, index) => {
                                            const userName = item.user?.name;
                                            if (displayedUsernames.has(userName)) {
                                                return null;
                                            } else {
                                                displayedUsernames.add(userName);
                                                return <MenuItem key={index} value={item.user_id}>{userName}</MenuItem>;
                                            }
                                        })}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('Subscription')}</InputLabel>
                                    <Select
                                        value={addInput.Subscription}
                                        onChange={handleForm}
                                        name="Subscription"
                                        required
                                    >
                                        {userSubscriptions.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>{item.package?.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>


                                <TextField value={addInput.PaymentMethod} onChange={handleForm} fullWidth size="small" name="PaymentMethod" label={t("Payment Method")} variant="outlined" />
                                <TextField value={addInput.Amount} onChange={handleForm} fullWidth size="small" name="Amount" label={t("Payment Amount")} variant="outlined" type="number" />

                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('Status')}</InputLabel>
                                    <Select
                                        value={addInput.Status}
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

                {/* ================= Submit Button ================ */}
                <Grid container spacing={2}>
                    <Grid md={4}></Grid>
                    <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
                        <button
                            onClick={handleDialogSubmit}
                            disabled={btnIsDisabled}
                            className={btnClasses} variant="contained" type="submit">{t('Create Transcation')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default TranscationsAdd