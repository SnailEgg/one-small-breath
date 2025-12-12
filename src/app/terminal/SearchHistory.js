import axios from "axios";
import HistoryItem from "./HistoryItem";
import React from "react";
import { useRouter } from "next/navigation";
import store from "@/redux/store";
import { connect } from "react-redux";
import { setUser } from "@/redux/user-slice";

const SearchHistory = ({ document, setDocument, setShowHistory, setUser }) => {
    const storedSearches = store.getState().user?.user?.storedSearches || [];

    const [ items, setItems ] = React.useState(storedSearches);
    const [ hasFetched, setHasFetched ] = React.useState(items.length > 0);
    const router = useRouter();

    React.useEffect(() => {
        setUser({ ...store.getState().user.user, storedSearches: items });
    }, [items]);

    React.useEffect(() => {
        (async () => {
            try {
                const historyResponse = await axios.get('/api/search/history/');
                setItems(historyResponse.data.searches);
            } catch ({ status }) {
                if (status === 401 || status === 403) {
                    setUser(null);
                    router.push("/authenticate/login");
                }
                setItems([]);
            } finally {
                setHasFetched(true);
            }
        })();
    }, [document]);

    return (
        <div className="overflow-y-hidden min-w-full grow flex flex-col">
            <h2 className="text-xl text-center md:text-start mb-2">Search History</h2>
            <div className="overflow-y-auto w-full scrollbar-terminal">
                { hasFetched
                    ? ( items.length > 0
                        ? items.map(({ _id, document_code }) => {
                            return <HistoryItem key={_id} document_code={document_code} setDocument={setDocument} setShowHistory={setShowHistory} />
                          })
                        : <p className="italic text-center md:text-start">No history to display</p>
                    )
                    : <p className="italic text-center md:text-start">Loading search history...</p>
                }
            </div>
        </div>
    )
}

export default connect(null, {setUser})(SearchHistory);