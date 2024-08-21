import SnackBar from '../components/SnackBar';

import { createContext, useState } from 'react';
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

    const [openSb, setOpenSb] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    function showHideToast(message, severity = 'success') {
        setOpenSb(true);
        setMessage(message);
        setSeverity(severity);
        setTimeout(() => {
            setOpenSb(false);
        }, 4000);
    }

    return (
        <ToastContext.Provider value={{ showHideToast }}>
            <SnackBar openSb={openSb} message={message} severity={severity} />
            {children}
        </ToastContext.Provider>
    )
}
export default ToastContext