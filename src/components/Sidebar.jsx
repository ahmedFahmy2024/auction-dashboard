import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import "../css/sidebar.css"

import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LocalContext } from '../context/LocalContext';
import { useContext } from 'react';


const array1 = [
    { key: 'Dashboard', icon: <Icon color='#0e5c98' width='22' height='22' icon="tabler:dashboard" />, path: "/", role: [1] },
    { key: 'Notifications', icon: <Icon color='#0e5c98' icon="solar:bell-bing-linear" width="22" height="22" />, path: "/Notifications", role: [1] },
  ];

  const array2 = [
    { key: 'Projects', icon: <Icon color='#0e5c98' icon="octicon:project-roadmap-24" width="22" height="22" />, path: "/Projects", role: [1] },
    { key: 'Categories', icon: <Icon color='#0e5c98' width='22' height='22' icon="solar:bill-check-outline" />, path: "/Categories", role: [1] },
  ];

const array3 = [
    { key: 'Packages', icon: <Icon color='#0e5c98' icon="iconoir:packages" width="22" height="22" />, path: "/Packages", role: [1] },
    { key: 'Subscriptions', icon: <Icon color='#0e5c98' icon="streamline:subscription-cashflow" width="22" height="22" />, path: "/Subscriptions", role: [1] },
    // { key: 'Settings', icon: <Icon width='22' height='22' icon="icons8:services" />, path: "/settings", role: [1] },
  ];

  const array4 = [
    { key: 'Users', icon: <Icon color='#0e5c98' width='22' height='22' icon="mage:users" />, path: "/Users", role: [1] },
    { key: 'Supplier Users', icon: <Icon color='#0e5c98' icon="mdi:clipboard-user-outline" width="22" height="22" />, path: "/SupplierUsers", role: [1] },
    { key: 'Individual Users', icon: <Icon color='#0e5c98' icon="solar:user-rounded-bold-duotone" width="22" height="22" />, path: "/IndividualUsers", role: [1] },
    { key: 'Corporate Users', icon: <Icon color='#0e5c98' icon="fluent:building-people-16-regular" width="22" height="22" />, path: "/CorporateUsers", role: [1] },
    { key: 'Engineering Users', icon: <Icon color='#0e5c98' icon="material-symbols-light:engineering-outline" width="22" height="22" />, path: "/EngineeringUsers", role: [1] },
  ]

const array5 = [
    { key: 'Transcations', icon: <Icon color='#0e5c98' width='22' height='22' icon="ep:money" />, path: "/Transcations", role: [1] },
    { key: 'Requests', icon: <Icon color='#0e5c98' icon="bi:file-text" width="22" height="22" />, path: "/Requests", role: [1] },
    { key: 'Portfolio', icon: <Icon color='#0e5c98' icon="iconamoon:profile-circle-light" width="22" height="22" />, path: "/Portfolio", role: [1] },
    { key: 'Scraps', icon: <Icon color='#0e5c98' icon="hugeicons:crane" width="22" height="22" />, path: "/Scraps", role: [1] },
    { key: 'Bids', icon: <Icon color='#0e5c98' icon="streamline:justice-hammer" width="22" height="22" />, path: "/Bids", role: [1] },
  ];

  const array6 = [
    { key: 'Complains', icon: <Icon color='#0e5c98' icon="hugeicons:complaint" width="22" height="22" />, path: "/Complains", role: [1] },
    { key: 'Chat', icon: <Icon color='#0e5c98' icon="lets-icons:chat-alt-2" width="22" height="22" />, path: "/Chat", role: [1] },
    { key: 'Promo Code', icon: <Icon color='#0e5c98' icon="iconamoon:discount-light" width="22" height="22" />, path: "/PromoCode", role: [1] },
    { key: 'Supplier Registration', icon: <Icon color='#0e5c98' icon="fluent-mdl2:company-directory" width="22" height="22" />, path: "/SupplierRegistration", role: [1] },
    { key: 'Digital Transformation', icon: <Icon color='#0e5c98' icon="carbon:data-vis-1" width="22" height="22" />, path: "/DigitalTransformation", role: [1] },
  ]

