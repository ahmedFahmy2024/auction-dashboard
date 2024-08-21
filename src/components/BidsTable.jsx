import { LocalContext } from '../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../css/bidstable.css'
import { Axios } from '../api/Axios';
import { BASE_URL, BIDS, SCRAPS } from '../api/Api';
import axios from 'axios';
import Cookie from 'cookie-universal'
import { Icon } from '@iconify/react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { red, green, orange } from '@mui/material/colors';

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

function BidsTable() {
  const [bids, setBids] = useState([]);
  const [scraps, setScraps] = useState([]);
  const { locale, setLocale } = useContext(LocalContext);
  const { showHideToast } = useContext(ToastContext);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //  ====== get all data ========
  useEffect(() => {
    setLoading(true);
    Axios.get(`${BIDS}`,)
      .then(function (response) {
        const BidsData = response.data.bids;
        Axios.get(`${SCRAPS}`,)
          .then(function (response) {
            const ScrapData = response.data.scraps;
            setScraps(ScrapData);
            // Map transactions to include packageName and userName
            const BidsWithData = BidsData.map(bid => {
              const correspondingScrap = ScrapData.find(scrap => scrap.id === bid.scrap_id);
              return {
                ...bid,
                ScrapName: correspondingScrap ? correspondingScrap?.name : '',
                ScrapCategory: correspondingScrap ? correspondingScrap?.category : '',
              };
            });
            setBids(BidsWithData.reverse());
            // console.log("bids", BidsWithData);
            setLoading(false);
          })
          .catch(function (error) {
            console.log(error);
            setLoading(false);
          });
      })
      .catch(function (error) {
        console.log(error);
        showHideToast(error.response.data.message, 'error');
        setLoading(false);
      });
  }, []);

  //  ====== get all data ========

  //  ================ add function ================
  function handleAddClick() {
    navigate('/Bids/New')
  }
  //  ================ add function ================

  //  ================ view function ================
  function handleViewClick(id) {
    navigate(`/Bids/${id}/Details`)
  }
  //  ================ view function ================

  //  ================ edit function ================
  function handleEditClick(id) {
    navigate(`/Bids/${id}/Edit`);
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
      const response = await axios.delete(`${BASE_URL}${BIDS}/${rowToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const updatedRow = bids.filter((row) => row.id !== rowToDelete);
      // console.log(updatedRow);
      setBids(updatedRow);
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
        accessorKey: 'user.name',
        header: (t('User Name')),
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
        accessorKey: 'ScrapName',
        header: (t('Scrap Name')),
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
        accessorKey: 'ScrapCategory',
        header: (t('Scrap Category')),
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
        accessorKey: 'price',
        header: (t('Price')),
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
        accessorKey: 'quantity',
        header: (t('Quantity')),
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
        accessorKey: 'created_at',
        header: (t('Created at')),
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
        Cell: ({ cell }) => formatCreatedAt(cell.getValue()),
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
    return bids.map((row, index) => {
      return { ...row, index: index + 1 };
    });
  }, [bids]);

  const table = useMaterialReactTable({
    columns,
    data: renderedRows,
    initialState: { density: 'compact', pagination: { pageSize: 25 } },
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
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "bidstable"].join(" ")}>
      <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', my: 2 }}>

        <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
          {t('Bids')}
        </Typography>

        <div className="stack-group">
          <Stack onClick={handleAddClick} direction='row' className='addBtn' >
            <div className='addBtn-link' >
              <span style={{ display: 'inherit' }}>
                <AddIcon sx={{ fontSize: "20px" }} />
              </span>
              {t("New Bid")}
            </div>
          </Stack>
          <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-bids" target="_blank" rel="noopener noreferrer">
            <div className="stack-export">
              <Icon icon="solar:export-bold" width="20" height="20" />
              <div className="export-text">{(t('Export'))}</div>
            </div>
          </a>
        </div>

      </Stack>

      <MaterialReactTable table={table} />

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

export default BidsTable