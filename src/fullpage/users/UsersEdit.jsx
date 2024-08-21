import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
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

function UsersEdit() {
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  //  ================ edit state ================
  const [updateInput, setUpdateInput] = useState({
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
    setUpdateInput({ ...updateInput, [e.target.name]: e.target.value })
  }

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setUpdateInput({ ...updateInput, Country: selectedCountry, State: '' });
  };

  const states = getStatesForCountry(updateInput.Country);
  //  ================ edit state ================

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

  //  ====== get specific user ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${USERS}/${id}`,)
      .then(function (response) {
        // console.log(response.data.user);
        const project = response.data.user;
        setUpdateInput({
          ...updateInput,
          Name: project.name,
          Email: project.email,
          Password: project.password,
          Phone: project.phone,
          AccountType: project.account_type,
          CompanyName: project.company_name,
          CommercialRegister: project.commercial_register,
          TaxNumber: project.tax_number,
          Country: project.country,
          State: project.state,
          AccommodationType: project.accommodation_type,
          IsAdmin: project.is_admin,
          ImagePreview: project.profile_image,
          FilePreview: project.accommodation_type ? (isImageFile(project.accommodation_type) ? project.accommodation_type : pdf) : null,
        })
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, 'error');
        setLoading(false);
      });
  }, []);
  //  ====== get specific user ========

  //  ================ edit function ================
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    const imagePreviewURL = URL.createObjectURL(imageFile);
    setUpdateInput({
      ...updateInput,
      Image: imageFile,
      ImagePreview: imagePreviewURL
    });
  };

  const removeImage = () => {
    setUpdateInput({
      ...updateInput,
      Image: null,
      ImagePreview: null
    });
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setUpdateInput({
        ...updateInput,
        File: file,
        FilePreview: isImageFile(file) ? URL.createObjectURL(file) : pdf // Create object URL for preview
      });
    }
  }

  async function handleDialogSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Convert IsAdmin to 1 if it's true, otherwise 0
    const isAdminValue = updateInput.IsAdmin ? 1 : 0;

    let form = new FormData();
    form.append('_method', 'PUT');
    form.append('name', updateInput.Name);
    form.append('email', updateInput.Email);
    form.append('password', updateInput.Password);
    form.append('phone', updateInput.Phone);
    form.append('account_type', updateInput.AccountType);
    form.append('company_name', updateInput.CompanyName);
    form.append('commercial_register', updateInput.CommercialRegister);
    form.append('tax_number', updateInput.TaxNumber);
    form.append('country', updateInput.Country);
    form.append('state', updateInput.State);
    form.append('is_admin', isAdminValue);
    if (updateInput.Image !== null) { // Check if an image is selected
      form.append('profile_image', updateInput.Image);
    }

    if (updateInput.File) {
      // Check if an image is selected
      form.append("accommodation_type", updateInput.File);
    }

    try {
      const response = await Axios.post(`${USERS}/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(response);
      showHideToast(t("Edited successfully"));
      setLoading(false);
      navigate("/Users");
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "usersAdd"].join(" ")}>
      <Container maxWidth="lg">
        <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 40px 0' }}>
          {t('Edit User')}
        </h4>
        <Grid container spacing={2}>
          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Title, short description, image...")}</p>
          </Grid>
          <Grid xs={12} md={8}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <TextField autoFocus value={updateInput.Name} onChange={handleForm} fullWidth size="small" name="Name" label={t("Name")} variant="outlined" />
                <TextField value={updateInput.Email} onChange={handleForm} fullWidth size="small" name="Email" label={t("Email")} variant="outlined" />
                <TextField value={updateInput.Password} onChange={handleForm} fullWidth size="small" name="Password" label={t("Password")} variant="outlined" type="password" />
                <TextField value={updateInput.Phone} onChange={handleForm} fullWidth size="small" name="Phone" label={t("Phone")} variant="outlined" />

                <FormControl fullWidth size="small">
                  <InputLabel>{t('Account Type')}</InputLabel>
                  <Select
                    value={updateInput.AccountType}
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
                    checked={updateInput.IsAdmin}
                    onChange={(e) => {
                      setUpdateInput({ ...updateInput, IsAdmin: e.target.checked })
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>

              </div>
            </div>
          </Grid>

          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Details")}</h6>
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

            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <TextField value={updateInput.CompanyName} onChange={handleForm} fullWidth size="small" name="CompanyName" label={t("Company Name")} variant="outlined" />
                <TextField value={updateInput.CommercialRegister} onChange={handleForm} fullWidth size="small" name="CommercialRegister" label={t("Commercial Register")} variant="outlined" type="number" />
                <TextField value={updateInput.TaxNumber} onChange={handleForm} fullWidth size="small" name="TaxNumber" label={t("Tax Number")} variant="outlined" type="number" />
                <div className='two-inputs'>
                  <FormControl fullWidth size="small" required sx={{ minWidth: 120, marginBottom: '16px' }} >
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
                      {updateInput.FilePreview && (
                        <div className='preview'>
                          <span className='prev-image'>
                            <img src={updateInput.FilePreview} alt="" />
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

        {/* ================= Edit Button ================ */}
        <Grid container spacing={2}>
          <Grid md={4}></Grid>
          <Grid xs={12} md={8} sx={{ padding: '16px', textAlign: 'right' }}>
            <button
              onClick={handleDialogSubmit}
              className="submitbtn" variant="contained" type="submit">{t('Edit User')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default UsersEdit