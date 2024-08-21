import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/scrapsadd.css"
import { Axios } from '../../api/Axios';
import { SCRAPS } from '../../api/Api';

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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function ScrapsAdd() {
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        moment.locale(locale);
      }, [locale]);

    //  ================ add state ================
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const [addInput, setAddInput] = useState({
        Name: '',
        Description: '',
        Category: "",
        Quantity: '',
        MinimumQuantity: '',
        Unit: '',
        Location: '',
    })

    function handleForm(e) {
        setAddInput({ ...addInput, [e.target.name]: e.target.value })
    }

    function handleDateChange(date) {
        setSelectedDate(date);
    }
    //  ================ add state ================

    //    =============== add functions ================
    function handleImageChange(event) {
        const files = event.target.files;

        // Filter out non-File objects
        const validFiles = Array.from(files).filter(file => file instanceof File);

        const newSelectedImages = [...selectedImages, ...validFiles];
        setSelectedImages(newSelectedImages);

        // Preview images
        const previews = validFiles.map(file => URL.createObjectURL(file));

        // Concatenate new previews with existing previews
        setImagePreviews([...imagePreviews, ...previews]);
    }

    // Remove image from selected images
    const removeImage = (index) => {
        // Filter out the image at the specified index from both arrays
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

        // Update the state with the filtered arrays
        setSelectedImages(updatedImages);
        setImagePreviews(updatedPreviews);
    };

    async function handleDialogSubmit(e) {
        e.preventDefault();
        setLoading(true);
        let form = new FormData();
        form.append("name", addInput.Name);
        form.append("description", addInput.Description);
        form.append("category", addInput.Category);
        form.append("quantity", addInput.Quantity);
        form.append("min_quantity", addInput.MinimumQuantity);
        form.append("unit", addInput.Unit);
        form.append("location", addInput.Location);
        for (let i = 0; i < selectedImages.length; i++) {
            form.append(`images[]`, selectedImages[i]);
        }

        const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;
        form.append("scrap_duration", formattedDate);

        try {
            const response = await Axios.post(`${SCRAPS}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            // console.log(response);
            showHideToast(t("Added successfully"));
            setAddInput({
                Name: "",
                Description: "",
                Category: "",
                Quantity: "",
                MinimumQuantity: "",
                Unit: "",
                Location: "",
            });
            setSelectedImages([]);
            setImagePreviews([]);
            setSelectedDate(null);
            setLoading(false);
            navigate("/Scraps");
        } catch (error) {
            console.log(error);
            setLoading(false);
            showHideToast(t("An error occurred. Please try again."), "error");
        }
    }
    //    =============== add functions ================

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
    const btnIsDisabled = !addInput.Name || !addInput.Description || !addInput.Category || !addInput.Quantity || !addInput.MinimumQuantity || !addInput.Unit || !addInput.Location || !selectedImages.length;

    let btnClasses = ""
    if (btnIsDisabled) {
        btnClasses = "disabled"
    } else {
        btnClasses = "submitbtn"
    }

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "ProjectsAdd"].join(" ")}>
            <Container maxWidth="lg">
                <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
                    {t('Create a new Scrap')}
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
                                <TextField value={addInput.Description} onChange={handleForm} fullWidth size="small" name="Description" label={t("Description")} variant="outlined" />
                                <TextField value={addInput.Category} onChange={handleForm} fullWidth size="small" name="Category" label={t("Category")} variant="outlined" />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h6 style={{ fontSize: '14px', margin: '0' }}>{t("Images")}</h6>
                                    <div style={{ width: '100%', position: 'relative' }}>
                                        <div className='images' onClick={() => document.querySelector('.input-field').click()}>
                                            <input onChange={handleImageChange} className='input-field' style={{ display: 'none' }} accept="image/*" multiple type="file" />
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
                                            {imagePreviews.map((image, index) => (
                                                <div className='preview' key={index}>
                                                    <span className='prev-image'>
                                                        <img src={image} alt="" />
                                                        <button className='close' onClick={() => removeImage(index)}>
                                                            <CloseIcon sx={{ fontSize: '14px', color: 'white' }} />
                                                        </button>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </Grid>

                    <Grid md={4}>
                        <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Quantity")}</h6>
                        <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Unit, Location ...")}</p>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <div className="firstbox">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <TextField value={addInput.Quantity} onChange={handleForm} fullWidth size="small" name="Quantity" label={t("Quantity")} variant="outlined" />
                                <TextField value={addInput.MinimumQuantity} onChange={handleForm} fullWidth size="small" name="MinimumQuantity" label={t("Min Quantity")} variant="outlined" />
                                <TextField value={addInput.Unit} onChange={handleForm} fullWidth size="small" name="Unit" label={t("Unit")} variant="outlined" />
                                <TextField value={addInput.Location} onChange={handleForm} fullWidth size="small" name="Location" label={t("Location")} variant="outlined" />
                                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
                                    <DemoContainer components={["DatePicker"]}>
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            label={t("تاريخ انتهاء المزاد")}
                                            minDate={moment()} // This sets the minimum date to today
                                            disablePast // This disables all dates in the past
                                            value={selectedDate}
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
                            disabled={btnIsDisabled}
                            className={btnClasses} variant="contained" type="submit">{t('Create Scrap')}</button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default ScrapsAdd