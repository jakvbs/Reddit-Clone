import { Sub } from '../../../types';

const Banner = ({ sub }) => {
	return (
		<div>
			<div className="h-20 bg-blue-banner" />
			<div className="h-20 bg-dark-400">
				<div className="container relative flex">
					<div className="absolute" style={{ top: -15 }}>
						<img src={sub.imageUrl} alt="Sub" className="rounded-full" width={70} height={70} />
					</div>
					<div className="pt-1 pl-24">
						<div className="flex items-center">
							<h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
						</div>
						<p className="text-sm font-bold text-gray-500">/r/{sub.name}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

Banner.propTypes = {
	sub: Sub.isRequired,
};

export default Banner;
