import { LocalContext } from '../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { useContext, useState, useEffect, useMemo, useRef } from 'react'
import '../css/request.css'
import { Axios } from '../api/Axios';
import { BASE_URL, REQUESTS, ADD_REQUESTS } from '../api/Api';
import axios from 'axios';
import Cookie from 'cookie-universal'
import { Icon } from '@iconify/react';
import pdf from '../assets/pdf.svg'

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
import Avatar from '@mui/material/Avatar';

function isImageFile(file) {
    if (typeof file === 'string') {
      // If it's a URL, check the file extension
      return /\.(jpeg|jpg|gif|png)$/i.test(file);
    } else if (file instanceof File) {
      // If it's a File object, check the MIME type
      return file.type.startsWith('image/');
    }
    return false;
  }

function RequestsTable() {
    const [request, setRequest] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const exportRef = useRef();

    //  ====== get all requests ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${REQUESTS}`,)
            .then(function (response) {
                // console.log(response.data.request_quotes);
                setRequest(response.data.request_quotes.reverse());
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast(error.response.data.message, 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get all requests ========

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

    //  ================ add function ================
    function handleAddClick() {
        navigate('/Requests/New')
    }
    //  ================ add function ================

    //  ================ view function ================
    function handleViewClick(id) {
        navigate(`/Requests/${id}/Details`)
    }
    //  ================ view function ================

    //  ================ edit function ================
    function handleEditClick(id) {
        navigate(`/Requests/${id}/Edit`);
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
            const response = await axios.delete(`${BASE_URL}${ADD_REQUESTS}/${rowToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const updatedRow = request.filter((row) => row.id !== rowToDelete);
            // console.log(response);
            setRequest(updatedRow);
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
                header: (t('User')),
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
            },
            {
                accessorKey: 'upload_file',
                header: (t('Upload File')),
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
                    <div className='table-img'>
                        <Avatar className='table-real-img' src={isImageFile(cell.getValue()) ? cell.getValue() : pdf} alt="myimage" />
                    </div>
                ),
            },
            {
                accessorKey: 'name',
                header: (t('Requests')),
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
                accessorKey: 'category',
                header: (t('Category')),
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
                accessorKey: 'type',
                header: (t('Type')),
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
                accessorKey: 'country',
                header: (t('Country')),
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
                accessorKey: 'state',
                header: (t('State')),
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
                accessorKey: "status",
                header: t("Status"),
                size: 150,
                muiTableHeadCellProps: {
                  align: "center",
                },
                muiTableBodyCellProps: {
                  align: "center",
                },
                muiTableFooterCellProps: {
                  align: "center",
                },
                Cell: ({ cell }) => (
                  <div className="">
                    <div
                      style={{
                        backgroundColor:
                          cell.getValue() === "published" ? green[100] : red[100],
                        padding: "5px",
                        borderRadius: "5px",
                        color: cell.getValue() === "published" ? green[700] : red[700],
                        border: `1px solid ${
                          cell.getValue() === "published" ? green[300] : red[300]
                        }`,
                      }}
                    >
                      {cell.getValue()}
                    </div>
                  </div>
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
        return request.map((row, index) => {
            return { ...row, index: index + 1 };
        });
    }, [request]);

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "requesttable"].join(" ")}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', my: 2 }}>

                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {t('Requests')}
                </Typography>

                <div className="stack-group" >
                    <Stack onClick={handleAddClick} direction='row' className='addBtn' >
                        <div className='addBtn-link' >
                            <span style={{ display: 'inherit' }}>
                                <AddIcon sx={{ fontSize: "20px" }} />
                            </span>
                            {t("New Request")}
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
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-request-quotes" target="_blank" rel="noopener noreferrer">
                                <div>{t('All Requests')}</div>
                            </a>
                        </li>
                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-request-quotes-by-type?type=request supplier" target="_blank" rel="noopener noreferrer">
                                <div>{t('Supplier Requests')}</div>
                            </a>
                        </li>
                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-request-quotes-by-type?type=request contractor" target="_blank" rel="noopener noreferrer">
                                <div style={{ fontSize: '13px' }}>{t('Contractor Requests')}</div>
                            </a>
                        </li>

                        <li onClick={handleLinkClick}>
                            <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-request-quotes-by-type?type=request engineering drawing" target="_blank" rel="noopener noreferrer">
                                <div>{t('Engineer Requests')}</div>
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

export default RequestsTable