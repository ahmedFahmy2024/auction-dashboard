import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/categoriesadd.css"
import { Axios } from '../../api/Axios';
import { CATEGORIES } from '../../api/Api';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function CategoriesAdd() {
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    //  ================ add state ================
    const [addInput, setAddInput] = useState({
        Name: '',
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
            name: addInput.Name
        }

        try {
            const response = await Axios.post(`${CATEGORIES}`, param);
            // console.log(response);
            showHideToast(t("Added successfully"));
            setAddInput({
                Name: '',
            });
            setLoading(false);
            navigate("/Categories");
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
    const btnIsDisabled = !addInput.Name;

    let btnClasses = ""
    if (btnIsDisabled) {
        btnClasses = "disabled"
    } else {
        btnClasses = "submitbtn"
    }

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "categoryAdd"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Create a new Category')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, image...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <TextField autoFocus value={addInput.Name} onChange={handleForm} fullWidth size="small" name="Name" label={t("Name")} variant="outlined" />
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
                            className={btnClasses} variant="contained" type="submit">{t('Create Category')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default CategoriesAdd