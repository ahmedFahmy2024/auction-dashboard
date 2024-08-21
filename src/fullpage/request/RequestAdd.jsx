import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/requestsadd.css"
import { Axios } from '../../api/Axios';
import { CATEGORIES, REQUESTS, ADD_REQUESTS } from '../../api/Api';
import { getStatesForCountry } from "../../helper/StateName";
import pdf from '../../assets/pdf.svg'

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function RequestAdd() {
    const [categories, setCategories] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    //  ====== get all categories ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${CATEGORIES}`,)
            .then(function (response) {
                // console.log(response.data.categories);
                setCategories(response.data.categories);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast(error.response.data.message, 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get all categories ========

    //  ================ add state ================
    const [addInput, setAddInput] = useState({
        Type: '',
        Title: '',
        Category: "",
        Country: "",
        State: "",
        Description: '',
        Notification: '',
        Image: null,
        ImagePreview: null
    })

    function handleForm(e) {
        setAddInput({ ...addInput, [e.target.name]: e.target.value })
    }

    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        setAddInput({ ...addInput, Country: selectedCountry, State: '' });
    };

    const states = getStatesForCountry(addInput.Country);
    //  ================ add state ================

    //  ================ add function ================

    function handleImageChange(event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const isImage = imageFile.type.startsWith('image/');
        setAddInput({
            ...addInput,
            Image: imageFile,
            ImagePreview: isImage ? URL.createObjectURL(imageFile) : pdf // Create object URL for preview
        });
        }
    }

    function removeImage() {
        setAddInput({
            ...addInput,
            Image: null,
            ImagePreview: null
        });
    }

    async function handleDialogSubmit(e) {
        e.preventDefault();
        setLoading(true);

        let form = new FormData();
        form.append("type", addInput.Type);
        form.append("name", addInput.Title);
        form.append("description", addInput.Description);
        form.append("category", addInput.Category);
        form.append("notification_type", addInput.Notification);
        form.append("country", addInput.Country);
        form.append("state", addInput.State);
        if (addInput.Image !== null) { // Check if an image is selected
            form.append('upload_file', addInput.Image);
        }
        // console.log(addInput);
        try {
            const response = await Axios.post(`${ADD_REQUESTS}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // console.log(response);
            showHideToast(t("Added successfully"));
            setAddInput({
                Title: '',
                Type: '',
                Description: '',
                Category: '',
                Country: '',
                State: '',
                Image: null,
                ImagePreview: null
            });
            setLoading(false);
            navigate("/Requests");
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


    // ============== btn classes ==============
    const btnIsDisabled = !addInput.Title || !addInput.Description || !addInput.Category || !addInput.Country || !addInput.State || !addInput.Type || !addInput.Image;

    let btnClasses = ""
    if (btnIsDisabled) {
        btnClasses = "disabled"
    } else {
        btnClasses = "submitbtn"
    }
    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "requestsadd"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Create a new Request')}
                </h4>
                <Grid container spacing={2}>
                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, image...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <TextField autoFocus value={addInput.Title} onChange={handleForm} fullWidth size="small" name="Title" label={t("Title")} variant="outlined" />
                                <TextField value={addInput.Description} onChange={handleForm} fullWidth size="small" name="Description" label={t("Description")} variant="outlined" />

                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('Type')}</InputLabel>
                                    <Select
                                        value={addInput.Type}
                                        onChange={handleForm}
                                        name="Type"
                                        required
                                    >
                                        <MenuItem value="request supplier">{t('request supplier')}</MenuItem>
                                        <MenuItem value="request contractor">{t('request contractor')}</MenuItem>
                                        <MenuItem value="request engineering drawing">{t('request engineering drawing')}</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('Category')}</InputLabel>
                                    <Select
                                        value={addInput.Category}
                                        onChange={handleForm}
                                        name="Category"
                                        required
                                    >
                                        {categories.map((item, index) => (
                                            <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Images")}</h6>
                                    <div style={{ width: '100%', position: 'relative' }}>
                                        <div className='images' onClick={() => document.querySelector('.input-field').click()}>
                                            <input onChange={handleImageChange} className='input-field' style={{ display: 'none' }} type="file" />
                                            <div className='image'>
                                                <CloudUploadIcon sx={{ fontSize: '150px', color: '#212b36' }} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
                                                    <h6 style={{ fontSize: '1.125rem', margin: '0', fontWeight: 700 }}>{t("Drop or Select file")}</h6>
                                                    <p className='para'>
                                                        {t("Drop files here or click")}
                                                        <span className='browse'>{t("browse")}</span>
                                                        {t("thorough your machine")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ margin: '24px 0 24px 0' }}>
                                            {addInput.ImagePreview && (
                                                <div className='preview'>
                                                    <span className='prev-image'>
                                                        <img src={addInput.ImagePreview } alt="" />
                                                        <button className='close' onClick={() => removeImage()}>
                                                            <CloseIcon sx={{ fontSize: '14px', color: 'white' }} />
                                                        </button>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>

                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Location")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Country, State ,..")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <FormControl fullWidth size="small" required sx={{ minWidth: 120 }} >
                                    <InputLabel id="demo-select-small-label1">{t("Select Country")}</InputLabel>
                                    <Select
                                        className={[locale === 'en' ? 'ltr' : 'rtl', 'checkout-select'].join(' ')}
                                        labelId="demo-select-small-label1"
                                        id="demo-select-small1"
                                        name='Country'
                                        value={addInput.Country}
                                        label={t("Select Country")}
                                        onChange={handleCountryChange}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    '& .MuiMenuItem-root': {
                                                        justifyContent: locale === 'en' ? 'flex-start' : 'flex-end',
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value="" disabled>{t('select country')}</MenuItem>
                                        <MenuItem value="Egypt">{t("Egypt")}</MenuItem>
                                        <MenuItem value="Saudi Arabia">{t("Saudi Arabia")}</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth size="small" required sx={{ minWidth: 120 }} >
                                    <InputLabel id="demo-select-small-label2">{t("Select State")}</InputLabel>
                                    <Select
                                        className={[locale === 'en' ? 'ltr' : 'rtl', 'checkout-select'].join(' ')}
                                        labelId="demo-select-small-label2"
                                        id="demo-select-small2"
                                        name='State'
                                        value={addInput.State}
                                        label={t("Select State")}
                                        onChange={handleForm}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    '& .MuiMenuItem-root': {
                                                        justifyContent: locale === 'en' ? 'flex-start' : 'flex-end',
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value="" disabled>{t('select state')}</MenuItem>
                                        {states.map((state) => (
                                            <MenuItem key={state.name} value={state.name}>{locale === 'en' ? state.labelEn : state.labelAr}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '14px', margin: '0' }}>{t("نطاق إرسال المشروع للأعضاء")}</h3>
                                    <div style={{ margin: '8px 0 8px', display: 'flex', gap: '20px' }}>
                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                            <input type="radio" value='all' checked={addInput.Notification === 'all'} onChange={(e) => setAddInput({ ...addInput, Notification: e.target.value })} /> {t("all")}
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                            <input type="radio" value='country' checked={addInput.Notification === 'country'} onChange={(e) => setAddInput({ ...addInput, Notification: e.target.value })} /> {t("country")}
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                            <input type="radio" value='state' checked={addInput.Notification === 'state'} onChange={(e) => setAddInput({ ...addInput, Notification: e.target.value })} /> {t("state")}
                                        </div>
                                    </div>
                                </div>
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
                            className={btnClasses} variant="contained" type="submit">{t('Create Request')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default RequestAdd