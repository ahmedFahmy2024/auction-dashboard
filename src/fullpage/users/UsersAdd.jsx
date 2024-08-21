import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/usersadd.css"
import { Axios } from '../../api/Axios';
import { USERS } from '../../api/Api';
import pdf from '../../assets/pdf.svg'
import { getStatesForCountry } from "../../helper/StateName";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { Stack } from '@mui/material';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

function UsersAdd() {
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    //  ================ add state ================
    const [addInput, setAddInput] = useState({
        Name: '',
        Email: '',
        Password: '',
        Phone: '',
        AccountType: '',
        CompanyName: '',
        CommercialRegister: '',
        TaxNumber: '',
        Country: '',
        State: '',
        IsAdmin: false,
        Image: null,
        ImagePreview: null,
        File: null,
        FilePreview: null,
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
        setAddInput({
            ...addInput,
            Image: imageFile,
            ImagePreview: URL.createObjectURL(imageFile) // Create object URL for preview
        });
    }

    function removeImage() {
        setAddInput({
            ...addInput,
            Image: null,
            ImagePreview: null
        });
    }

    function handleFileChange(event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const isImage = imageFile.type.startsWith('image/');
            setAddInput({
                ...addInput,
                File: imageFile,
                FilePreview: isImage ? URL.createObjectURL(imageFile) : pdf // Create object URL for preview
            });
        }
    }
    function removeFile() {
        setAddInput({
            ...addInput,
            File: null,
            FilePreview: null
        });
    }

    async function handleDialogSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // Convert IsAdmin to 1 if it's true, otherwise 0
        const isAdminValue = addInput.IsAdmin ? 1 : 0;

        let form = new FormData();
        form.append('name', addInput.Name);
        form.append('email', addInput.Email);
        form.append('password', addInput.Password);
        form.append('phone', addInput.Phone);
        form.append('account_type', addInput.AccountType);
        form.append('company_name', addInput.CompanyName);
        form.append('commercial_register', addInput.CommercialRegister);
        form.append('tax_number', addInput.TaxNumber);
        form.append('country', addInput.Country);
        form.append('state', addInput.State);
        form.append('is_admin', isAdminValue);
        if (addInput.Image !== null) { // Check if an image is selected
            form.append('profile_image', addInput.Image);
        }

        if (addInput.File !== null) { // Check if an image is selected
            form.append('accommodation_type', addInput.File);
        }

        // console.log(addInput);
        try {
            const response = await Axios.post(`${USERS}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // console.log(response);
            showHideToast(t("Added successfully"));
            setAddInput({
                Name: "",
                Email: "",
                Password: "",
                Phone: "",
                AccountType: "",
                CompanyName: "",
                CommercialRegister: "",
                TaxNumber: "",
                Country: "",
                State: "",
                IsAdmin: false,
                Image: null,
                ImagePreview: null,
                File: null,
                FilePreview: null,
            });
            setLoading(false);
            navigate("/Users");
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
    const btnIsDisabled = !addInput.Name || !addInput.Email || !addInput.Password;

    let btnClasses = ""
    if (btnIsDisabled) {
        btnClasses = "disabled"
    } else {
        btnClasses = "submitbtn"
    }

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "usersAdd"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Create a new User')}
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
                                <TextField value={addInput.Email} onChange={handleForm} fullWidth size="small" name="Email" label={t("Email")} variant="outlined" />
                                <TextField value={addInput.Password} onChange={handleForm} fullWidth size="small" name="Password" label={t("Password")} variant="outlined" type="password" />
                                <TextField value={addInput.Phone} onChange={handleForm} fullWidth size="small" name="Phone" label={t("Phone")} variant="outlined" />

                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('Account Type')}</InputLabel>
                                    <Select
                                        value={addInput.AccountType}
                                        onChange={handleForm}
                                        name="AccountType"
                                        required
                                    >
                                        <MenuItem value="supplier">{t("supplier")}</MenuItem>
                                        <MenuItem value="individual_contractor">{t("individual contractor")}</MenuItem>
                                        <MenuItem value="corporate_contractor">{t("corporate contractor")}</MenuItem>
                                        <MenuItem value="engineering_office">{t("engineering office")}</MenuItem>
                                    </Select>
                                </FormControl>

                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <span style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.57143 }}>{t('Admin')}</span>
                                    <Switch
                                        checked={addInput.IsAdmin}
                                        onChange={(e) => {
                                            setAddInput({ ...addInput, IsAdmin: e.target.checked })
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                </Stack>

                            </div>
                        </div>
                    </Grid>

                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Location")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Country, Company, Tax, Address...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>

                        <div style={{ marginBottom: '24px' }} className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Images")}</h6>
                                    <div style={{ width: '100%', position: 'relative' }}>
                                        <div className='images' onClick={() => document.querySelector('.input-field').click()}>
                                            <input onChange={handleImageChange} className='input-field' style={{ display: 'none' }} accept="image/*" type="file" />
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
                                                        <img src={addInput.ImagePreview} alt="" />
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

                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <TextField value={addInput.CompanyName} onChange={handleForm} fullWidth size="small" name="CompanyName" label={t("Company Name")} variant="outlined" />
                                <TextField value={addInput.CommercialRegister} onChange={handleForm} fullWidth size="small" name="CommercialRegister" label={t("Commercial Register")} variant="outlined" type="number" />
                                <TextField value={addInput.TaxNumber} onChange={handleForm} fullWidth size="small" name="TaxNumber" label={t("Tax Number")} variant="outlined" type="number" />
                                <div className='two-inputs'>
                                    <FormControl fullWidth size="small" required sx={{ minWidth: 120, marginBottom: '16px' }} >
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
                                </div>
                            </div>
                        </div>

                        <div className="firstbox" style={{ marginTop: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h6 style={{ fontSize: '14px', margin: '0' }}>{t("نوع الإقامة")}</h6>
                                    <div style={{ width: '100%', position: 'relative' }}>
                                        <div className='images' onClick={() => document.querySelector('.input-field1').click()}>
                                            <input onChange={handleFileChange} className='input-field1' style={{ display: 'none' }} accept="image/*" type="file" />
                                            <div className='image'>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
                                                    <h6 style={{ fontSize: '1.125rem', margin: '0', fontWeight: 700 }}>{t("Drop or Select file")}</h6>
                                                    <p className='para'>
                                                        {t("Drop file here or click")}
                                                        <span className='browse'>{t("browse")}</span>
                                                        {t("thorough your machine")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ margin: '10px 0 10px 0' }}>
                                            {addInput.FilePreview && (
                                                <div className='preview'>
                                                    <span className='prev-image'>
                                                        <img src={addInput.FilePreview} alt="" />
                                                        <button className='close' onClick={() => removeFile()}>
                                                            <CloseIcon sx={{ fontSize: '14px', color: 'white' }} />
                                                        </button>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <p className='details-info-imp'>{t("The upload file field must be a file of type: jpeg, png, jpg, gif, pdf, doc, docx.")}</p>

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
                            className={btnClasses} variant="contained" type="submit">{t('Create User')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default UsersAdd