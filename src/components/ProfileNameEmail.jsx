import Avatar from '@mui/material/Avatar';
import { useUsers } from '../context/UsersProvider';
import { useTranslation } from 'react-i18next';
import { useContext } from "react";
import { LocalContext } from '../context/LocalContext'

function ProfileNameEmail() {
  const { locale, setLocale } = useContext(LocalContext);
    const { profile } = useUsers();
    const name = profile?.name
    const email = profile?.email
    const image = profile?.profile_image 
    const { t, i18n } = useTranslation();
    
  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "first"].join(" ")} >
    <div className="only">
      {image ? (
        <Avatar className="profile-pic" alt="Remy Sharp" src={image} />
      ) : (
        <Avatar className="profile-pic">{name?.charAt(0)}</Avatar>
      )}
      
      <div className="text">
        <span className="name">{name}</span>
        <span className="email">{email}</span>
      </div>
    </div>
  </div>
  )
}

export default ProfileNameEmail