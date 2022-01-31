import SettingsForm from './SettingsForm';

const Settings = () => {
	return (
		<main className="flex bg-dark-600 flex-col justify-center items-center pl-6 h-screen w-screen">
			<div className="w-96">
				<h1 className="mb-3 text-2xl text-center font-medium">Your Settings</h1>
				<SettingsForm />
			</div>
		</main>
	);
};

export default Settings;
