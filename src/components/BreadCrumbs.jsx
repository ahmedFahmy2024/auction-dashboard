import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useTranslation } from 'react-i18next';
import { useUsers } from '../context/UsersProvider';

function BreadCrumbs() {
    const { profile } = useUsers();
    const name = profile?.name
    const { t, i18n } = useTranslation();
    
    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb" separator={<span></span>}>
                <Link underline="hover" color="inherit" href="/">
                    {t("Dashboard")}
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/Users"
                >
                    {t("Users")}
                </Link>
                <Typography color="text.primary">{name ? name : (t("User"))}</Typography>
            </Breadcrumbs>
        </div>
    )
}

export default BreadCrumbs