import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const SearchInput = () => {
	const history = useHistory();
	const [name, setName] = useState('');
	const [subs, setSubs] = useState([]);
	const [timer, setTimer] = useState(null);

	const searchSubs = async () => {
		clearTimeout(timer);
		setTimer(
			setTimeout(async () => {
				try {
					const { data } = await Axios.get(`/subs?name=${name}`);
					setSubs(data);
				} catch (err) {
					toast(err.message);
				}
			}, 250)
		);
	};

	useEffect(() => {
		if (name.trim() === '') {
			setSubs([]);
			return;
		}
		searchSubs();
	}, [name]);

	const goToSub = (subname) => {
		history.push(`/r/${subname}`);
		setName('');
	};

	return (
		<div className="max-w-full px-4 w-160">
			<div className="relative flex items-center text-gray-100 border rounded border-dark-300 bg-dark-500 hover:border-dark-100 hover:bg-dark-400">
				<i className="pl-4 pr-3 fas fa-search" />
				<input
					type="text"
					className="w-full py-1 pr-3 bg-transparent rounded focus:outline-none"
					placeholder="Search"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<div className="absolute left-0 right-0 mt-2 bg-dark-400" style={{ top: '100%' }}>
					{subs.map((sub) => (
						<div
							className="flex items-center px-4 py-3 cursor-pointer hover:bg-dark-500"
							key={sub.name}
							onClick={() => goToSub(sub.name)}
						>
							<img src={sub.imageUrl} className="w-8 rounded-full" alt="Sub" />
							<div className="ml-4 text-sm">
								<p className="font-medium">{sub.name}</p>
								<p>{sub.title}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SearchInput;