function Sidebar({ open, onClose }) {
    // const [user, setUser] = useState("");
    let location = useLocation();
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const { locale, setLocale } = useContext(LocalContext);
    const navigate = useNavigate();

    const list = (
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={onClose}
          onKeyDown={onClose}
        >
          <List sx={{ color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>
            {array1.map((item) => (
            //   item.role.includes(user?.is_admin) && (
              <ListItem sx={{ ".MuiTypography-root": { fontSize: "14px !important" } }} key={item.path} disablePadding>
                <ListItemButton sx={{ bgcolor: location.pathname === item.path ? "#d8763114" : "transparent", "&:hover": { bgcolor: "#d8763129" } }} component={Link} to={item.path}>
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={t(item.key)} sx={{ color: location.pathname === item.path ? "#d87631" : "inherit",  }} />
                </ListItemButton>
              </ListItem>
            //   )
            ))}
          </List>
          <Divider />
          <List sx={{ color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>
            {array2.map((item) => (
            //   item.role.includes(user?.is_admin) && (
              <ListItem sx={{ ".MuiTypography-root": { fontSize: "14px !important" } }} key={item.path} disablePadding>
                <ListItemButton sx={{ bgcolor: location.pathname === item.path ? "#d8763114" : "transparent", "&:hover": { bgcolor: "#d8763129" } }} component={Link} to={item.path}>
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={t(item.key)} sx={{ color: location.pathname === item.path ? "#d87631" : "inherit" }} />
                </ListItemButton>
              </ListItem>
            //   )
            ))}
          </List>
          <Divider />
          <List sx={{ color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>
            {array3.map((item) => (
            //   item.role.includes(user?.is_admin) && (
              <ListItem sx={{ ".MuiTypography-root": { fontSize: "14px !important" } }} key={item.path} disablePadding>
                <ListItemButton sx={{ bgcolor: location.pathname === item.path ? "#d8763114" : "transparent", "&:hover": { bgcolor: "#d8763129" } }} component={Link} to={item.path}>
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={t(item.key)} sx={{ color: location.pathname === item.path ? "#d87631" : "inherit" }} />
                </ListItemButton>
              </ListItem>
            //   )
            ))}
          </List>
          <Divider />
          <List sx={{ color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>
            {array4.map((item) => (
            //   item.role.includes(user?.is_admin) && (
              <ListItem sx={{ ".MuiTypography-root": { fontSize: "14px !important" } }} key={item.path} disablePadding>
                <ListItemButton sx={{ bgcolor: location.pathname === item.path ? "#d8763114" : "transparent", "&:hover": { bgcolor: "#d8763129" } }} component={Link} to={item.path}>
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={t(item.key)} sx={{ color: location.pathname === item.path ? "#d87631" : "inherit" }} />
                </ListItemButton>
              </ListItem>
            //   )
            ))}
          </List>
          <Divider />
          <List sx={{ color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>
            {array5.map((item) => (
            //   item.role.includes(user?.is_admin) && (
              <ListItem sx={{ ".MuiTypography-root": { fontSize: "14px !important" } }} key={item.path} disablePadding>
                <ListItemButton sx={{ bgcolor: location.pathname === item.path ? "#d8763114" : "transparent", "&:hover": { bgcolor: "#d8763129" } }} component={Link} to={item.path}>
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={t(item.key)} sx={{ color: location.pathname === item.path ? "#d87631" : "inherit" }} />
                </ListItemButton>
              </ListItem>
            //   )
            ))}
          </List>
          <Divider />
          <List sx={{ color: theme.palette.mode === "light" ? "#666687" : theme.palette.text.secondary }}>
            {array6.map((item) => (
            //   item.role.includes(user?.is_admin) && (
              <ListItem sx={{ ".MuiTypography-root": { fontSize: "14px !important" } }} key={item.path} disablePadding>
                <ListItemButton sx={{ bgcolor: location.pathname === item.path ? "#d8763114" : "transparent", "&:hover": { bgcolor: "#d8763129" } }} component={Link} to={item.path}>
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={t(item.key)} sx={{ color: location.pathname === item.path ? "#d87631" : "inherit" }} />
                </ListItemButton>
              </ListItem>
            //   )
            ))}
          </List>
        </Box>
      );

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "sidebar"].join(" ")} >
      <Drawer
      className={[locale === "en" ? "ltr" : "rtl", "mine"].join(" ")}
        anchor='left'
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            transform: 'none !important',
          }
        }}
      >
        {list}
      </Drawer>
    </div>
  )
}

export default Sidebar