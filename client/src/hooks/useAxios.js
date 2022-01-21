import Axios from 'axios';
import { useEffect, useState } from 'react';

const useAxios = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cancelToken = Axios.CancelToken.source();

        setTimeout(() => {
            Axios.get(url, { cancelToken: cancelToken.token })
                .then((res) => {
                    setIsPending(false);
                    setData(res.data);
                    setError(null);
                })
                .catch((err) => {
                    setIsPending(false);
                    setError(err.message);
                    setData(null);
                });
        }, 1000);

        return () => cancelToken.cancel();
    }, [url]);

    return { data, isPending, error };
};

export default useAxios;
