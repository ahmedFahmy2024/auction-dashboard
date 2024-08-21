import { LocalContext } from '../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../css/statistictable.css'
import { Axios } from '../api/Axios';
import { BASE_URL, SUBSCRIPTIONS } from '../api/Api';
import axios from 'axios';
import Cookie from 'cookie-universal'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Icon } from '@iconify/react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { red, green, orange } from '@mui/material/colors';

function StatisticTable({ charts }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    //  ====== get all subscriptions ========
    useEffect(() => {
        if (charts?.subscriptions_ending_next_seven_days) {
            setSubscriptions(charts.subscriptions_ending_next_seven_days.reverse());
        } else {
            setSubscriptions([]);
        }
    }, [charts]);
    //  ====== get all subscriptions ========

    //  ================ add function ================
    function handleAddClick() {
        navigate('/Subscriptions/New')
    }
    //  ================ add function ================

    //  ================ view function ================
    function handleViewClick(id) {
        navigate(`/Subscriptions/${id}/Details`)
    }
    //  ================ view function ================

    //  ================ edit function ================
    function handleEditClick(id) {
        navigate(`/Subscriptions/${id}/Edit`);
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
            const response = await axios.delete(`${BASE_URL}${SUBSCRIPTIONS}/${rowToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const updatedRow = subscriptions.filter((row) => row.id !== rowToDelete);
            // console.log(response);
            setSubscriptions(updatedRow);
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
                size: 50,
                grow: false,
                minSize: 49,
                maxSize: 51,
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
                header: (t('Client Name')),
                size: 100,
                grow: false,
                minSize: 99,
                maxSize: 101,
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
                accessorKey: 'package.name',
                header: (t('Package')),
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
                accessorKey: 'start_date',
                header: (t('Start Date')),
                size: 100,
                grow: false,
                minSize: 99,
                maxSize: 101,
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
                accessorKey: 'end_date',
                header: (t('End Date')),
                size: 100,
                grow: false,
                minSize: 99,
                maxSize: 101,
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
        return subscriptions.map((row, index) => {
            return { ...row, index: index + 1 };
        });
    }, [subscriptions]);

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
                        {t('Subscriptions Ends Next 7 Days')}
                    </Typography>

                    <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-subscriptions-ending-next-seven-days" target="_blank" rel="noopener noreferrer">
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

export default StatisticTable