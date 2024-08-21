import { LocalContext } from '../context/LocalContext';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import "../css/homesec.css";

import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';

function TableSection({ first, second, third, firstLink, secondLink, thirdLink, forth, forthLink, fifth, fifthLink, sixth, sixthLink, seventh, seventhLink, eighth, eighthLink, ninth, ninthLink, icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, gold, silver, scrap }) {
    const { t, i18n } = useTranslation();
    const { locale, setLocale } = useContext(LocalContext);

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "homesecondsec"].join(" ")}>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={4} sx={{ padding: '12px' }}>
                    <div className="Stack stack3" style={{ background: gold ? gold : "" }}>
                        <div className="icon">
                            <Icon icon={icon1} width="64" height="64" />
                            <h3>{firstLink}</h3>
                            <h6>{t(first)}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} md={4} sx={{ padding: '12px' }}>
                    <div className="Stack stack1" style={{ background: gold ? gold : "" }}>
                        <div className="icon">
                            <Icon icon={icon2} width="64" height="64" />
                            <h3>{secondLink}</h3>
                            <h6>{t(second)}</h6>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} md={4} sx={{ padding: '12px' }}>
                    <div className="Stack stack2" style={{ background: gold ? gold : "" }}>
                        <div className="icon">
                            <Icon icon={icon3} width="64" height="64" />
                            <h3>{thirdLink}</h3>
                            <h6>{t(third)}</h6>
                        </div>
                    </div>
                </Grid>
                {forth && (
                    <Grid xs={12} sm={6} md={4} sx={{ padding: '12px' }}>
                        <div className="Stack stack4" style={{ background: silver ? silver : "" }}>
                            <div className="icon">
                                <Icon icon={icon4} width="64" height="64" />
                                <h3>{forthLink}</h3>
                                <h6>{t(forth)}</h6>
                            </div>
                        </div>
                    </Grid>
                )}
                {fifth && (
                    <Grid xs={12} sm={6} md={4} sx={{ padding: '12px' }}>
                        <div className="Stack stack5" style={{ background: silver ? silver : "" }}>
                            <div className="icon">
                                <Icon icon={icon5} width="64" height="64" />
                                <h3>{fifthLink}</h3>
                                <h6>{t(fifth)}</h6>
                            </div>
                        </div>
                    </Grid>
                )}
                {sixth && (
                    <Grid xs={12} sm={6} md={4} sx={{ padding: '12px' }}>
                        <div className="Stack stack6" style={{ background: silver ? silver : "" }}>
                            <div className="icon">
                                <Icon icon={icon6} width="64" height="64" />
                                <h3>{sixthLink}</h3>
                                <h6>{t(sixth)}</h6>
                            </div>
                        </div>
                    </Grid>
                )}
                {seventh && (
                    <Grid xs={12} sm={6} md={4} sx={{ padding: '12px' }}>
                        <div className="Stack stack7" style={{ background: scrap ? scrap : "" }}>
                            <div className="icon">
                                <Icon icon={icon7} width="64" height="64" />
                                <h3>{seventhLink}</h3>
                                <h6>{t(seventh)}</h6>
                            </div>
                        </div>
                    </Grid>
                )}
                {eighth && (
                    <Grid xs={12} sm={6} md={4} sx={{ padding: '12px' }}>
                        <div className="Stack stack8" style={{ background: scrap ? scrap : "" }}>
                            <div className="icon">
                                <Icon icon={icon8} width="64" height="64" />
                                <h3>{eighthLink}</h3>
                                <h6>{t(eighth)}</h6>
                            </div>
                        </div>
                    </Grid>
                )}
                {ninth && (
                    <Grid xs={12} sm={6} md={4} sx={{ padding: '12px' }}>
                        <div className="Stack stack9" style={{ background: scrap ? scrap : "" }}>
                            <div className="icon">
                                <Icon icon={icon9} width="64" height="64" />
                                <h3>{ninthLink}</h3>
                                <h6>{t(ninth)}</h6>
                            </div>
                        </div>
                    </Grid>
                )}
            </Grid>
        </div>
    );
}

export default TableSection;
