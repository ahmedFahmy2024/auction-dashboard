import { LocalContext } from '../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { useContext, useState, useEffect, useMemo, useCallback } from 'react'
import '../css/projectstable.css'
import { Axios } from '../api/Axios';
import { BASE_URL, PROMOCODDES, USERS } from '../api/Api';
import axios from 'axios';
import Cookie from 'cookie-universal'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Stack } from '@mui/material';
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

const PromosTable = () => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const { locale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    //  ====== get users ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${USERS}`,)
            .then(function (response) {
                // console.log(response.data.users);
                const data = response.data.users;
                setUsers(data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast("Something went wrong", 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get users ========

    //  ====== get all promos ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${PROMOCODDES}`,)
            .then(function (response) {
                // console.log(response.data);
                setProjects(response.data.reverse());
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast(t('An error occurred. Please try again.'), 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get all promos ========

    //  ================ add function ================
    function handleAddClick() {
        navigate('/PromoCode/New')
    }
    //  ================ add function ================

    //  ================ view function ================
    function handleViewClick(id) {
        navigate(`/PromoCode/${id}/Details`)
    }
    //  ================ view function ================

    //  ================ edit function ================
    function handleEditClick(id) {
        navigate(`/PromoCode/${id}/Edit`);
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
            const response = await axios.delete(`${BASE_URL}${PROMOCODDES}/${rowToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const updatedRow = projects.filter((row) => row.id !== rowToDelete);
            // console.log(response);
            setProjects(updatedRow);
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

    const getUsername = useCallback((userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.name : 'Unknown';
    }, [users]);

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
                accessorKey: 'code',
                header: (t('Code')),
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
                accessorKey: 'user_id',
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
                Cell: ({ cell }) => {
                    return <Typography align="center">{getUsername(cell.getValue())}</Typography>;
                },
            },
            {
                accessorKey: 'duration',
                header: (t('Duration')),
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
                accessorKey: 'expire_date',
                header: (t('Expire Date')),
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
                accessorKey: 'usage_count_count',
                header: (t('Usage Count')),
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
        [t, getUsername],
    );

    const renderedRows = useMemo(() => {
        return projects.map((row, index) => {
            return { ...row, index: index + 1, userName: getUsername(row.user_id) };
        });
    }, [projects, getUsername]);

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "projectstable"].join(" ")}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', my: 2 }}>

                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {t('Promo Codes')}
                </Typography>

                <div className="stack-group">
                    <Stack onClick={handleAddClick} direction='row' className='addBtn' >
                        <div className='addBtn-link' >
                            <span style={{ display: 'inherit' }}>
                                <AddIcon sx={{ fontSize: "20px" }} />
                            </span>
                            {t("New Promo Code")}
                        </div>
                    </Stack>
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

export default PromosTable