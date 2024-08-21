import { LocalContext } from '../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../css/userstable.css'
import { Axios } from '../api/Axios';
import { BASE_URL, USERS } from '../api/Api';
import axios from 'axios';
import Cookie from 'cookie-universal'
import { Icon } from '@iconify/react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { red, green, orange } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';

function StatisticThirdTable({ activeUsers }) {
  const [users, setUsers] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //  ====== get all Users ========
  useEffect(() => {
    if (activeUsers?.active_users) {
      setUsers(activeUsers?.active_users.reverse());
    } else {
      setUsers([]);
    }
  }, [users]);
  //  ====== get all Users ========

  //  ================ view function ================
  function handleViewClick(id) {
    navigate(`/Users/${id}/View`)
  }
  //  ================ view function ================

  //  ================ edit function ================
  function handleEditClick(id) {
    navigate(`/Users/${id}/Edit`);
  }
  //  ================ edit function ================

  //  ====== open && close delete state ========
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  //  ====== open && close delete state ========

  //  ================ delete function ================
  function handleDeleteClick(id) {
    setRowToDelete(id);
    setShowDeleteDialog(true);
  }

  function handleDeleteClose() {
    setShowDeleteDialog(false);
  }

  async function handleDeleteConfirm() {
    setLoading(true);
    const cookies = Cookie()
    const token = cookies.get('dashboard')

    try {
      const response = await axios.delete(`${BASE_URL}${USERS}/${rowToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const updatedRow = users.filter((row) => row.id !== rowToDelete);
      // console.log(updatedRow);
      setUsers(updatedRow);
      handleDeleteClose();
      setLoading(false);
      showHideToast(t('Deleted successfully'));
    } catch (error) {
      console.log(error);
      setLoading(false);
      showHideToast(t('An error occurred. Please try again.'), 'error');
    }
  }
  //  ================ delete function ================

  const columns = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: '#',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'profile_image',
        header: (t('Image')),
        size: 150,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ cell }) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {cell.getValue() ? (
              <Avatar alt="Profile Image" src={cell.getValue()} />
            ) : (
              <Avatar>{cell.row.original.name.charAt(0)}</Avatar>
            )}
          </div>
        )
      },
      {
        accessorKey: 'name',
        header: (t('Name')),
        size: 150,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'email',
        header: (t('Email')),
        size: 150,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'is_admin',
        header: (t('Admin')),
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ cell }) => (
          <Typography align="center" sx={{ backgroundColor: cell.getValue() ? green[100] : red[100], color: cell.getValue() ? green[700] : red[700], border: `1px solid ${cell.getValue() ? green[300] : red[300]}`, borderRadius: '4px' }}>
            {cell.getValue() ? t('Yes') : t('No')}
          </Typography>
        ),
      },
      {
        accessorKey: 'Action',
        header: (t('Actions')),
        size: 150,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ cell }) => (
          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
            <IconButton onClick={() => handleViewClick(cell.row.original.id)}>
              <VisibilityIcon color="action" fontSize="small" />
            </IconButton>
            <IconButton onClick={() => handleEditClick(cell.row.original.id)}>
              <ModeEditIcon color="primary" fontSize="small" />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(cell.row.original.id)}>
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [t],
  );

  const renderedRows = useMemo(() => {
    return users.map((row, index) => {
      return { ...row, index: index + 1 };
    });
  }, [users]);

  const table = useMaterialReactTable({
    columns,
    data: renderedRows,
    initialState: { density: 'compact', pagination: { pageSize: 5 } },
  });

  // ======================= loading ========================
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "statistictable"].join(" ")}>
      <div className="paper-statistictable">
        <Stack direction="row" className='statistictable-title'>

          <Typography className='statistictable-text-title' sx={{ fontSize: '20px', fontWeight: 'bold' }}>
            {t('Active Users')}
          </Typography>

          <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-active-users" target="_blank" rel="noopener noreferrer">
            <div className="stack-export">
              <Icon icon="solar:export-bold" width="20" height="20" />
              <div className="export-text">{(t('Export'))}</div>
            </div>
          </a>

        </Stack>

        <MaterialReactTable table={table} />
      </div>

      {/* ================ delete dialog ================ */}
      <Dialog
        dir={locale === "en" ? "ltr" : "rtl"}
        // className={locale === "en" ? "ltr" : "rtl"}
        open={showDeleteDialog}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('Are you sure you want to delete this item?')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className='dialogDelete' sx={{ padding: "0 0 10px !important", }} id="alert-dialog-description">
            {t('This item will be permanently deleted.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleDeleteClose} sx={{ textTransform: 'capitalize' }}>{t('Disagree')}</Button>
          <Button className='dialogDeleteBtn' variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ textTransform: 'capitalize' }} autoFocus>
            {t('Agree')}
          </Button>
        </DialogActions>
      </Dialog>
      {/* ================ delete dialog ================ */}
    </div>
  )
}

export default StatisticThirdTable