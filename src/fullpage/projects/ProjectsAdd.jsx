import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/projectsadd.css"
import { Axios } from '../../api/Axios';
import { CATEGORIES, PROJECTS } from '../../api/Api';

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

function ProjectsAdd() {
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
    Name: '',
    Description: '',
    Category: "",
    Country: "",
    State: "",
    Image: null,
    ImagePreview: null
  })

  function handleForm(e) {
    setAddInput({ ...addInput, [e.target.name]: e.target.value })
  }
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

  async function handleDialogSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let form = new FormData();
    form.append("name", addInput.Name);
    form.append("description", addInput.Description);
    form.append("project_category_id", addInput.Category);
    form.append("country", addInput.Country);
    form.append("state", addInput.State);
    if (addInput.Image !== null) { // Check if an image is selected
      form.append('image_path', addInput.Image);
    }
    // console.log(addInput);
    try {
      const response = await Axios.post(`${PROJECTS}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(response);
      showHideToast(t("Added successfully"));
      setAddInput({
        Name: '',
        Description: '',
        Category: '',
        Country: '',
        State: '',
        Image: null,
        ImagePreview: null
      });
      setLoading(false);
      navigate("/Projects");
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
  const btnIsDisabled = !addInput.Name || !addInput.Description || !addInput.Category || !addInput.Country || !addInput.State || !addInput.Image;

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
          {t('Create a new Project')}
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
                <TextField value={addInput.Description} onChange={handleForm} multiline rows={6} fullWidth size="small" name="Description" label={t("Description")} variant="outlined" />

                <FormControl fullWidth size="small">
                  <InputLabel>{t('Category')}</InputLabel>
                  <Select
                    value={addInput.Category}
                    onChange={handleForm}
                    name="Category"
                    required
                  >
                    {categories.map((item, index) => (
                      <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
          </Grid>

          <Grid md={4}>
            <h6 style={{ fontSize: '18px', marginBottom: '4px' }}>{t("Location")}</h6>
            <p style={{ fontSize: '14px', margin: '0', color: '#637381' }}>{t("Country, State, ...")}</p>
          </Grid>
          <Grid xs={12} md={8}>
            <div className="firstbox">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                <TextField value={addInput.Country} onChange={handleForm} fullWidth size="small" name="Country" label={t("Country")} variant="outlined" />
                <TextField value={addInput.State} onChange={handleForm} fullWidth size="small" name="State" label={t("State")} variant="outlined" />
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
              className={btnClasses} variant="contained" type="submit">{t('Create Project')}</button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default ProjectsAdd