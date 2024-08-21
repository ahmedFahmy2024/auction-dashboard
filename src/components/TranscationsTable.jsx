import { LocalContext } from '../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { useContext, useState, useEffect, useMemo, useRef } from 'react'
import '../css/transcationtable.css'
import { Axios } from '../api/Axios';
import { BASE_URL, TRANSCATIONS, SUBSCRIPTIONS } from '../api/Api';
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

function TranscationsTable() {
    const [transcation, setTranscation] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef =useRef();
    const exportRef = useRef();

        // menu export
        const handleExportClick = (e) => {
            e.stopPropagation(); // Prevent event bubbling
            setOpen(!open);
        };
    
        const handleLinkClick = () => {
            setOpen(false);
        };
    
        useEffect(() => {
            const handleClickOutside = (e) => {
                if (menuRef.current && !menuRef.current.contains(e.target) && exportRef.current && !exportRef.current.contains(e.target)) {
                    setOpen(false);
                }
            };
            window.addEventListener('click', handleClickOutside);
            return () => {
                window.removeEventListener('click', handleClickOutside);
            };
        }, []);
        // menu export

    //  ====== get all data ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${TRANSCATIONS}`,)
            .then(function (response) {
                const TranscationData = response.data.transactions;
                Axios.get(`${SUBSCRIPTIONS}`,)
                    .then(function (response) {
                        const subscriptionData = response.data;
                        setSubscriptions(subscriptionData);
                        // Map transactions to include packageName and userName
                        const transactionsWithData = TranscationData.map(transaction => {
                            const correspondingSubscription = subscriptionData.find(subscription => subscription.id === transaction.subscription_id);
                            return {
                                ...transaction,
                                packageName: correspondingSubscription ? correspondingSubscription?.package?.name : '',
                                userName: correspondingSubscription ? correspondingSubscription?.user?.name : '',
                            };
                        });
                        setTranscation(transactionsWithData.reverse());
                        // console.log("transcation", transactionsWithData);
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
        navigate('/Transcations/New')
    }
    //  ================ add function ================

    //  ================ view function ================
    function handleViewClick(id) {
        navigate(`/Transcations/${id}/Details`)
    }
    //  ================ view function ================

    //  ================ edit function ================
    function handleEditClick(id) {
        navigate(`/Transcations/${id}/Edit`);
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
            const response = await axios.delete(`${BASE_URL}${TRANSCATIONS}/${rowToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const updatedRow = transcation.filter((row) => row.id !== rowToDelete);
            // console.log(response);
            setTranscation(updatedRow);
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
                accessorKey: 'userName',
                header: (t('User Name')),
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
                accessorKey: 'packageName',
                header: (t('Package Name')),
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
                accessorKey: 'payment_method',
                header: (t('Payment Method')),
                // size: 150,
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
                accessorKey: 'transaction_id',
                header: (t('Transaction Id')),
                // size: 150,
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
                accessorKey: 'amount',
                header: (t('Amount')),
                // size: 100,
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
                // size: 150,
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
                // size: 80,
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
                                cell.getValue() === 'success'
                                    ? green[100]
                                    : cell.getValue() === 'pending'
                                        ? orange[100]
                                        : red[100],
                            border: `1px solid ${cell.getValue() === 'success'
                                ? green[300]
                                : cell.getValue() === 'pending'
                                    ? orange[300]
                                    : red[300]}`,
                            borderRadius: '4px',
                            color:
                                cell.getValue() === 'success'
                                    ? green[700]
                                    : cell.getValue() === 'pending'
                                        ? orange[700]
                                        : red[700],
                        }}
                    >
                        {cell.getValue()}
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
        return transcation.map((row, index) => {
            return { ...row, index: index + 1 };
        });
    }, [transcation]);

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "transcationtable"].join(" ")}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', my: 2 }}>

                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {t('Transcations')}
                </Typography>

                <div className="stack-group" >
                    <Stack onClick={handleAddClick} direction='row' className='addBtn' >
                        <div className='addBtn-link' >
                            <span style={{ display: 'inherit' }}>
                                <AddIcon sx={{ fontSize: "20px" }} />
                            </span>
                            {t("New Transcation")}
                        </div>
                    </Stack>
                    <div ref={exportRef} className="stack-export" onClick={handleExportClick}>
                        <Icon icon="solar:export-bold" width="20" height="20" />
                        <div className="export-text">{(t('Export'))}</div>
                    </div>
                </div>

            </Stack>
            {open &&
                <Box ref={menuRef} className={[locale === "en" ? "ltr" : "rtl", "menu-export"]} sx={{ bgcolor: theme.palette.mode === "light" ? "#fff" : "#212b36e6" }}>
                    <ul >
                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions" target="_blank" rel="noopener noreferrer">
                                <div>{t('All Transcations')}</div>
                            </a>
                        </li>
                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions-by-package?package_name=الباقة سكراب 3 شهور" target="_blank" rel="noopener noreferrer">
                                <div>{t('Scrap 3 Months')}</div>
                            </a>
                        </li>
                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions-by-package?package_name=الباقة سكراب 6 شهور" target="_blank" rel="noopener noreferrer">
                                <div>{t('Scrap 6 Months')}</div>
                            </a>
                        </li>

                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions-by-package?package_name=الباقة سكراب 12 شهور" target="_blank" rel="noopener noreferrer">
                                <div>{t('Scrap 12 Months')}</div>
                            </a>
                        </li>

                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions-by-package?package_name=الباقة الفضية 3 شهور" target="_blank" rel="noopener noreferrer">
                                <div>{t('Silver 3 Months')}</div>
                            </a>
                        </li>
                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions-by-package?package_name=الباقة الفضية 6 شهور" target="_blank" rel="noopener noreferrer">
                                <div>{t('Silver 6 Months')}</div>
                            </a>
                        </li>

                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions-by-package?package_name=الباقة الفضية 12 شهور" target="_blank" rel="noopener noreferrer">
                                <div>{t('Silver 12 Months')}</div>
                            </a>
                        </li>
                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions-by-package?package_name=الباقة الذهبية 3 شهور" target="_blank" rel="noopener noreferrer">
                                <div>{t('Gold 3 Months')}</div>
                            </a>
                        </li>
                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions-by-package?package_name=الباقة الذهبية 6 شهور" target="_blank" rel="noopener noreferrer">
                                <div>{t('Gold 6 Months')}</div>
                            </a>
                        </li>
                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-transactions-by-package?package_name=الباقة الذهبية 12 شهور" target="_blank" rel="noopener noreferrer">
                                <div>{t('Gold 12 Months')}</div>
                            </a>
                        </li>

                    </ul>
                </Box>
            }

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

export default TranscationsTable