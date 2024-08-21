import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
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

function isImageFile(file) {
  if (typeof file === 'string') {
    // If it's a URL, check the file extension
    return /\.(jpeg|jpg|gif|png)$/i.test(file);
  } else if (file instanceof File) {
    // If it's a File object, check the MIME type
    return file.type.startsWith('image/');
  }
  return false;
}

function RequestEdit() {
  const [categories, setCategories] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  //  ================ edit state ================
  const [updateInput, setUpdateInput] = useState({
    Type: '',
    Title: '',
    Category: "",
    Country: "",
    State: "",
    Description: '',
    Status: '',
    Image: null,
    ImagePreview: null,
  })

  function handleForm(e) {
    setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
  }

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setUpdateInput({ ...updateInput, Country: selectedCountry, State: '' });
  };

  const states = getStatesForCountry(updateInput.Country);
  //  ================ edit state ================

  //  ====== get specific request ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${ADD_REQUESTS}/${id}`,)
      .then(function (response) {
        console.log(response.data.request_quote);
        const data = response.data.request_quote;
        setUpdateInput({
          ...updateInput,
          Type: data.type,
          Title: data.name,
          Category: data.category,
          Country: data.country,
          State: data.state,
          Status: data.status,
          Description: data.description,
          ImagePreview: data.upload_file ? (isImageFile(data.upload_file) ? data.upload_file : pdf) : null,
        })
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get specific request ========

  //  ====== get all categories ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${CATEGORIES}`,)
      .then(function (response) {
        console.log(response.data.categories);
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



  //  ================ add function ================

  function handleImageChange(event) {
    const imageFile = event.target.files[0];
    if (imageFile) {
    setUpdateInput({
      ...updateInput,
      Image: imageFile,
      ImagePreview: isImageFile(imageFile) ? URL.createObjectURL(imageFile) : pdf // Create object URL for preview
    });
    }
  }

  function removeImage() {
    setUpdateInput({
      ...updateInput,
      Image: null,
      ImagePreview: null
    });
  }

  async function handleDialogSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let form = new FormData();
    form.append("_method", "PUT");
    form.append("type", updateInput.Type);
    form.append("name", updateInput.Title);
    form.append("description", updateInput.Description);
    form.append("category", updateInput.Category);
    form.append("country", updateInput.Country);
    form.append("state", updateInput.State);
    form.append("status", updateInput.Status);
    if (updateInput.Image !== null) { // Check if an image is selected
      form.append('upload_file', updateInput.Image);
    }
    // console.log(updateInput);
    try {
      const response = await Axios.post(`${ADD_REQUESTS}/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(response);
      showHideToast(t("Edited successfully"));
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

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "requestsadd"].join(" ")}>
      <Container maxWidth="lg">
        <div className="colo-feet" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 20px 0' }}>
          <h4 style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {t('Edit Request')}
          </h4>
          <div style={{ flexGrow: '1', maxWidth: '66%' }} className="firstbox one">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px' }}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('Status')}</InputLabel>
                <Select
                  value={updateInput.Status}
                  onChange={handleForm}
                  name="Status"
                >
                  <MenuItem value="pending">{t('pending')}</MenuItem>
                  <MenuItem value="published">{t('published')}</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <Grid container spacing={2}>
          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, image...")}</p>
          </Grid>
          <Grid xs={12} md={8}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <TextField autoFocus value={updateInput.Title} onChange={handleForm} fullWidth size="small" name="Title" label={t("Title")} variant="outlined" />
                <TextField value={updateInput.Description} onChange={handleForm} fullWidth size="small" name="Description" label={t("Description")} variant="outlined" />

                <FormControl fullWidth size="small">
                  <InputLabel>{t('Type')}</InputLabel>
                  <Select
                    value={updateInput.Type}
                    onChange={handleForm}
                    name="Type"
                    required
                  >
                    <MenuItem value="request supplier">{t('request supplier')}</MenuItem>
                    <MenuItem value="request contractor">{t('request contractor')}</MenuItem>
                    <MenuItem value="request engineering drawing">{t('request engineering drawing')}</MenuItem>
                  </Select>
                </FormControl>

                <TextField value={updateInput.Category} onChange={handleForm} fullWidth size="small" name="Category" label={t("Category")} variant="outlined" />

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
                      {updateInput.ImagePreview && (
                        <div className='preview'>
                          <span className='prev-image'>
                            <img src={updateInput.ImagePreview} alt="" />
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
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Country, State, ...")}</p>
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
                    value={updateInput.Country}
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
                    value={updateInput.State}
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
          </Grid>

        </Grid>

        {/* ================= Edit Button ================ */}
        <Grid container spacing={2}>
          <Grid md={4}></Grid>
          <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
            <button
              onClick={handleDialogSubmit}
              className="submitbtn" variant="contained" type="submit">{t('Edit Request')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default RequestEdit