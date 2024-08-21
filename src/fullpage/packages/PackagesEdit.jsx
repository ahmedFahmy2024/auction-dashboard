import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/packagesadd.css"
import { Axios } from '../../api/Axios';
import { PACKAGES } from '../../api/Api';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function PackagesEdit() {
    const [packages, setPackages] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    //  ================ edit state ================
    const [updateInput, setUpdateInput] = useState({
        Price: '',
    })

    function handleForm(e) {
        setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
    }
    //  ================ edit state ================

    //  ====== get all Packages ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${PACKAGES}`,)
            .then(function (response) {
                // console.log(response.data);
                setPackages(response.data);

                const packageToEdit = response.data.find(pkg => pkg.id === parseInt(id));
                // console.log("packageToEdit", packageToEdit)
                if (packageToEdit) {
                    setUpdateInput({ Price: packageToEdit.price });
                }

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
            price: updateInput.Price
        }

        try {
            const response = await Axios.put(`${PACKAGES}/${id}`, param);
            //   console.log(response);
            showHideToast(t("Edited successfully"));
            setLoading(false);
            navigate("/Packages");
        } catch (error) {
            console.log(error);
            setLoading(false);
            showHideToast(t("An error occurred. Please try again."), "error");
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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "packagesAdd"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Edit Package')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Packages, Price, ...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>

                                <TextField value={updateInput.Price} onChange={handleForm} fullWidth size="small" name="Price" label={t("Price")} variant="outlined" />
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
                            className="submitbtn" variant="contained" type="submit">{t('Edit Package')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default PackagesEdit