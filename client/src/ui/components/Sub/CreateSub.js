import SubForm from './SubForm';

const CreateSub = () => {
	return (
		<div className="flex w-screen h-screen bg-dark-400">
			<div className="flex flex-col justify-center pl-6 m-auto">
				<h1 className="mb-2 text-lg font-medium">Create a Community</h1>
				<hr />
				<SubForm />
			</div>
		</div>
	);
};

export default CreateSub;
