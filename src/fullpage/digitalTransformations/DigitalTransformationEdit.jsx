import { useState, useContext, useEffect } from "react";
import { LocalContext } from '../../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../../context/ToastProvider';
import "../../css/complain.css"
import { Axios } from '../../api/Axios';
import { DIGITAL_TRANFORMATION } from '../../api/Api';
import { Icon } from '@iconify/react';
import TransformationsChat from "./TransformationsChat";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


function DigitalTransformationEdit() {
    const [complains, setComplains] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    // console.log("complains", complains)

    //  ================ edit state ================
    const [updateInput, setUpdateInput] = useState({
        Name: "",
        Email: "",
        Phone: "",
        Country: "",
        State: "",
        Status: "",
        Image: null,
        Type: ""
    })

    //  ================ edit state ================

    //  ====== get specific complain ========
    const fetchComplain = async () => {
        try {
            const response = await Axios.get(`${DIGITAL_TRANFORMATION}/${id}`);
            const complain = response.data;
            const user = response.data.user;
            setUpdateInput({
                ...updateInput,
                Name: user.name,
                Email: user.email,
                Phone: user.phone,
                Country: user.country,
                State: user.state,
                Image: user.profile_image,
                Type: user.account_type,
                Status: complain.status,
            })
            setComplains(complain);
        } catch (error) {
            console.log(error);
        }
    }

    //  ====== get specific complain ========

    useEffect(() => {
        let interval;
        if (id) {
            fetchComplain();
            interval = setInterval(fetchComplain, 10000); // Poll every 1 minute
        }
        return () => clearInterval(interval); // Clean up interval on component unmount
    }, [id, updateTrigger]);


    // ================= edit complain ================
    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setUpdateInput(prevState => ({ ...prevState, Status: newStatus }));

        try {
            setLoading(true);
            await Axios.put(`${DIGITAL_TRANFORMATION}/${id}`, { status: newStatus });
            showHideToast(t("Edited successfully"));
            setUpdateTrigger((prev) => prev + 1);
            setLoading(false);
        } catch (error) {
            console.log(error);
            showHideToast(t("An error occurred. Please try again."), "error");
            setLoading(false);
        }
    };
    // ================= edit complain ================

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "complain"].join(" ")}>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid xs={12} md={8}>
                        <div className="chat-area">
                            {complains && <TransformationsChat complains={complains} setUpdateTrigger={setUpdateTrigger} />}
                        </div>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <div className="firstbox one">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px' }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('Status')}</InputLabel>
                                    <Select
                                        value={updateInput.Status}
                                        onChange={handleStatusChange}
                                        name="Status"
                                    >
                                        <MenuItem value="open">{t('Open')}</MenuItem>
                                        <MenuItem value="in_progress">{t('in progress')}</MenuItem>
                                        <MenuItem value="resolved">{t('resolved')}</MenuItem>
                                        <MenuItem value="closed">{t('closed')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div className="firstbox">
                            <div className="info">
                                <div className="card">
                                    <div className="card-title">
                                        <div className="image-profile">
                                            <Avatar alt={updateInput.Name} src={updateInput.Image} sx={{ width: 96, height: 96 }} />
                                        </div>
                                        <h6>{updateInput.Name}</h6>
                                        <p className="job-title">{updateInput.Type}</p>
                                    </div>
                                    <h3>{t("Informations")}</h3>
                                    <div className="card-content">
                                        <div className="stacks">
                                            <Icon icon="fluent:mail-24-filled" width="22" height="22" />
                                            <h6>{updateInput.Email}</h6>
                                        </div>
                                        <div className="stacks">
                                            <Icon icon="ph:phone-list-fill" width="22" height="22" />
                                            <h6>{updateInput.Phone}</h6>
                                        </div>
                                        <div className="stacks">
                                            <Icon icon="mingcute:location-fill" width="22" height="22" />
                                            <h6>{updateInput.Country}</h6>
                                        </div>
                                        <div className="stacks">
                                            <Icon icon="mingcute:location-fill" width="22" height="22" />
                                            <h6>{updateInput.State}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Grid>
                </Grid>
            </Container>

        </div>
    )
}

export default DigitalTransformationEdit