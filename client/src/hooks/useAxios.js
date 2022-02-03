import Axios from 'axios';
import { useEffect, useState } from 'react';

const useAxios = (url, deps = []) => {
	const [data, setData] = useState(null);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const cancelToken = Axios.CancelToken.source();

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

		return () => cancelToken.cancel();
	}, [url, ...deps]);

	return { data, isPending, error };
};

export default useAxios;
