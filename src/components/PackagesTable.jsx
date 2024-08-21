import { LocalContext } from '../context/LocalContext'
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastContext from '../context/ToastProvider';
import { useContext, useState, useEffect, useMemo } from 'react'
import '../css/packagetable.css'
import { Axios } from '../api/Axios';
import { PACKAGES } from '../api/Api';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Icon } from '@iconify/react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Typography } from '@mui/material';

function PackagesTable() {
    const [packages, setPackages] = useState([]);
    const { locale, setLocale } = useContext(LocalContext);
    const { showHideToast } = useContext(ToastContext);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    //  ====== get all Packages ========
    useEffect(() => {
        setLoading(true);
        Axios.get(`${PACKAGES}`,)
            .then(function (response) {
                // console.log(response.data);
                setPackages(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast(error.response.data.message, 'error');
                setLoading(false);
            });
    }, []);
    //  ====== get all Packages ========

    //  ================ view function ================
    function handleViewClick(id) {
        navigate(`/Packages/${id}/Details`)
    }
    //  ================ view function ================

    //  ================ edit function ================
    function handleEditClick(id) {
        navigate(`/Packages/${id}/Edit`);
    }
    //  ================ edit function ================

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
                Cell: ({ cell }) => (
                    <Typography sx={{
                        backgroundColor: cell.getValue().includes('سكراب') ? '#fdba74' : cell.getValue().includes('الفضية') ? "#D3D3D3" : "#FFD700", borderWidth: "1px", borderStyle: "solid",
                        padding: "5px", borderRadius: "5px", fontSize: "0.875rem", borderColor: cell.getValue().includes('سكراب') ? "#C18542" : cell.getValue().includes('الفضية') ? "#99A4AC" : "#B5CB00",
                    }}>
                        {cell.getValue()}
                    </Typography>
                )
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
                            <ModeEditIcon color="primary" fontSize="small" />
                        </IconButton>
                    </Stack>
                ),
            },
        ],
        [t],
    );

    const renderedRows = useMemo(() => {
        return packages.map((row, index) => {
            return { ...row, index: index + 1 };
        });
    }, [packages]);

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
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "packagetable"].join(" ")}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', my: 2 }}>

                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {t('Packages')}
                </Typography>

                <div className="stack-group">
                    <Stack onClick={() => handleViewClick()} direction='row' className='addBtn' >
                        <div className='addBtn-link' >
                            <span style={{ display: 'inherit' }}>
                                <VisibilityIcon sx={{ fontSize: "20px" }} />
                            </span>
                            {t("View Packages")}
                        </div>
                    </Stack>
                    <a className="stack-export-link" href="https://construction.site-pocket.com/api/export-packages" target="_blank" rel="noopener noreferrer">
                        <div className="stack-export">
                            <Icon icon="solar:export-bold" width="20" height="20" />
                            <div className="export-text">{(t('Export'))}</div>
                        </div>
                    </a>
                </div>

            </Stack>

            <MaterialReactTable table={table} />
        </div>
    )
}

export default PackagesTable