import { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../api/Api';
import { Axios } from '../api/Axios';
import showHideToast from '../context/ToastProvider';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const UserContext = createContext([]);

const UsersProvider = ({ children, id }) => {
    const [profile, setProfile] = useState([]);
    const [currentSub, setCurrentSub] = useState([]);
    const [subscribtions, setSubscribtions] = useState([]);
    const [nonFilterSub, setNonFilterSub] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [scraps, setScraps] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chat, setChat] = useState([]);
    const [complains, setComplains] = useState([]);
    const [CurrentSubscribtionId, setCurrentSubscribtionId] = useState({});
    // console.log("providerid", id)


    //  ====== get all user info ========
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        Axios.get(`${USERS}/${id}`,)
            .then(function (response) {
                // console.log("current_subscription", response.data)
                // ================== profile tab =================
                setProfile(response.data.user);

                // ================= subscription tab =================
                setCurrentSub(response.data.current_subscription);

                // ================= subscribtions tab =================
                const currentSubscription = response.data.current_subscription;
                if (currentSubscription) {
                    const CurrentSubscribtionId1 = currentSubscription.id;
                    setCurrentSubscribtionId(CurrentSubscribtionId1);
                    const filteredSubscribtions = response.data.subscriptions.filter((sub) => sub.id !== CurrentSubscribtionId1);
                    setSubscribtions(filteredSubscribtions);
                } else {
                    setSubscribtions(response.data.subscriptions);
                }
                setNonFilterSub(response.data.subscriptions);

                // ================= transactions tab =================
                setTransactions(response.data.transactions);

                // ================== request tab =================
                setRequests(response.data.requests);

                // ================== portfolio tab =================
                setPortfolios(response.data.portfolios);

                // ================== scrap tab =================
                setScraps(response.data.scraps);

                // ================== bids tab =================
                setBids(response.data.user_bids);

                // ================== chat tab =================
                setChat(response.data.chat_rooms);

                // ================== complains tab =================
                setComplains(response.data.complaints);

                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                showHideToast(error.response.data.message, 'error');
                setLoading(false);
            });
    }, [id]);
    //  ====== get all user info ========

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
    // console.log("providerchat", chat)
    return (
        <UserContext.Provider value={{ chat, complains, profile, currentSub, subscribtions, transactions, nonFilterSub, requests, portfolios, scraps, bids }}>
            {children}
        </UserContext.Provider>
    )
}

export { UsersProvider }

// custom hook
export const useUsers = () => {
    return useContext(UserContext);
}