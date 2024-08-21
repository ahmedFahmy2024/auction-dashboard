import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/bidsAdd.css"
import { Axios } from '../../api/Axios';
import { BIDS, SCRAPS } from '../../api/Api';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

function BidsAdd() {
    const [scraps, setScraps] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    //  ====== get all Scraps ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${SCRAPS}`,)
            .then(function (response) {
                // console.log(response.data.scraps);
                setScraps(response.data.scraps);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast(error.response.data.message, 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get all Scraps ========

    //  ================ add state ================
    const [addInput, setAddInput] = useState({
        Quantity: '',
        Price: '',
        Scraps: '',
        Users: '',
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
            user_id: addInput.Users,
            scrap_id: addInput.Scraps,
            quantity: addInput.Quantity,
            price: addInput.Price,
        }

        try {
            const response = await Axios.post(`${BIDS}`, param);
            // console.log(response);
            showHideToast(t("Added successfully"));
            setAddInput({
                quantity: '',
                price: '',
                scraps: '',
                Users: '',
            });
            setLoading(false);
            navigate("/Bids");
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
    const btnIsDisabled = !addInput.Quantity || !addInput.Price || !addInput.Scraps || !addInput.Users;

    let btnClasses = ""
    if (btnIsDisabled) {
        btnClasses = "disabled"
    } else {
        btnClasses = "submitbtn"
    }

    // Filter unique users
    const uniqueUsers = [...new Map(scraps.map(item => [item.user.id, item.user])).values()];

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "bidsAdd"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Create a new Bids')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Quantity, Price ...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('Scraps')}</InputLabel>
                                    <Select
                                        value={addInput.Scraps}
                                        onChange={handleForm}
                                        name="Scraps"
                                        required
                                    >
                                        {scraps.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('Users')}</InputLabel>
                                    <Select
                                        value={addInput.Users}
                                        onChange={handleForm}
                                        name="Users"
                                        required
                                    >
                                        {uniqueUsers.map((user, index) => (
                                            <MenuItem key={index} value={user?.id}>{user?.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField value={addInput.Quantity} onChange={handleForm} fullWidth size="small" name="Quantity" label={t("Quantity")} variant="outlined" type="number" />
                                <TextField value={addInput.Price} onChange={handleForm} fullWidth size="small" name="Price" label={t("Price")} variant="outlined" type="number" />
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
                            className={btnClasses} variant="contained" type="submit">{t('Create Bids')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default BidsAdd