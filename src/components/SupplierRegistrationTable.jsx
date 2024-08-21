import { LocalContext } from '../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../css/categorytable.css'
import { Axios } from '../api/Axios';
import { BASE_URL, SUPPLIER_REGISTRATION } from '../api/Api';
import axios from 'axios';
import Cookie from 'cookie-universal'
import { Icon } from '@iconify/react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { blue, green, grey, orange } from '@mui/material/colors';

const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
};

function SupplierRegistrationTable() {
    const [registrations, setRegistrations] = useState([]);
    const { locale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    //  ====== get all supplier-registrations ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${SUPPLIER_REGISTRATION}`,)
            .then(function (response) {
                // console.log(response.data);
                setRegistrations(response.data.reverse());
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast("Something went wrong", 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get all supplier-registrations ========

    //  ================ edit function ================
    function handleEditClick(id) {
        navigate(`/SupplierRegistration/${id}/Edit`);
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
            const response = await axios.delete(`${BASE_URL}${SUPPLIER_REGISTRATION}/${rowToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const updatedRow = registrations.filter((row) => row.id !== rowToDelete);
            // console.log(response);
            setRegistrations(updatedRow);
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
                accessorKey: 'id',
                header: (t('ID')),
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
                header: (t('Client')),
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
                accessorKey: 'company_name',
                header: (t('Company Name')),
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
                accessorKey: 'company_name_qualification',
                header: (t('Company Qualification')),
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
                accessorKey: 'commercial_registration_number',
                header: (t('Commercial Registration Number')),
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
                accessorKey: 'location',
                header: (t('Location')),
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
                header: (t('Created At')),
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
                accessorKey: 'status',
                header: (t('Status')),
                size: 100,
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
                    <Box
                        component="div"
                        sx={{
                            backgroundColor:
                                cell.getValue() === 'resolved'
                                    ? green[100]
                                    : cell.getValue() === 'in_progress'
                                        ? orange[100]
                                        : cell.getValue() === "open"
                                            ? blue[100]
                                            : grey[100],
                            border: `1px solid ${cell.getValue() === 'resolved'
                                ? green[300]
                                : cell.getValue() === 'in_progress'
                                    ? orange[300]
                                    : cell.getValue() === "open"
                                        ? blue[300]
                                        : grey[300]}`,
                            borderRadius: '4px',
                            color:
                                cell.getValue() === 'resolved'
                                    ? green[700]
                                    : cell.getValue() === 'in_progress'
                                        ? orange[700]
                                        : cell.getValue() === "open"
                                            ? blue[700]
                                            : grey[700],
                        }}
                    >
                        {t(cell.getValue())}
                    </Box>
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
                        <IconButton onClick={() => handleEditClick(cell.row.original.id)}>
                            <VisibilityIcon color="action" fontSize="small" />
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
        return registrations.map((row, index) => {
            return { ...row, index: index + 1 };
        });
    }, [registrations]);

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "categories"].join(" ")}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {t('Supplier Registration')}
                </Typography>

                <div className="stack-group">
                    <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-supplier-registrations" target="_blank" rel="noopener noreferrer">
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

export default SupplierRegistrationTable